import UserData from '../data/user.data';
import { deleteFromCloudinary, uploadToCloudinary } from '../utils/functions/fileFunction';
import { createUserPayload, resetPasswordPayload, updateUserPayload } from '../utils/types/payload';
import { User } from '../utils/types/types';

const createUser = async (userData: createUserPayload) => {
  let avatar_url: string | undefined;
  if (userData.avatar) {
    const url_result = await uploadToCloudinary(userData.avatar.buffer, userData.avatar.mimetype);
    avatar_url = url_result.secure_url;
  } else {
    avatar_url = undefined;
  }
  return UserData.createUser(userData, avatar_url);
};

const getUserByEmailOrUsernameOneParams = (email_or_username: string) =>
  UserData.getUserByEmailOrUsernameOneParams(email_or_username);

const getUserByEmailOrUsernameTwoParams = (email: string, username: string) =>
  UserData.getUserByEmailOrUsernameTwoParams(email, username);

const getUserByUsernameOrFullName = (username_or_fullname: string) =>
  UserData.getUserByUsernameOrFullName(username_or_fullname);

const getUserByEmail = (email: string) => UserData.getUserByEmail(email);

const getUserByUsername = (username: string) => UserData.getUserByUsername(username);

const getUserById = (id: string) => UserData.getUserById(id);

const updateUserById = async (userFound: User, userData: updateUserPayload) => {
  let avatar_url: string | null | undefined;
  if (userData.avatar) {
    if (userFound?.avatar_link) await deleteFromCloudinary(userFound.avatar_link);
    const url_result = await uploadToCloudinary(userData.avatar.buffer, userData.avatar.mimetype);
    avatar_url = url_result.secure_url;
  } else {
    avatar_url = userFound.avatar_link;
  }
  return UserData.updateUserById(userFound.id, userData, avatar_url);
};

const resetPasswordById = (id: string, newPassword: string) => UserData.resetPasswordById(id, newPassword);

const updateLastLoggedInById = (id: string) => UserData.updateLastLoggedInById(id);

const verifyUserById = (id: string) => UserData.verifyUserById(id);
const unverifyUserById = (id: string) => UserData.unverifyUserById(id);

const compareUserEmail = (newEmail: string, oldEmail: string) => newEmail.trim() !== oldEmail.trim();
const compareUserUsername = (newUsername: string, oldUsername: string) => newUsername.trim() !== oldUsername.trim();
const isEmailVerified = (is_verified: boolean) => is_verified;
const checkPasswordConfirmation = (resetPasswordPayload: resetPasswordPayload) =>
  resetPasswordPayload.new_password.trim() === resetPasswordPayload.new_password_confirmation.trim();

const UserService = {
  createUser,
  getUserByEmailOrUsernameOneParams,
  getUserByEmailOrUsernameTwoParams,
  getUserByUsernameOrFullName,
  getUserByEmail,
  getUserByUsername,
  getUserById,
  updateUserById,
  resetPasswordById,
  updateLastLoggedInById,
  verifyUserById,
  unverifyUserById,
  compareUserEmail,
  compareUserUsername,
  isEmailVerified,
  checkPasswordConfirmation,
};

export default UserService;
