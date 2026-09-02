// const mongoose = require("mongoose");

// const { Schema } = mongoose;

// const todoSchema = new Schema(
//   {
//     title: {
//       type: String,
//       required: true,
//       trim: true,
//     },

//     description: {
//       type: String,
//       default: "",
//     },

//     completed: {
//       type: Boolean,
//       default: false,
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// const todoModel = mongoose.model("Todo", todoSchema);

// module.exports = todoModel;


const mongoose = require("mongoose");

const { Schema } = mongoose;

const todoSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    completed: {
      type: Boolean,
      default: false,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const todoModel = mongoose.model("Todo", todoSchema);

module.exports = todoModel;