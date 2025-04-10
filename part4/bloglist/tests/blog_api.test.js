const request = require("supertest")
const { test, after, beforeEach } = require("node:test")
const assert = require("node:assert")
const { app } = require("../app.js")
const mongoose = require("mongoose")
const Blog = require("../models/blog.js")
const User = require("../models/user.js")

const initialBlogs = [
    {
        _id: '5a422aa71b54a676234d17f8',
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
        likes: 5,
        __v: 0
    },
    {
        _id: '5a422aa71b57a676234d17f8',
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
        likes: 10,
        __v: 0
    }
]

const initialUser = {
    username: "admin",
    password: "password"
}
let token
const api = request.agent(app)

beforeEach(async () => {
    await Blog.deleteMany({})
    await User.deleteMany({})
    //let user = new User(initialUser)
    await api.post("/api/users")
        .send(initialUser)
    let loginResponse = await api.post("/api/login")
        .send(initialUser)
    token = loginResponse.body.token
    // create user
    await api.post("/api/blogs")
        .set("Authorization", `Bearer ${token}`)
        .send(initialBlogs[0])
    await api.post("/api/blogs")
        .set("Authorization", `Bearer ${token}`)
        .send(initialBlogs[1])
})

// test fetching of all blogs
test("blogs are returned successfully as json", async () => {
    await api     
        .get("/api/blogs") 
        .expect("Content-Type", /json/)
        .expect(200)
})

test("there are 2 blogs", async () => {
    let response = await api.get("/api/blogs")
    assert.strictEqual(response.body.length, initialBlogs.length)
})

test("id is named id", async () => {
    let response = await api.get("/api/blogs")
    let blog = response.body[0]
    assert.notEqual(blog.id, undefined)
})

test("making a post to /api/blogs creates a new blog post", async () => {
    await api.post("/api/blogs")
        .set("Authorization", `Bearer ${token}`)
        .send({
        title: "new blog",
        author: "new author",
        url: "cool url",
        likes: 0
        })
        .expect(201)
    let response = await api.get("/api/blogs")
    assert.strictEqual(response.body.length, initialBlogs.length + 1)
})

test("creating a blog without a likes value will default the value to 0", async () => {
    // post the request and check the response to see if it has a value of 0 for the likes field
    let response = await api.post("/api/blogs")
        .set("Authorization", `Bearer ${token}`)
        .send({
        title: "new blog",
        author: "new author",
        url: "cool url"
        })
        .expect(201)
    assert.strictEqual(response.body.likes, 0)
})

test("returns 400 if title missing when trying to create blog", async () => {
    await api.post("/api/blogs")
        .set("Authorization", `Bearer ${token}`)
        .send({
        author: "new author",
        url: "cool url",
        likes: 0
    })
        .expect(400)
})

test("returns 400 if url is missing", async () => {
    await api.post("/api/blogs")
        .set("Authorization", `Bearer ${token}`)
        .send({
        title: "new post",
        author: "new author",
        likes: 0
    })
        .expect(400)
})

test("number of blogs will be one less after a delete", async () => {
    let id = initialBlogs[0]._id
    await api.delete(`/api/blogs/${id}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(204)
    let response = await api.get("/api/blogs")
    assert.strictEqual(response.body.length, initialBlogs.length - 1)
})

test("will return 404 when trying to delete blog that doesn't exist", async () => {
    let nonExistentID = "12422aa71b54a676234d17f8"
    await api.delete(`/api/blogs/${nonExistentID}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(404)
})

test("will return 400 when trying to delete blog with malformed id", async () => {
    let malformedID = "12345"
    await api.delete(`/api/blogs/${malformedID}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(400)
})

test("updating the blog returns a status code of 200", async () => {
    let updatedBlog = {
        ...initialBlogs[0]
    }
    let blogId = initialBlogs[0]._id
    await api.put(`/api/blogs/${blogId}`)
        .send(updatedBlog)
        .expect(200)
})

test("updating a blog's likes returns same value as updated post", async () => {
    let updatedBlog = {
        ...initialBlogs[0],
        likes: 20
    }
    let response = await api.put(`/api/blogs/${updatedBlog._id}`)
        .send(updatedBlog)
    assert.deepStrictEqual(response.body.likes, updatedBlog.likes)
})

test("attempting to add a new blog without a token results in a 401 error", async () => {
    await api.post("/api/blogs")
        .send({
            title: "new title",
            author: "new author",
            url: "new url"
        })
        .expect(401)
})

after(async () => {
    await User.deleteMany({})
    await Blog.deleteMany({})
    await mongoose.connection.close()
})