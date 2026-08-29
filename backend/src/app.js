const express = require('express');
const cors = require('cors');
const todoRoute = require('./routes/todo.routes');

// const authRouter = require('./routers/auth.routes')
// const musicRouter = require('./routers/music.routes')

const app = express();
app.use(express.json());
app.use(cors());


// app.get('/api', (req, res) =>{
//     res.send("TodoList from app.js");
// })


app.use('/api/todo', todoRoute)
// app.use('/api/music', musicRouter)



module.exports = app;