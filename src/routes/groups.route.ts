import { Router, Request, Response } from 'express'
import { getDB } from '../misc/db'
import { getAuth } from '../middlewares/auth.middleware'
import { ObjectId } from 'mongodb'
const router = Router()

// Get all community groups

router.get('/groups', async (req: Request, res: Response) => {
  const db = await getDB()

  const groups: any = await db.collection('Group').find().toArray()

  res.json({ groups })
})

// Get community group by id

router.get('/groups/:id', getAuth, async (req: Request, res: Response) => {
  const db = await getDB()

  const group: any = await db
    .collection('Group')
    .findOne({ _id: new ObjectId(req.params.id) })

  if (!group) {
    return res.status(404).json({ message: 'Group not found' })
  }

  res.json(group)
})

// Create a new community group

router.post('/groups', getAuth, async (req: Request, res: Response) => {
  const db = await getDB()

  const group: any = await db.collection('Group').insertOne({
    name: req.body.name,
    description: req.body.description,
    dateCreated: new Date(),
    lastUpdated: new Date(),
    userIds: [req.userId],
    discussionIds: []
  })

  res.json({ group })
})

// Update community group by id

router.patch('/groups/:id', getAuth, async (req: Request, res: Response) => {
  const db = await getDB()

  const group: any = await db
    .collection('Group')
    .findOne({ _id: new ObjectId(req.params.id) })

  if (!group) {
    return res.status(404).json({ message: 'Group not found' })
  }

  if (!group.userIds.includes(req.userId)) {
    return res
      .status(403)
      .json({ message: 'You do not have permission to edit this group' })
  }

  const updatedGroup: any = await db
    .collection('Group')
    .findOneAndUpdate({ _id: new ObjectId(req.params.id) }, { $set: req.body })

  return res.json(updatedGroup)
})

// Delete community group by id

router.delete('/groups/:id', getAuth, async (req: Request, res: Response) => {
  const db = await getDB()

  const group: any = await db
    .collection('Group')
    .findOne({ _id: new ObjectId(req.params.id) })

  if (!group) {
    return res.status(404).json({ message: 'Group not found' })
  }

  if (group.userIds.indexOf(req.userId) === -1) {
    return res
      .status(403)
      .json({ message: 'You do not have permission to delete this group' })
  }

  await db.collection('Group').deleteOne({ _id: new ObjectId(req.params.id) })

  return res.json({ message: 'Group deleted' })
})

// Get all users in a community group

router.get(
  '/groups/:id/users',
  getAuth,
  async (req: Request, res: Response) => {
    const db = await getDB()

    const group: any = await db
      .collection('Group')
      .findOne({ _id: new ObjectId(req.params.id) })

    if (!group) {
      return res.status(404).json({ message: 'Group not found' })
    }

    const users: any = await db
      .collection('User')
      .find({ _id: { $in: group.userIds } })
      .toArray()

    return res.json(users)
  }
)

// Get user by id in a community group

router.get(
  '/groups/:id/users/:userId',
  getAuth,
  async (req: Request, res: Response) => {
    const db = await getDB()

    const group: any = await db
      .collection('Group')
      .findOne({ _id: new ObjectId(req.params.id) })

    if (!group) {
      return res.status(404).json({ message: 'Group not found' })
    }

    const user: any = await db
      .collection('User')
      .findOne({ _id: new ObjectId(req.params.userId) })

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    return res.json(user)
  }
)

// Add a user to a community group

router.post(
  '/groups/:id/users',
  getAuth,
  async (req: Request, res: Response) => {
    const db = await getDB()

    const group: any = await db
      .collection('Group')
      .findOne({ _id: new ObjectId(req.params.id) })

    if (!group) {
      return res.status(404).json({ message: 'Group not found' })
    }

    group.userIds.push(req.userId)

    await db
      .collection('Group')
      .updateOne({ _id: new ObjectId(req.params.id) }, { $set: group })

    return res.json(group)
  }
)

// Remove a user from a community group

router.delete(
  '/groups/:id/users/:userId',
  getAuth,
  async (req: Request, res: Response) => {
    const db = await getDB()

    const group: any = await db
      .collection('Group')
      .findOne({ _id: new ObjectId(req.params.id) })

    if (!group) {
      return res.status(404).json({ message: 'Group not found' })
    }

    if (!group.userIds.includes(req.userId)) {
      return res
        .status(403)
        .json({ message: 'You are not a member of this group' })
    }

    const user: any = await db
      .collection('User')
      .findOne({ _id: new ObjectId(req.params.userId) })

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    if (!group.userIds.includes(req.params.userId)) {
      return res
        .status(404)
        .json({ message: 'User is not a member of this group' })
    }

    group.userIds = group.userIds.filter((id) => id !== req.params.userId)

    await db
      .collection('Group')
      .updateOne({ _id: new ObjectId(req.params.id) }, { $set: group })

    return res.json(group)
  }
)

// Get all discussions in a community group

router.get('/groups/:id/discussions', async (req: Request, res: Response) => {
  const db = await getDB()

  const group: any = await db
    .collection('Group')
    .findOne({ _id: new ObjectId(req.params.id) })

  if (!group) {
    return res.status(404).json({ message: 'Group not found' })
  }

  const discussions: any = await db
    .collection('Discussion')
    .find({ groupIds: new ObjectId(req.params.id) })
    .toArray()

  return res.json(discussions)
})

// Get discussion by id in a community group

router.get(
  '/groups/:id/discussions/:discussionId',
  getAuth,
  async (req: Request, res: Response) => {
    const db = await getDB()

    const group: any = await db
      .collection('Group')
      .findOne({ _id: new ObjectId(req.params.id) })

    if (!group) {
      return res.status(404).json({ message: 'Group not found' })
    }

    const discussion: any = await db
      .collection('Discussion')
      .findOne({ _id: new ObjectId(req.params.discussionId) })

    if (!discussion) {
      return res.status(404).json({ message: 'Discussion not found' })
    }

    return res.json(discussion)
  }
)

// Create a new discussion in a community group

router.post(
  '/groups/:id/discussions',
  getAuth,
  async (req: Request, res: Response) => {
    const db = await getDB()

    const groupId = req.params.id

    const group: any = await db
      .collection('Group')
      .findOne({ _id: new ObjectId(groupId) })

    if (!group) {
      return res.status(404).json({ message: 'Group not found' })
    }

    const discussion: any = await db.collection('Discussion').insertOne({
      title: req.body.title,
      content: req.body.content,
      dateCreated: new Date(),
      lastUpdated: new Date(),
      userIds: [req.userId],
      groupIds: [group._id]
    })

    await db
      .collection('Group')
      .updateOne(
        { _id: new ObjectId(groupId) },
        { $push: { discussionIds: discussion.insertedId } }
      )

    return res.status(201).json({ message: 'Discussion created' })
  }
)

export default router
