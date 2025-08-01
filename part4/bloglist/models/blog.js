const mongoose = require("mongoose")

const blogSchema = mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  author: String,
  url: {
    type: String,
    required: true
  },
  likes: {
    type: Number,
    default: 0
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  comments: [String]
},
{
  toJSON: {
    transform: (doc, ret) => {
      ret.id = doc._id.toString()
      delete ret._id
      delete ret.__v
    }
  }
})

const Blog = mongoose.model("Blog", blogSchema)

module.exports = Blog