import { NextApiRequest, NextApiResponse } from 'next';
import mongoose from 'mongoose';

export function validateNovelInput(
  req: NextApiRequest,
  res: NextApiResponse,
  next: () => void
) {
  const { name, detail, type, status } = req.body;

  const errors = [];

  if (!name || name.trim().length === 0) {
    errors.push('Name is required');
  }

  if (!detail || detail.trim().length === 0) {
    errors.push('Detail is required');
  }

  if (!type || !['novel', 'webtoon'].includes(type)) {
    errors.push('Valid type is required (novel or webtoon)');
  }

  if (status && !['ongoing', 'completed', 'dropped'].includes(status)) {
    errors.push('Invalid status value');
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  next();
}
