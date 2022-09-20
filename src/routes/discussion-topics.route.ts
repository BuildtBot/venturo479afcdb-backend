import { Router, Request, Response } from 'express'
import { getDB } from '../misc/db'
import { getAuth } from '../middlewares/auth.middleware'
import { ObjectId } from 'mongodb'
const router = Router()

// Get all discussion topics

router.get(
  '/discussion-topics',
  getAuth,
  async (req: Request, res: Response) => {
    const db = await getDB()

    const discussionTopics: any = await db
      .collection('discussionTopics')
      .find({})
      .toArray()

    res.json({ discussionTopics })
  }
)

// Create a new discussion topic

router.post(
  '/discussion-topics',
  getAuth,
  async (req: Request, res: Response) => {
    const db = await getDB()

    const discussion: any = await db.collection('Discussion').insertOne({
      title: req.body.title,
      content: req.body.content,
      dateCreated: new Date(),
      lastUpdated: new Date(),
      userIds: [req.userId],
      groupIds: []
    })

    res.json({ discussion })
  }
)

// Update an existing discussion topic

router.patch(
  '/discussion-topics/:id',
  getAuth,
  async (req: Request, res: Response) => {
    const db = await getDB()

    const discussion: any = await db
      .collection('Discussion')
      .findOne({ _id: new ObjectId(req.params.id) })

    if (!discussion) {
      return res.status(404).json({ message: 'Discussion not found' })
    }

    if (discussion.userIds.indexOf(req.userId) === -1) {
      return res
        .status(403)
        .json({ message: 'You do not have permission to edit this discussion' })
    }

    const updatedDiscussion: any = await db
      .collection('Discussion')
      .findOneAndUpdate(
        { _id: new ObjectId(req.params.id) },
        { $set: req.body }
      )

    return res.status(200).json(updatedDiscussion)
  }
)

// Delete a discussion topic

router.delete(
  '/discussion-topics/:id',
  getAuth,
  async (req: Request, res: Response) => {
    const db = await getDB()

    const discussion: any = await db
      .collection('Discussion')
      .findOne({ _id: new ObjectId(req.params.id) })

    if (!discussion) {
      return res.status(404).json({ message: 'Discussion not found' })
    }

    await db
      .collection('Discussion')
      .deleteOne({ _id: new ObjectId(req.params.id) })

    return res.status(200).json({ message: 'Discussion deleted' })
  }
)

export default router
