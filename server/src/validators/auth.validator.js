import { z } from 'zod';

export const registerSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: 'Name is required',
    }).min(2, 'Name must be at least 2 characters'),
    email: z.string({
      required_error: 'Email is required',
    }).email('Invalid email address'),
    password: z.string({
      required_error: 'Password is required',
    }).min(8, 'Password must be at least 8 characters')
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, 
      'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character'),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string({
      required_error: 'Email is required',
    }).email('Invalid email address'),
    password: z.string({
      required_error: 'Password is required',
    }),
  }),
});
