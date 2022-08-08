const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
let refreshTokens = [];
app.use(express.json());

function auth(req, res, next) {
  const token = req.headers["authorizetion"];
  token = token.split(" ")[1]; // access token

  jwt.verify(token, "access", (err, user) => {
    if (!err) {
      req.user = user;
      next();
    } else {
      return res.status(403).json({ message: "User not Authenticated" });
    }
  });
}

app.post("/renewaccesstoken", (req, res) => {
  const refreshToken = req.body.token;
  if (!refreshTokens.includes(refreshToken)) {
    return res.status(403).json({ message: "User is not Authenticated" });
  }

  jwt.verify(refreshToken, "refresh", (err, user) => {
    if (!err) {
      console.log(err);
      const accessToken = jwt.sign({ username: user.name }, "access", {
        expiresIn: "60s",
      });
      console.log(err);
      return res.status(201).json({ accessToken });
    } else {
      return res.status(403).json({ message: "User Not Authenticated" });
    }
  });
});

app.post("/protected", auth, (req, res) => {
  res.send("inside protected route");
});

app.post("/login", (req, res) => {
  const user = req.body.user;

  if (!user) {
    return res.status(404).json({ message: "Body is Empty" });
  }

  let accessToken = jwt.sign(user, "access", { expiresIn: "20s" });
  let refreshToken = jwt.sign(user, "refresh", { expiresIn: "8d" });
  refreshTokens.push(refreshToken);

  return res.status(201).json({
    accessToken,
    refreshToken,
  });
});

app.listen(3000);

// require("dotenv").config();

// const mongoose = require("mongoose");
// const express = require("express");
// const app = express();

// // const cors = require("cors");
//  const cookieParser = require("cookie-parser");
//  const bodyParser = require("body-parser");
// //my routes

// //db connection
// mongoose
//   .connect(
//     process.env.DATABASE,

//     {
//       useNewUrlParser: true,
//     }
//   )
//   .then(() => {
//     console.log("db connected");
//   })
//   .catch(console.log("DB is not connected"));
// // this is my middlwer
// app.use(bodyParser.json());
// app.use(cookieParser());
// app.use(cors());

// //my routes

// //port
// const port = process.env.PORT || 5000;

// //starting server
// app.listen(port, () => {
//   console.log(`app is running at ${port}`);
// });
