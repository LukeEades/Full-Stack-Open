const loginRouter = require("express").Router()
const User = require("../models/user.js")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

loginRouter.post("/", async (req, res) => {
    let { username, password } = req.body
    let user = await User.findOne({ username })
    let match = user != null ? await bcrypt.compare(password, user.password): false
    if (!match) {
        return res.status(401).send({
            error: "password does not match"
        }).end()
    } 

    const tokenInfo = {
        username: user.username,
        id: user._id
    }
    
    const token = jwt.sign(tokenInfo, process.env.SECRET)

    res.status(200)
        .send({
            token, username: user.username, name: user.name
        })
})

module.exports = loginRouter