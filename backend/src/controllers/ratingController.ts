import { Request, Response } from 'express';
import prisma from '../services/db';

export const submitRating = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { storeId, rating } = req.body;

    if (!storeId || rating === undefined) {
      return res.status(400).json({ error: 'Store ID and rating are required' });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    // Check if store exists
    const store = await prisma.store.findUnique({ where: { id: parseInt(storeId) } });
    if (!store) {
      return res.status(404).json({ error: 'Store not found' });
    }

    // Perform an upsert: create if not exists, update if exists
    const upsertedRating = await prisma.rating.upsert({
      where: {
        userId_storeId: {
          userId,
          storeId: parseInt(storeId)
        }
      },
      update: {
        rating
      },
      create: {
        userId,
        storeId: parseInt(storeId),
        rating
      }
    });

    res.status(200).json({ message: 'Rating submitted successfully', rating: upsertedRating });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to submit rating' });
  }
};
