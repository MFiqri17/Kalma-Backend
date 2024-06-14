import UserData from '../data/user.data';
import { getWhereConditionFunction, isIntegerExceptYearValue } from '../utils/functions/conditionFunctions';
import { deleteFromCloudinary, uploadToCloudinary } from '../utils/functions/fileFunction';
import { createUserPayload, getQueryPayload, resetPasswordPayload, updateUserPayload } from '../utils/types/payload';
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

const createPsycholog = async (userData: createUserPayload) => {
  let avatar_url: string | undefined;
  if (userData.avatar) {
    const url_result = await uploadToCloudinary(userData.avatar.buffer, userData.avatar.mimetype);
    avatar_url = url_result.secure_url;
  } else {
    avatar_url = undefined;
  }
  return UserData.createPsycholog(userData, avatar_url);
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

const getPscycholog = async (getPayload?: Partial<getQueryPayload>) => {
  if (getPayload && Object.keys(getPayload).length > 0) {
    const { search_value } = getPayload;
    const stringColumns = ['full_name', 'email', 'last_logged_in_formatted', 'created_at_formatted'];
    const integerColumns = ['age'];
    const allColumns = isIntegerExceptYearValue(search_value!) ? integerColumns : stringColumns;
    const whereCondition = getWhereConditionFunction(getPayload, allColumns);
    const [totalCount, data] = await Promise.all([
      UserData.getPsychologTotalData(whereCondition),
      UserData.getPsychologData(whereCondition, getPayload),
    ]);
    return { totalCount, data };
  }
  const [totalCount, data] = await Promise.all([
    UserData.getPsychologTotalDataWithoutCondition(),
    UserData.getPsychologDataWithoutCondition(),
  ]);
  return { totalCount, data };
};

const approvePsycholog = (user_id: string) => UserData.approvePsycholog(user_id);
const deletePsycholog = (user_id: string) => UserData.deletePsycholog(user_id);

const UserService = {
  createUser,
  createPsycholog,
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
  getPscycholog,
  approvePsycholog,
  deletePsycholog,
};

export default UserService;
