require("dotenv").config()
const { ApolloServer } = require("@apollo/server")
const User = require("./src/models/User")
const { makeExecutableSchema } = require("@graphql-tools/schema")
const mongoose = require("mongoose")
const { sign, verify } = require("jsonwebtoken")
const resolvers = require("./src/resolver")
const typeDefs = require("./src/schema")
const express = require("express")
const cors = require("cors")
const { expressMiddleware } = require("@apollo/server/express4")
const {
  ApolloServerPluginDrainHttpServer,
} = require("@apollo/server/plugin/drainHttpServer")
const http = require("http")
const { WebSocketServer } = require("ws")
const { useServer } = require("graphql-ws/use/ws")

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("connected to mongodb")
  })
  .catch(err => {
    console.error("unable to connect:", err)
  })

const start = async () => {
  const app = express()

  const httpServer = http.createServer(app)

  const wsServer = new WebSocketServer({
    server: httpServer,
    path: "/",
  })

  const schema = makeExecutableSchema({ typeDefs, resolvers })
  const serverCleanup = useServer({ schema }, wsServer)

  const server = new ApolloServer({
    schema,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose()
            },
          }
        },
      },
    ],
  })

  await server.start()

  app.use(
    "/",
    cors(),
    express.json(),
    expressMiddleware(server, {
      context: async ({ req }) => {
        const auth = req ? req.headers.authorization : null
        if (auth && auth.startsWith("Bearer ")) {
          const decodedToken = verify(auth.substring(7), process.env.SECRET)
          const currentUser = await User.findById(decodedToken.id)
          return { currentUser }
        }
      },
    })
  )

  const PORT = 4000
  httpServer.listen(PORT, () => {
    console.log(`live at port ${PORT}`)
  })
}
start()
