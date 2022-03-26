require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());

const PORT = process.env.PORT || 5000;

app.use(express.json());
const router = require("./src/routes");
app.use("/api/v1/", router);

app.use("/uploads", express.static("uploads"));

app.get("/", (request, response) => {
  response.json("Hello from server");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});