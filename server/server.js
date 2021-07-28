require("dotenv").config({
  path: "C:/Users/Administrator/Documents/Web Dev/Portfolio/FullStack/complete-auth/.env",
});

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const errorHandler = require("./error/errorHandler");
const cookieParser = require("cookie-parser");

connectDB();

const app = express();
app.use(cookieParser());

app.use(express.json());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/private", require("./routes/privateRoutes"));

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running on PORT: ${PORT}`);
});

process.on("unhandledRejection", (err, promise) => {
  console.log(`Logged Error: ${err.message}`);
  server.close(() => process.exit(1));
});
