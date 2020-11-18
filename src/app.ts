import express from 'express'
import { createServer } from 'http'

import config from './config'
import loader from './loaders'
import routes from './routes'
const app = express()

async function startServer() {
    await loader(app)
    app.use(routes)
    const server = createServer(app)
    server.listen(config.PORT)
    console.log(`Server is running on http://localhost:${config.PORT}`)
}
startServer()
