require("dotenv").config({
  path: "C:/Users/Administrator/Documents/Web Dev/Portfolio/FullStack/AdvanceAuth/.env",
});

const express = require("express");
const connectDB = require("./config/db");
const errorHandler = require("./error/errorHandler");

connectDB();

const app = express();

app.use(express.json());

//   app.use("/api/", require("./routes/"));

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running on PORT: ${PORT}`);
});

process.on("unhandledRejection", (err, promise) => {
  console.log(`Logged Error: ${err.message}`);
  server.close(() => process.exit(1));
});
