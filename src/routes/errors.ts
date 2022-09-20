import Router from 'express-promise-router'

const errors = Router()

// Throws Error
errors.use('/error', (req, res, next) => {
  throw Error('error path called')
})

// Bad Path Handler
errors.use('*', (req, res, next) => {
  res.sendStatus(404)
})

export default errors
