const logger = require("./logger.js")

const error = (err, req, res, next) => {
    logger.err(err)
}


module.exports = { error }