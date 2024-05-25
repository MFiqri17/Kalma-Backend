import { Request, Response } from 'express';
import { createJournalPayload, getQueryPayload } from '../../utils/types/payload';
import JournalingService from '../../services/journaling.service';
import {
  createJournalResponse,
  getJournalDetailResponse,
  getJournalResponse,
  handleErrorEmptyDataResponse,
  idNotFoundResponse,
  serverErrorResponse,
} from '../../utils/functions/responseFunction';
import { Prisma } from '@prisma/client';

const createJournal = async (req: Request, res: Response) => {
  try {
    const createdJournal = await JournalingService.createJournal(req.body as createJournalPayload, req.user!.id);
    return res.status(200).json(createJournalResponse(createdJournal));
  } catch (error) {
    console.log('error create self screening', error);
    return res.status(500).json(serverErrorResponse());
  }
};

const getJournalHistory = async (req: Request, res: Response) => {
  try {
    const journalHistory = await JournalingService.getJournalsByUserId(req.user!.id, req.body as getQueryPayload);
    return res.status(200).json(getJournalResponse(journalHistory, req.body as getQueryPayload));
  } catch (error) {
    if (error instanceof Prisma.PrismaClientValidationError)
      return res.status(200).json(handleErrorEmptyDataResponse(req.body as getQueryPayload));
    console.log('error get journals history', error);
    return res.status(500).json(serverErrorResponse());
  }
};

const getJournalDetailHistory = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const journalDetailHistory = await JournalingService.getDetailJournalByUserId(req.user!.id, id);
    if (!journalDetailHistory) return res.status(404).json(idNotFoundResponse(id));
    return res.status(200).json(getJournalDetailResponse(journalDetailHistory));
  } catch (error) {
    console.log('error create self screening', error);
    return res.status(500).json(serverErrorResponse());
  }
};

const JournalingController = {
  createJournal,
  getJournalHistory,
  getJournalDetailHistory,
};

export default JournalingController;
