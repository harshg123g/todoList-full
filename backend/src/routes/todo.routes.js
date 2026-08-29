const express = require('express');
const  todoController  = require('../controllers/todo.controller')
 

const router = express.Router();


// router.get('/todo', (req, res) => {
//     res.send("Todo api from todo routes")
// })

//Create TODO- POST API
router.post('/add', todoController.createTask)


//Get all TODO- GET API
router.get('/allTask', todoController.allTask)


//Delete TODO- DELETE API
router.delete('/deleteTask/:taskID', todoController.deleteTask)


//Delete TODO- DELETE API
router.patch('/updateTask/:taskID', todoController.updateTask)




module.exports = router;



