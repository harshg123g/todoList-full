const express = require('express');
const cors = require('cors');
const todoRoute = require('./routes/todo.routes');


const app = express();
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.json({
        message: 'Todo List API is running'
    });
}); 


app.use('/api/todo', todoRoute)



module.exports = app;