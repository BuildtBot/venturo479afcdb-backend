import app from './app'
import 'dotenv/config'

app.listen({ port: process.env.PORT }, () => {
  console.info(`Backend server started http://localhost:${process.env.PORT}/api/v1`)
})
