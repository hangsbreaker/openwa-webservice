const wa = require("@open-wa/wa-automate");
const { parse } = require("querystring");
var http = require("http");

var theclient;

wa.create().then(client => start(client));
// wa.create({
//   headless: false
// }).then(async client => await start(client));

http
  .createServer(function(req, res) {
    if (req.method === "POST") {
      let body = "";
      req.on("data", chunk => {
        body += chunk.toString(); // convert Buffer to string
      });
      req.on("end", () => {
        let post = parse(body);
        console.log(post);
        //res.end(JSON.stringify(post));
        sendMessage(post.to, post.msg);
        res.end(webpage(JSON.stringify(post)));
      });
    } else {
      res.end(webpage());
    }
  })
  .listen(8080);

function sendMessage(to, msg) {
  theclient.sendText(to, msg);
}

function webpage(param = "") {
  let html = `
    <!doctype html>
    <html>
    <body>
      ${param}
      <form action="/" method="post">
        <input type="text" name="to" placeholder="To" /><br />
        <input type="text" name="msg" placeholder="Message" /><br />
        <button>Save</button>
      </form>
    </body>
    </html>
  `;
  return html;
}

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
