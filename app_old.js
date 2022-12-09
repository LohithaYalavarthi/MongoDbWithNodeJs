const express = require("express");

//init app & middle ware

const app = express();

app.listen(3000, () => {
  console.log("app listening on port 3000");
});

app.get("/books", (req, res) => {
  res.json({ msg: "welcome to api" });
});
