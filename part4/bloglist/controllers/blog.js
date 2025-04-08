const blogRouter = require("express").Router()
const Blog = require("../models/blog.js")

blogRouter.get("/", (req, res) => {
    // return all the notes
    Blog.find({})
        .then(blogs => {
            res.json(blogs).end()
        })
        .catch(err => {
            console.log(err)
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
            console.log(err)
        })
})

module.exports = blogRouter