/* starting express server */
const express = require("express");
const logger = require("morgan");
const cors = require("cors");

/* executes database code */
const app = express();
app.use(logger("dev"));
app.use(cors());
/* parse the post body string to json 'req.body' */
app.use(express.json());

/* mounting a router to the app */
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

/* routes*/
app.use("/api/devices", require("./routes/devices"));
app.listen(4001, () => console.log("listening from port 4001"));
