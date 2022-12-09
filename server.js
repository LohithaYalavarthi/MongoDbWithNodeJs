const http = require("http");
const fs = require("fs");
const server = http.createServer((req, res) => {
  console.log("request made", req.url, req.method);
  //set header for content type
  res.setHeader("Content-Type", "text/plain");
  //writing what ever we need to write in browser
  //   res.write("hello, ninjas");
  let path = "./views/";
  switch (req.url) {
    case "/":
      path += "index.html";
      break;
    case "/about":
      path += "about.html";
      break;
    default:
      path += "404.html";
      break;
  }

  fs.readFile(path, (err, data) => {
    if (err) {
      console.log(err);
      res.end();
    } else {
      //   res.write(data);
      res.end(data);
    }
  });
  //ending it
});
server.listen(3000, "localhost", () => {
  console.log("listening for requests for port 3000");
});
