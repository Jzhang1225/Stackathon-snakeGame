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
  console.log("connected to db");
};

module.exports = { database, Score, syncAndSeed };
