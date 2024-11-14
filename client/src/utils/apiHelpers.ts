import { NextApiResponse } from 'next';

export const handleError = (error: any, res: NextApiResponse) => {
  console.error('API Error:', error);
  
  if (error instanceof mongoose.Error.ValidationError) {
    return res.status(400).json({ 
      message: 'Validation error', 
      errors: Object.values(error.errors).map(err => err.message) 
    });
  }
  
  if (error.code === 11000) {
    return res.status(409).json({ 
      message: 'Duplicate entry found' 
    });
  }
  
  return res.status(500).json({ 
    message: 'Internal server error' 
  });
};

export const validateObjectId = (id: string) => {
  return mongoose.Types.ObjectId.isValid(id);
};
