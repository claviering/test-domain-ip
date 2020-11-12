#! /usr/bin/env node
const ora = require('ora');
const ping = require('ping');
const reptile = require('./reptile')
const commander = require('commander');
const logSymbols = require('log-symbols');

commander.version('1.0.0').description('test domain ip').parse(process.argv);

async function run(args) {
  let domain = args[0];
  const spinner = ora(`test ${domain} ...`).start();
  if (!args || !args.length) {
    spinner.fail("domain is empty, try again");
    return;
  }
  let res = await reptile(domain);
  if (!res || !res.data || !res.data.length) {
    spinner.fail(`finding ${domain} ip is empty, try again`);
    return;
  }
  let ipList = res.data.map(item => item.ip);
  let promisseList = [];
  for (let index = 0; index < ipList.length; index++) {
    const ip = ipList[index];
    promisseList.push(ping.promise.probe(ip));
  }
  let resultList = await Promise.all(promisseList);
  let messageList = []
  let count = 0;
  for (let index = 0; index < resultList.length; index++) {
    const isAlive = resultList[index];
    const ip = ipList[index];
    if (isAlive && isAlive.alive) {
      count += 1;
      messageList.push({
        status: logSymbols.success,
        ip: ip
      })
    } else {
      messageList.unshift({
        status: logSymbols.error,
        ip: ip
      })
    }
  }
  console.log();
  messageList.forEach(item => {
    console.log(item.status, item.ip);
  })
  spinner.info(ipList.length + ' total; ' + count + ' success; ' + (ipList.length - count) + ' fail.');
}
run(commander.args)