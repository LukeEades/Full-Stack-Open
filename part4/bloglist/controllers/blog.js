const blogRouter = require("express").Router()
const Blog = require("../models/blog.js")
const User = require("../models/user.js")
const { userExtractor } = require("../utils/middleware.js")

blogRouter.get("/", async (req, res, next) => {
    // return all the notes
    try {
        let blogs = await Blog.find({})
            .populate("user", {username: true, name: true, id: true})
        return res.send(blogs).end()
    } catch (err) {
        next(err) 
    }
})

blogRouter.post("/", userExtractor, async (req, res, next) => {
    const user = await User.findOne({ username: req.user.username })
    let newBlog = new Blog({
        ...req.body,
        user: user._id
    })
    console.log(newBlog)
    user.blogs.push(newBlog._id)
    try {
        let blog = await newBlog.save()
        await blog
            .populate("user", {username: true, name: true, id: true})
        await user.save()
        res.status(201).json(blog).end()
    } catch (err) {
        next(err)
    }
})

blogRouter.delete("/:id", userExtractor, async (req, res, next) => {
    let id = req.params.id
    let user = req.user
    try {
        let blog = await Blog.findById(id)
        if (!blog) {
            return res.status(404).end()
        }
        if (blog.user.toString() != user.id.toString()) {
            return res.status(403).end()
        }
        await Blog.findByIdAndDelete(id)
        res.status(204).end()
    } catch (err) {
        next(err)
    }
})

blogRouter.put("/:id", userExtractor, async (req, res, next) => {
    let id = req.params.id
    try {
        let blog = await Blog.findById(id)
        if (!blog) {
            return res.status(404).end()
        }
        let newBlog = await Blog.findByIdAndUpdate(id, req.body, {new: true}).populate("user", {username: true, name: true, id: true})
        res.json(newBlog).end()
    } catch (err) {
        next(err)
    }
})

blogRouter.post("/:id/comments", async (req, res, next) => {
    const id = req.params.id
    const comment = req.body.comment
    if (!comment) {
        return res.status(400).end()
    }
    try {
        let blog = await Blog.findById(id)
        if (!blog) {
            return res.status(404).end()
        }
        blog.comments.push(comment)
        await blog.save()
        return res.send(blog).end()
    } catch (err) {
        next(err)
    }
})

module.exports = blogRouter