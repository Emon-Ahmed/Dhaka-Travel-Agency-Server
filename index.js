const express = require("express");
const cors = require('cors');
const port = 5000;
const app = express();

app.use(cors())

app.get("/", (req, res) => {
  res.send("Hello NODE!");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
