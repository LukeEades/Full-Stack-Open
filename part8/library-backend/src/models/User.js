const mongoose = require("mongoose")

const schema = mongoose.Schema({
    username: {
        type: String,
        require: true
    },
    favoriteGenre: {
        type: String,
        require: true
    }
})

module.exports = mongoose.model("User", schema)