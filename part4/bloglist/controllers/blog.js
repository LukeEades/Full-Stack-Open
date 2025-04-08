const blogRouter = require("express").Router()
const Blog = require("../models/blog.js")
const logger = require("../utils/logger.js")

blogRouter.get("/", (req, res) => {
    // return all the notes
    Blog.find({})
        .then(blogs => {
            res.json(blogs).end()
        })
        .catch(err => {
            logger.error(err)
        })
})

blogRouter.post("/", (req, res) => {
    console.log(req.body)
    let blog = Blog(req.body)
    blog.save()
        .then(blog => {
            res.json(blog).end()
        })
        .catch(err => {
            logger.error(err)
        })
})

module.exports = blogRouter