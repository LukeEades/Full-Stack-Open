const express = require('express')
const mongoose = require('mongoose')
const { MONGODB_URL } = require("./utils/config.js")
const logger = require("./utils/logger.js")
const blogRouter = require("./controllers/blog.js")
const userRouter = require("./controllers/user.js")
const loginRouter = require("./controllers/login.js")
const testingRouter = require("./controllers/testing.js")
const middleware = require("./utils/middleware.js")

const app = express()

mongoose.connect(MONGODB_URL)
    .then(() => {
        logger.info("successfully connected to db")
        })
    .catch(err => {
        logger.error("was unable to connect to db:", err)
        })

app.use(express.json())
app.use(middleware.tokenExtractor)
app.use("/api/blogs", blogRouter)
app.use("/api/users", userRouter)
app.use("/api/login", loginRouter)
if (process.env.NODE_ENV === "test") {
    app.use("/api/testing", testingRouter)
}

app.use(middleware.error)

module.exports = {
    app
}