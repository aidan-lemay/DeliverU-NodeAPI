const express = require("express");
const app = express();
const port = 3000;
require("dotenv").config();
const cors = require('cors');

// Route Definitions
const auth = require("./authentication/auth");
const register = require("./authentication/register");
const login = require("./authentication/login");

const pricing = require("./routes/pricing");
const order = require("./routes/order");

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.get("/", (res) => {
  res.json({ message: "ok" });
});

// CORS Definitions
const allowedOrigins = ['*'];

app.use(cors({
  origin: function(origin, callback){    // allow requests with no origin 
    // (like mobile apps or curl requests)
    if(!origin) {
      return callback(null, true);
    }
    if(allowedOrigins.indexOf(origin) === -1){
      var msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }    return callback(null, true);
  }
}));

// Path Definitions
app.post("/register", register);
app.post("/login", login);

app.get("/pricing", pricing);

app.get("/order", order);

/* Error handler middleware */
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  console.error(err.message, err.stack);
  res.status(statusCode).json({ message: err.message });
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});