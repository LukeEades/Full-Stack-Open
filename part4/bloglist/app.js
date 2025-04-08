const express = require('express')
const mongoose = require('mongoose')
const { MONGODB_URL } = require("./utils/config.js")
const blogRouter = require("./controllers/blog.js")

const app = express()

mongoose.connect(MONGODB_URL)
    .then(() => {
        console.log("successfully connected to db")
        })
    .catch(err => {
        console.log("unable to connect", err)
        })

app.use(express.json())
app.use("/api/blogs", blogRouter)

const PORT = 3003
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})