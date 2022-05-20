const express = require("express");
const app = express();
const path = require("path");
const { syncAndSeed, Score } = require("./db");

app.use(express.json());
app.use("/dist", express.static(path.join(__dirname, "dist")));
app.use("/assets", express.static(path.join(__dirname, "assets")));
app.get("/", (req, res) => res.sendFile(path.join(__dirname, "index.html")));

app.get("/scores", async (req, res, next) => {
  try {
    const scores = await Score.findAll();
    res.send(scores.sort((a, b) => b.score - a.score).slice(0, 10));
  } catch (e) {
    console.log(e);
  }
});

app.post("/scores", async (req, res, next) => {
  try {
    const score = req.body.score * 1;
    await Score.create({ score });
    res.send(await Score.findAll());
  } catch (e) {
    console.log(e);
  }
});

const init = async () => {
  const port = process.env.PORT || 3000;
  await syncAndSeed();
  app.listen(port, () => console.log(`listening on port ${port}`));
};

init();
