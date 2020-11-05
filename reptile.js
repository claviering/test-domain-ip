const https = require('https');

const reptile = async function (domain) {
  let time = new Date().getTime();
  const options = {
    "method": "GET",
    "hostname": "site.ip138.com",
    "port": null,
    "path": `/domain/read.do?domain=${domain}&time=${time}`,
    "headers": {
      "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.111 Safari/537.36",
      "pragma": "no-cache",
      "cache-control": "no-cache"
    }
  };
  return new Promise((resolve, reject) => {
    const req = https.request(options, function (res) {
      const chunks = [];
      res.on("data", function (chunk) {
        chunks.push(chunk);
      });
      res.on("end", function () {
        const body = Buffer.concat(chunks);
        let res = body.toString();
        res = JSON.parse(res);
        resolve(res)
      });
      req.on('error', (e) => {
        reject(e)
        console.error(e);
      });
    });
    req.end();
  })
};

module.exports = reptile;
