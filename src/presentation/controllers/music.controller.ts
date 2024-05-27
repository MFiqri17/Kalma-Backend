import { Request, Response } from 'express';
import MusicService from '../../services/music.service';
import { createMusicPayload } from '../../utils/types/payload';
import { createMusicResponse, serverErrorResponse } from '../../utils/functions/responseFunction';

const createMusic = async (req: Request, res: Response) => {
  try {
    const createdMusic = await MusicService.createMusic(req.body as createMusicPayload, req.user!.id);
    return res.status(200).json(createMusicResponse(createdMusic));
  } catch (error) {
    console.log('error create music', error);
    return res.status(500).json(serverErrorResponse());
  }
};

const MusicController = {
  createMusic,
};

export default MusicController;
