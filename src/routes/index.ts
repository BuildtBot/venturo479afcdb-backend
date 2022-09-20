// Import Express
import Router from 'express-promise-router'
import errors from './errors'
// Import routes
import usersRoute from './users.route'
import discussionTopicsRoute from './discussion-topics.route'
import groupsRoute from './groups.route'
import userRoute from './user.route'

const router = Router()

// Our routes here
router.use(usersRoute)
router.use(discussionTopicsRoute)
router.use(groupsRoute)
router.use(userRoute)

// Global Error Handler
router.use(errors)

export default router
