const express = require("express");
const cors = require("cors");
const app = express();
const networks = require("./routes/Networks");
const connectDB = require("./db/connect");
require("dotenv").config();
const notFound = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

// middleware
app.use(cors());
app.use(express.static("./publicVLSM"));
app.use(express.json());

// routes

app.use("/api", networks);

app.use(notFound);
app.use(errorHandlerMiddleware);
const PORT = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(PORT, () =>
      console.log(`Server is listening on port ${PORT}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
