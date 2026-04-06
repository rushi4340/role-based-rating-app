import { Request, Response } from 'express';
import prisma from '../services/db';

export const getStores = async (req: Request, res: Response) => {
  try {
    const { search, sortBy } = req.query;

    const where: any = {};
    if (search) {
      where.name = { contains: search as string, mode: 'insensitive' };
    }

    const stores = await prisma.store.findMany({
      where,
      include: {
        ratings: true,
      }
    });

    const mappedStores = stores.map((store: any) => {
      const avgRating = store.ratings.length > 0 
        ? store.ratings.reduce((acc: number, curr: any) => acc + curr.rating, 0) / store.ratings.length 
        : 0;
      return {
        ...store,
        averageRating: parseFloat(avgRating.toFixed(1)),
        totalRatings: store.ratings.length
      };
    });

    if (sortBy === 'rating') {
      mappedStores.sort((a: any, b: any) => b.averageRating - a.averageRating);
    } else if (sortBy === 'name') {
      mappedStores.sort((a: any, b: any) => a.name.localeCompare(b.name));
    }

    res.json(mappedStores);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch stores' });
  }
};

export const getMyStores = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    
    const stores = await prisma.store.findMany({
      where: { ownerId: userId },
      include: {
        ratings: {
          include: {
            user: {
              select: { id: true, name: true, email: true }
            }
          }
        }
      }
    });

    const mappedStores = stores.map((store: any) => {
      const avgRating = store.ratings.length > 0 
        ? store.ratings.reduce((acc: number, curr: any) => acc + curr.rating, 0) / store.ratings.length 
        : 0;
      return {
        ...store,
        averageRating: parseFloat(avgRating.toFixed(1)),
        totalRatings: store.ratings.length
      };
    });

    res.json(mappedStores);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch your stores' });
  }
};

export const createStore = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { name, email, address } = req.body;

    if (!name || !email || !address) {
      return res.status(400).json({ error: 'Name, email, and address are required' });
    }

    const store = await prisma.store.create({
      data: {
        name,
        email,
        address,
        ownerId: userId
      }
    });

    res.status(201).json(store);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to create store' });
  }
};
