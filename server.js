const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config({ path: "./config.env" });
const app = require("./app");

const DB = process.env.DATABASE_LOCAL;

mongoose
  .connect(DB)
  .then(() => console.log("Connection Successful"))
  .catch((err) =>
    console.log(`Couldn't connect to the database because of ${err}`)
  );

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Connecting and Logging to Port ${port}`);
});
