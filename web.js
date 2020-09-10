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
        //console.log(post);
        //res.end(JSON.stringify(post));
        sendMessage(post.to, post.msg, post.jenis, post.filename, post.media);
        res.end(webpage(post.to + ": " + post.msg));
      });
    } else {
      res.end(webpage());
    }
  })
  .listen(8080);

function sendMessage(to, msg, jenis = "", filename = "", media = "") {
  if (jenis === "") {
    theclient.sendText("" + to, msg);
  } else if (jenis === "image") {
    theclient.sendImage(to, media, filename, msg);
  } else if (jenis === "file") {
    theclient.sendFile(to, media, filename, msg);
  }
}

function webpage(param = "") {
  let html = `
    <!doctype html>
    <html>
    <body>
      ${param}
      <form action="/" method="post">
        <input type="text" name="to" placeholder="To" style="display:block;"/>
        <input type="text" id="msg" name="msg" placeholder="Message" style="display:block;"/>
        <select name="jenis" onchange="showhide(this);">
          <option value=""> No Media </option>
          <option value="image">Image</option>
          <option value="file">File</option>
        </select><br>
        <div id="file" style="display:none;">
          <input type="file" id="data" onchange="tobase64()"/>
          <input type="hidden" id="media" name="media"/>
          <input type="hidden" id="filename" name="filename"/>
        </div>
        <button>Send</button>
      </form>
      <script>
      function getBase64(file) {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result);
          reader.onerror = error => reject(error);
        });
      }

      function showhide(me){
        if(me.value != ""){
          document.getElementById("file").style.display="block";
        }else{
          document.getElementById("file").style.display="none";
        }
        if(me.value == "file"){
          document.getElementById("msg").style.display="none";
        }else{
          document.getElementById("msg").style.display="block";
        }
      }
      
      function tobase64(){
        var file = document.getElementById('data').files[0];
        getBase64(file).then(
          data => {
            //console.log(data);
            document.getElementById('media').value=data;
            document.getElementById('filename').value=file.name;
          }
        );
      }
      </script>
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
