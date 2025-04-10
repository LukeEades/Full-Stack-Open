const { test, beforeEach, after } = require("node:test")
const request = require("supertest")
const assert = require("node:assert")
const mongoose = require("mongoose")
const { app } = require("../app.js")
const User = require("../models/user.js")

const api = request(app)

beforeEach(async () => {
    await User.deleteMany({})
    let admin = new User({
        username: "admin",
        password: "password"
    })
    await admin.save()
})

test("adding a user returns user", async () => {
    let user = {
        username: "luke eades",
        password: "password"
    }
    let response = await api.post("/api/users")
        .send(user)
        .expect(201)
    let createdUser = response.body
    assert.strictEqual(createdUser.username, user.username)
    assert.strictEqual(createdUser.password, undefined)
})

test("attempting to add a user with an invalid password results in a 400 error", async () => {
    let user = {
        username: "luke eades",
        password: "ps"
    }
    await api.post("/api/users")
        .send(user)
        .expect(400)
})

test("attempting to add a user with a username that already exists results in a 400 error", async () => {
    let duplicateUser = {
        username: "admin",
        password: "password"
    }
    await api.post("/api/users")
        .send(duplicateUser)
        .expect(400)
})

after(async () => {
    await User.deleteMany({})
    await mongoose.connection.close()
})