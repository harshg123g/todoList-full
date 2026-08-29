const todoModel = require('../models/todo.model')


//create ToDO
async function createTask(req, res) {

    try {

        const { title, description } = req.body;

        //validation
        if (!title || title.trim() === "") {
            return res.status(500).json({
                message: "Title is required",
            })
        }

        const data = await todoModel.create({
            title,
            description
        })

        return res.status(201).json({
            message: "Task successfully added",
            data,
        })


    } catch (error) {
        return res.status(500).json({
            message: "Error in createTask",
            error
        })
    }

}


async function allTask(req, res) {


    try {

        //Query Param
        const { search, sort, page = 1, limit = 10 } = req.query;

        //Base query
        const query = {};

        //Search by title
        if (search) {
            query.title = { $regex: search, $options: "i" };
        }


        //Sorting 
        const sortOption = {};
        if (sort === "asc") {
            sortOption.createAt = 1;  //1 for ascending order
        } else {
            sortOption.createAt = -1;  //-1 for descending order
        }

        //Pagination
        const skip = (page - 1) * limit;


        const allData = await todoModel
            .find(query)
            .sort(sortOption)
            .skip(skip)
            .limit(Number(limit));




        return res.status(201).json({
            message: "All Task successfully",
            allData,
        })

    } catch (error) {
        return res.status(500).json({
            message: "Error in allTask",
            error
        })
    }
}


async function deleteTask(req, res) {

    try {

        const {taskID} = req.params;

        const task = await todoModel.findByIdAndDelete( taskID )


        if (!task) {
            return res.status(404).json({
                message: "Task not found",
            })
        }

        return res.status(201).json({
            message: "Task successfully deleted",
            task,
        })

    } catch (error) {
        return res.status(500).json({
            message: "Error in deleteTask",
            error
        })
    }
}



async function updateTask(req, res) {

    try {

        const {taskID} = req.params;

        /*
        const { newTitle, newDescription, newCompleted } = req.body;
        const updatedData = {};
        if (newTitle !== undefined) updatedData.title = newTitle;
        if (newDescription !== undefined) updatedData.description = newDescription;
        if (newCompleted !== undefined) updatedData.completed = newCompleted;
        */

        const { title, description, completed } = req.body;

        const updatedData = {};

        if (title !== undefined) updatedData.title = title;
        if (description !== undefined) updatedData.description = description;
        if (completed !== undefined) updatedData.completed = completed;



        const task = await todoModel.findByIdAndUpdate(
            taskID,
            {
                $set: updatedData,
            },
            { new: true }
        );


        if (!task) {
            return res.status(404).json({
                message: "Task not found",
            })
        }

        return res.status(200).json({
            message: "Task successfully Updated",
            task,
        })

    } catch (error) {
        return res.status(500).json({
            message: "Error in updateTask",
            error
        })
    }
}

module.exports = { createTask, allTask, deleteTask, updateTask };