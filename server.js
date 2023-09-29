//imports
const http = require("http");
const path = require("path");
const fs = require("fs");
const fsPromises = require("fs").promises;

const logEvents = require("./logEvents");
const EventEmitter = require("events");
const { log } = require("console");
const { ht } = require("date-fns/locale");

class TheEmitter extends EventEmitter {}

const emitter = new TheEmitter();

emitter.on("log", (msg, fileName) => logEvents(msg, fileName));

const PORT = process.env.PORT || 3500;

const server = http.createServer((req, res) => {
  console.log(req.url, req.method);
  emitter.emit("log", `${req.url}\t${req.method}`, "reqLog.txt");

  const extension = path.extname(req.url);

  let contentType;

  switch (extension) {
    case ".css":
      contentType = "text/css";
      break;
    case ".js":
      contentType = "text/javascript";
      break;
    case ".json":
      contentType = "application/json";
      break;
    case ".jpg":
      contentType = "image/jpg";
      break;
    case ".png":
      contentType = "image/png";
      break;
    case ".txt":
      contentType = "text/plain";
      break;
    default:
      contentType = "text/html";
      break;
  }

  let filePath =
    contentType === "text/html" && req.url === "/"
      ? path.join(__dirname, "view", "index.html")
      : contentType === "text/html" && req.url.slice(-1) === "/"
      ? path.join(__dirname, "view", req.url, "index.html")
      : contentType === "text/html"
      ? path.join(__dirname, "view", req.url)
      : path.join(__dirname, req.url);

  if (!extension && req.url.slice(-1) !== "/") filePath += ".html";

  const serveFile = async (filePath, contentType, res) => {
    try {
      const rawData = await fsPromises.readFile(
        filePath,
        !contentType.includes("image") ? "utf8" : ""
      );
      const data =
        contentType === "application/json" ? JSON.parse(rawData) : rawData;
      res.writeHead(filePath.includes("404.html") ? 404 : 200, {
        "content-type": contentType,
      });
      res.end(contentType === "application/json" ? JSON.stringify(data) : data);
    } catch (error) {
      console.log(error);
      emitter.emit("log", `${error.name}: ${error.message}`, "errorLog.txt");
      res.statusCode = 500;
      res.end();
    }
  };

  const fileExists = fs.existsSync(filePath);

  if (fileExists) {
    serveFile(filePath, contentType, res);
  } else {
    switch (path.parse(filePath).base) {
      case "old-page.html":
        res.writeHead(301, { Location: "/new-page.html" });
        res.end();
        break;
      case "www-page.html":
        res.writeHead(301, { Location: "/" });
        res.end();
        break;
      default:
        serveFile(path.join(__dirname, "view", "404.html"), "text/html", res);
        break;
    }
  }
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
