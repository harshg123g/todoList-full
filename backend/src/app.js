// const express = require('express');
// const cors = require('cors');
// const todoRoute = require('./routes/todo.routes');


// const app = express();
// app.use(express.json());
// app.use(cors());

// app.get('/', (req, res) => {
//     res.json({
//         message: 'Todo List API is running'
//     });
// }); 


// app.use('/api/todo', todoRoute)



// module.exports = app;

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const todoRoute = require("./routes/todo.routes");
const authRoute = require("./routes/auth.routes");

const app = express();

app.use(express.json());

app.use(cookieParser());

app.use(
  cors({
    origin:
      process.env.FRONTEND_URL ||
      "http://localhost:5173",

    credentials: true,
  })
);


app.get("/", (req, res) => {
  res.json({
    message: "Todo List API is running",
  });
});


app.use("/api/auth", authRoute);

app.use("/api/todo", todoRoute);


module.exports = app;