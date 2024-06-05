import { Request, Response } from 'express';
import MusicService from '../../services/music.service';
import { createMusicPayload, getQueryPayload, updateMusicPayload } from '../../utils/types/payload';
import {
  createMusicResponse,
  deleteMusicResponse,
  getDetailMusicResponse,
  getMusicResponse,
  handleErrorEmptyDataResponse,
  idNotFoundResponse,
  serverErrorResponse,
  updateMusicResponse,
} from '../../utils/functions/responseFunction';
import { Prisma } from '@prisma/client';

const createMusic = async (req: Request, res: Response) => {
  try {
    const createdMusic = await MusicService.createMusic(req.body as createMusicPayload, req.user!.id);
    return res.status(200).json(createMusicResponse(createdMusic));
  } catch (error) {
    console.log('error create music', error);
    return res.status(500).json(serverErrorResponse());
  }
};

const getMusic = async (req: Request, res: Response) => {
  try {
    const musicData = await MusicService.getMusic(req.body as getQueryPayload);
    return res.status(200).json(getMusicResponse(musicData, req.body as getQueryPayload));
  } catch (error) {
    if (error instanceof Prisma.PrismaClientValidationError)
      return res.status(200).json(handleErrorEmptyDataResponse(req.body as getQueryPayload));
    console.log('error get music', error);
    return res.status(500).json(serverErrorResponse());
  }
};

const getDetailMusic = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const foundMusic = await MusicService.getMusicById(id);
    if (!foundMusic) return res.status(404).json(idNotFoundResponse(id));
    res.status(200).json(getDetailMusicResponse(foundMusic));
  } catch (error) {
    console.log('error get detail music', error);
    return res.status(500).json(serverErrorResponse());
  }
};

const updateMusic = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const foundMusic = await MusicService.getMusicById(id);
    if (!foundMusic) return res.status(404).json(idNotFoundResponse(id));
    const updateMusic = await MusicService.updateMusic(req.body as updateMusicPayload, foundMusic, req.user!.id);
    res.status(200).json(updateMusicResponse(updateMusic));
  } catch (error) {
    console.log('error update music', error);
    return res.status(500).json(serverErrorResponse());
  }
};

const deleteMusic = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const foundMusic = await MusicService.getMusicById(id);
    if (!foundMusic) return res.status(404).json(idNotFoundResponse(id));
    const deletedMusic = await MusicService.deleteMusicById(foundMusic.id, foundMusic.music_link);
    res.status(200).json(deleteMusicResponse(deletedMusic.id));
  } catch (error) {
    console.log('error delete music', error);
    return res.status(500).json(serverErrorResponse());
  }
};

const MusicController = {
  createMusic,
  getMusic,
  getDetailMusic,
  updateMusic,
  deleteMusic,
};

export default MusicController;
