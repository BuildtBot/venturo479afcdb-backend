import { Router, Request, Response } from 'express'
import { getDB } from '../misc/db'
import { getAuth } from '../middlewares/auth.middleware'
import { ObjectId } from 'mongodb'
const router = Router()

// Creates a new user

router.post('/user', async (req: Request, res: Response) => {
  const db = await getDB()

  const { name, email, password, profile, linkedin } = req.body

  const user: any = await db.collection('User').findOne({ email })

  if (user) {
    return res.status(400).json({ message: 'User already exists' })
  }

  const newUser: any = await db.collection('User').insertOne({
    name,
    email,
    password,
    profile,
    linkedin,
    discussionIds: [],
    groupIds: []
  })

  return res.status(201).json(newUser)
})

// Gets a list of all users

router.get('/user', async (req: Request, res: Response) => {
  const db = await getDB()

  const users: any = await db.collection('User').find().toArray()

  res.json({ users })
})

// Gets a specific user

router.get('/user/:id', getAuth, async (req: Request, res: Response) => {
  const db = await getDB()

  const user: any = await db
    .collection('User')
    .findOne({ _id: new ObjectId(req.params.id) })

  if (!user) {
    return res.status(404).json({ message: 'User not found' })
  }

  res.json({ user })
})

// Updates a specific user

router.patch('/user/:id', getAuth, async (req: Request, res: Response) => {
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

  return res.status(200).json(updatedUser)
})

// Deletes a specific user

router.delete('/user/:id', getAuth, async (req: Request, res: Response) => {
  const db = await getDB()

  const user: any = await db
    .collection('User')
    .findOne({ _id: new ObjectId(req.params.id) })

  if (!user) {
    return res.status(404).json({ message: 'User not found' })
  }

  await db.collection('User').deleteOne({ _id: new ObjectId(req.params.id) })

  return res.json(user)
})

export default router
