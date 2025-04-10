const bcrypt = require("bcrypt")
const userRouter = require("express").Router()
const User = require("../models/user.js")

userRouter.post("/", async (req, res, next) => {
    // get fields from the reques - username, name, password
    let userInfo = req.body
    let password = userInfo.password
    let username = userInfo.username
    let name = userInfo.name
    if (!password || password.length < 3) {
        return res.status(400).send({
            error: "password is invalid"
        }).end()
    }
    // hash password and insert into db
    let saltRounds = 10
    let hashedPassword = await bcrypt.hash(password, saltRounds)
    let user = User({
        username: username,
        name: name,
        password: hashedPassword
    })
    try {
        let savedUser = await user.save()
        res.status(201).send(savedUser).end()
    } catch (err) {
        next(err)
    }
})

userRouter.get("/", async (req, res, next) => {
    try {
        let users = await User.find({}).populate("blogs", {user: false, id: false})
        res.send(users).end()
    } catch (err) {
        next(err)
    }
})

module.exports = userRouter