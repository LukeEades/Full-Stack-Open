const logger = require("./logger.js")
const jwt = require("jsonwebtoken")

const error = (err, req, res, next) => {
    logger.error(err)
    if (err.name === "ValidationError" || err.name === "CastError" || err.code == 11000) {
        return res.status(400).send({
            error: err.message
        }).end()
    }
    next(err)
}

const getUserToken = req => {
    let auth = req.get("Authorization")
    if (auth && auth.startsWith("Bearer ")) {
        return auth.replace("Bearer ", "")
    }
    return null
}

const tokenExtractor = (req, res, next) => {
    let token = getUserToken(req)
    req.token = token
    next()
}

const userExtractor = (req, res, next) => {
    let token = req.token
    if (!req.token) {
        return res.status(401).end()
    }
    try {
        req.user = jwt.verify(token, process.env.SECRET)
    } catch (err) {
        return res.status(403).end()
    }
    next()
}

module.exports = { error, tokenExtractor, userExtractor }