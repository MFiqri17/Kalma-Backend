import bcrypt from 'bcrypt';

const comparePassword = (password: string, hash: string) => bcrypt.compare(password, hash);

const hashPassword = (password: string) => bcrypt.hash(password, 5);

const AuthService = {
  comparePassword,
  hashPassword,
};

export default AuthService;
