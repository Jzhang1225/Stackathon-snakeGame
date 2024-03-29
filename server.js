const express = require("express");
const app = express();
const path = require("path");

app.use(express.json());
app.use("/dist", express.static(path.join(__dirname, "dist")));
app.use("/assets", express.static(path.join(__dirname, "assets")));
app.get("/", (req, res) => res.sendFile(path.join(__dirname, "index.html")));

const init = async () => {
  const port = process.env.PORT || 3000;
  app.listen(port, () => console.log(`listening on port ${port}`));
};

init();
