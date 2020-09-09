const wa = require("@open-wa/wa-automate");
var http = require("http");
var url = require("url");

var theclient;

wa.create().then(client => start(client));
// wa.create({
//   headless: false
// }).then(async client => await start(client));

http
  .createServer(function(req, res) {
    res.writeHead(200, { "Content-Type": "text/html" });
    var q = url.parse(req.url, true).query;
    // q.to => xxxxx@c.us
    var txt = q.to + " " + q.msg;
    theclient.sendText("" + q.to, q.msg);
    res.end(txt);
  })
  .listen(8080);

function start(client) {
  theclient = client;
  client.onMessage(message => {
    //console.log(message);
    let msg = message.body;
    if (msg.toLowerCase() === "ping") {
      client.sendText(message.from, "Pong");
    }
  });
}
