const express = require('express')
const mongoose = require('mongoose')
const { MONGODB_URL } = require("./utils/config.js")
const logger = require("./utils/logger.js")
const blogRouter = require("./controllers/blog.js")
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
app.use("/api/blogs", blogRouter)

app.use(middleware.error)

const PORT = 3003
app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`)
})