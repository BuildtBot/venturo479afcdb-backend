import { Router, Request, Response } from 'express'
import { getDB } from '../misc/db'
import { getAuth } from '../middlewares/auth.middleware'
import { ObjectId } from 'mongodb'
const router = Router()

// Get all users

router.get('/users', getAuth, async (req: Request, res: Response) => {
  const db = await getDB()

  const users: any = await db.collection('User').find().toArray()

  res.json({ users })
})

// Get a user by id

router.get('/users/:id', getAuth, async (req: Request, res: Response) => {
  const db = await getDB()

  const user: any = await db
    .collection('User')
    .findOne({ _id: new ObjectId(req.params.id) })

  if (!user) {
    return res.status(404).json({ message: 'User not found' })
  }

  res.json({ user })
})

// Create a new user

router.post('/users', async (req: Request, res: Response) => {
  const db = await getDB()

  const user: any = await db.collection('User').insertOne({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    profile: req.body.profile,
    linkedin: req.body.linkedin,
    discussionIds: req.body.discussionIds,
    groupIds: req.body.groupIds
  })

  res.json({ user })
})

// Update a user by id

router.patch('/users/:id', getAuth, async (req: Request, res: Response) => {
  const db = await getDB()

  const user: any = await db
    .collection('User')
    .findOne({ _id: new ObjectId(req.params.id) })

  if (!user) {
    return res.status(404).json({ message: 'User not found' })
  }

  if (req.userId !== user._id.toString()) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  const updatedUser: any = await db
    .collection('User')
    .findOneAndUpdate({ _id: new ObjectId(req.params.id) }, { $set: req.body })

  res.json(updatedUser)
})

// Delete a user by id

router.delete('/users/:id', getAuth, async (req: Request, res: Response) => {
  const db = await getDB()

  const user: any = await db
    .collection('User')
    .findOne({ _id: new ObjectId(req.params.id) })

  if (!user) {
    return res.status(404).json({ message: 'User not found' })
  }

  await db.collection('User').deleteOne({ _id: new ObjectId(req.params.id) })

  return res.status(200).json({ message: 'User deleted' })
})

export default router
