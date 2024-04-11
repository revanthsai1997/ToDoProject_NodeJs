const express = require("express");
const mongoose = require("mongoose");
const path = require('path');
const cors = require("cors");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const { config } = require("dotenv");
config();
const registerRouter = require("./routes/register");
const loginRouter = require("./routes/login");

const app = express();
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.static('UI'));
app.set("views",path.join(__dirname,"UI/pages"));
app.set('view engine','ejs');
app.use(express.json());
app.use(cookieParser());
app.use(
  session({
    secret: "This is a secret",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60 * 60 * 1000, httpOnly: true },
  })
);

mongoose.connect(process.env.ATLAS_URL, {
  useNewUrlParser: true,
});

const db = mongoose.connection;
db.on("error", (error) => console.log(error));
db.once("open", () => console.log("Connected"));

app.use("/api", registerRouter);
app.use("/api", loginRouter);

app.listen(process.env.PORT, () => {
  console.log("app is listening on Port " + process.env.PORT);
});
