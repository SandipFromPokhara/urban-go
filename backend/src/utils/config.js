require("dotenv").config();

const PORT = process.env.PORT;

const MONGO_URI = (() => {
  switch (process.env.NODE_ENV) {
    case "test":
      return process.env.MONGO_URI_TEST;
    case "production":
      return process.env.MONGO_URI_PROD;
    default:
      return process.env.MONGO_URI_DEV;
  }
})();

console.log(MONGO_URI);

module.exports = {
  MONGO_URI,
  PORT,
};