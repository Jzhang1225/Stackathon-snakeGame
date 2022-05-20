const Sequelize = require("sequelize");
const database = new Sequelize(
  process.env.DATABASE_URL || "postgres:localhost/snake_highscores",
  { logging: false }
);

const Score = database.define("score", {
  score: Sequelize.INTEGER,
});

const syncAndSeed = async () => {
  await database.sync({ force: true });
  await Promise.all(
    [7000, 4500, 2000, 300, 40, 1050].map((score) => Score.create({ score }))
  );
  console.log("connected to db");
};

module.exports = { database, Score, syncAndSeed };
