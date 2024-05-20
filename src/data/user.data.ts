import prisma from './prisma';
import { createUserPayload, updateUserPayload } from '../utils/types/payload';
import { getFormatDate } from '../utils/functions/coditionFunctions';

const createUser = (userData: createUserPayload, avatar_url?: string) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { age, avatar, ...restData } = userData;
  return prisma.users.create({
    data: {
      created_at: getFormatDate(),
      created_at_formatted: getFormatDate('MMMM Do YYYY, HH:mm:ss'),
      avatar_link: avatar_url,
      age: Number(age),
      ...restData,
    },
  });
};

const getUserByEmailOrUsernameOneParams = (email_or_username: string) =>
  prisma.users.findFirst({ where: { OR: [{ email: email_or_username }, { username: email_or_username }] } });

const getUserByEmailOrUsernameTwoParams = (email: string, username: string) =>
  prisma.users.findFirst({ where: { OR: [{ email }, { username }] } });

const getUserByEmail = (email: string) => prisma.users.findUnique({ where: { email } });

const getUserByUsername = (username: string) => prisma.users.findUnique({ where: { username } });

const getUserById = (id: string) => prisma.users.findUnique({ where: { id } });

const updateUserById = (id: string, userData: updateUserPayload, avatar_url?: string | null) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { age, user_privacy, avatar, ...restData } = userData;
  return prisma.users.update({
    where: { id },
    data: { age: Number(age), user_privacy: Boolean(user_privacy), avatar_link: avatar_url, ...restData },
  });
};

const resetPasswordById = (id: string, newPassword: string) =>
  prisma.users.update({ where: { id }, data: { password: newPassword } });

const updateLastLoggedInById = (id: string) =>
  prisma.users.update({
    where: { id },
    data: {
      last_logged_in: getFormatDate(),
      last_logged_in_formatted: getFormatDate('MMMM Do YYYY, HH:mm:ss'),
    },
  });

const verifyUserById = (id: string) => prisma.users.update({ where: { id }, data: { is_verified: true } });

const unverifyUserById = (id: string) => prisma.users.update({ where: { id }, data: { is_verified: false } });

const UserData = {
  createUser,
  getUserByEmailOrUsernameOneParams,
  getUserByEmailOrUsernameTwoParams,
  getUserByEmail,
  getUserByUsername,
  getUserById,
  updateUserById,
  resetPasswordById,
  updateLastLoggedInById,
  verifyUserById,
  unverifyUserById,
};

export default UserData;
