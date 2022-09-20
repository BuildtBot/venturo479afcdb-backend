import express from 'express'
import routes from './routes'
import bodyParser from 'body-parser'
import cors from 'cors'

// Server
const app = express()

// Middleware
app.use(cors())
app.use(bodyParser.json())
// TODO: Add analytics middleware & authentication middleware
// app.use(analyticsMiddleware)

// Routes
app.use('/api/v1', routes)

export default app
