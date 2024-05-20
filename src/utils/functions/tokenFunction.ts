import jwt, { Secret } from 'jsonwebtoken';
import { User } from '../types/types';

export const generateToken = (user: Pick<User, 'id'>, secret: Secret, expired: string) => {
  const token = jwt.sign(
    {
      id: user.id,
    },
    secret,
    { expiresIn: expired },
  );
  return token;
};
