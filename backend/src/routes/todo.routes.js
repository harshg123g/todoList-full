// const express = require('express');
// const  todoController  = require('../controllers/todo.controller')


// const router = express.Router();


// // router.get('/todo', (req, res) => {
// //     res.send("Todo api from todo routes")
// // })

// //Create TODO- POST API
// router.post('/add', todoController.createTask)


// //Get all TODO- GET API
// router.get('/allTask', todoController.allTask)


// //Delete TODO- DELETE API
// router.delete('/deleteTask/:taskID', todoController.deleteTask)


// //Delete TODO- DELETE API
// router.patch('/updateTask/:taskID', todoController.updateTask)




// module.exports = router;





const express = require("express");

const todoController =
    require("../controllers/todo.controller");

const authMiddleware =
    require("../middleware/auth.middleware");

const router = express.Router();


// Everything below requires login
router.use(authMiddleware);


router.post(
    "/add",
    todoController.createTask
);

router.get(
    "/allTask",
    todoController.allTask
);

router.delete(
    "/deleteTask/:taskID",
    todoController.deleteTask
);

router.patch(
    "/updateTask/:taskID",
    todoController.updateTask
);


module.exports = router;