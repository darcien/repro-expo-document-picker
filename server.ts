import express from "express";

const app = express();

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.get("/", async (request, response) => {
  response.send("OK");
});

app.post("/file", async (request, response) => {
  console.log({
    headers: request.headers,
  });

  response.json({
    requestContentType: request.headers["content-type"],
    requestContentLength: request.headers["content-length"],
  });
});

const PORT = 9090;
const start = async () => {
  app.listen(PORT, () => console.log(`Listening on ${PORT}`));
};

start();
