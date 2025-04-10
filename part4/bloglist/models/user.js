const mongoose = require("mongoose")

const userSchema = mongoose.Schema({
    name: String,
    username: {
        type: String,
        required: true,
        minLength: 3,
        unique: true
    },
    password: { // hashed password
        type: String,
        required: true,
        minLength: 3
    },
    blogs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Blog"
    }]
},{
    toJSON:{
        transform: (doc, ret) => {
            ret.id = doc._id.toString()
            delete ret.password
            delete ret._id
            delete ret.__v 
        }
    }
})

const User = mongoose.model("User", userSchema)

module.exports = User