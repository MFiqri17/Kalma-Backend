import { NextFunction, Request, Response } from 'express';
import MusicService from '../services/music.service';
import { createMusicPayload, updateMusicPayload } from '../utils/types/payload';
import { existedDataResponse, serverErrorResponse } from '../utils/functions/responseFunction';
import { lowerCase } from 'text-case';

const checkExistingMusic = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title } = req.body as createMusicPayload | updateMusicPayload;
    const music = await MusicService.getMusicByTitle(lowerCase(title));
    if (music) return res.status(400).json(existedDataResponse(title));
    next();
  } catch (error) {
    console.error('Error checking existing music:', error);
    return res.status(500).json(serverErrorResponse());
  }
};

const MusicMiddleware = {
  checkExistingMusic,
};

export default MusicMiddleware;
