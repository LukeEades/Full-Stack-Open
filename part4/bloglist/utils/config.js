require("dotenv").config()

const MONGODB_URL = process.env.NODE_ENV==="test" ? process.env.TEST_MONGODB_URL: process.env.MONGODB_URL
const PORT = 3001

module.exports = {
    MONGODB_URL,
    PORT
}