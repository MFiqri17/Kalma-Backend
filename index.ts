import express from 'express';
import i18next from 'i18next';
import Backend from 'i18next-fs-backend';
import i18nextMiddleware from 'i18next-http-middleware';
import path from 'path';
import cors from 'cors';
import * as dotenv from 'dotenv';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import { User } from './src/utils/types/types';
import ENDPOINTS from './src/utils/constant/endpoint';
import SelfScreeningRouter from './src/presentation/routes/selfScreening.route';
import UserRouter from './src/presentation/routes/user.route';
import JournalingRouter from './src/presentation/routes/journaling.route';
import MusicRouter from './src/presentation/routes/music.route';
import UserManagementRouter from './src/presentation/routes/userManagement.route';
import ArticleRouter from './src/presentation/routes/article.route';

declare module 'express' {
  interface Request {
    user?: Pick<User, 'id'>;
    file?: Express.Multer.File;
  }
}

void i18next.use(Backend).init({
  fallbackLng: 'en',
  preload: ['en', 'id'],
  supportedLngs: ['en', 'id'],
  interpolation: {
    skipOnVariables: false,
  },
  backend: {
    loadPath: path.join(__dirname, 'public/locales/{{lng}}/{{ns}}.json'),
  },
});

const app = express();
dotenv.config();
const PORT = process.env.PORT || 3000;
const corsOptions: cors.CorsOptions = {
  origin: ['http://localhost:3000', 'https://kalma-webapp.vercel.app'],
  credentials: true,
};

app.use(i18nextMiddleware.handle(i18next));
app.use((req, res, next) => {
  const detectedLanguage = req.headers['accept-language'];
  void i18next.changeLanguage(detectedLanguage);
  next();
});

app.use(cors(corsOptions));
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

app.use(ENDPOINTS.GENERAL, UserRouter);
app.use(ENDPOINTS.USER_MANAGEMENT, UserManagementRouter);
app.use(ENDPOINTS.SELF_SCREENING, SelfScreeningRouter);
app.use(ENDPOINTS.JOURNALING, JournalingRouter);
app.use(ENDPOINTS.MUSICMEDITATION, MusicRouter);
app.use(ENDPOINTS.ARTICLE, ArticleRouter);

app.listen(PORT, () => {
  console.log(`Server is running in PORT ${PORT}`);
});
