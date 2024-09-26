const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const urlRoutes = require("./routes/urlRoutes");
const path = require("path");

dotenv.config();

const app = express();

app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

app.use("/", urlRoutes);

const mongoURI = process.env.MONGO_URI;
mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

module.exports = app;

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
