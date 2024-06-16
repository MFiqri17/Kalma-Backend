import { Request, Response } from 'express';
import { createJournalPayload, getQueryPayload } from '../../utils/types/payload';
import JournalingService from '../../services/journaling.service';
import {
  createJournalResponse,
  getJournalDetailResponse,
  getJournalResponse,
  getJournalResponseForPsychologist,
  handleErrorEmptyDataResponse,
  idNotFoundResponse,
  isNotAllowedSeenJournalResponse,
  nameNotFoundResponse,
  serverErrorResponse,
} from '../../utils/functions/responseFunction';
import { Prisma } from '@prisma/client';
import UserService from '../../services/user.service';
import { titleCase } from 'text-case';

const createJournal = async (req: Request, res: Response) => {
  try {
    const createdJournal = await JournalingService.createJournal(req.body as createJournalPayload, req.user!.id);
    return res.status(200).json(createJournalResponse(createdJournal));
  } catch (error) {
    console.error('error create self screening', error);
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
    console.error('error get journals history', error);
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
    console.error('error create self screening', error);
    return res.status(500).json(serverErrorResponse());
  }
};

const getUserJournalForPsychologist = async (req: Request, res: Response) => {
  const { username_or_fullname } = req.params;
  try {
    const foundUser = await UserService.getUserByUsernameOrFullName(username_or_fullname);
    if (!foundUser) return res.status(400).json(nameNotFoundResponse(username_or_fullname));
    if (!foundUser.allow_journal)
      return res.status(400).json(isNotAllowedSeenJournalResponse(titleCase(foundUser.full_name)));
    const journalUser = await JournalingService.getJournalsByUserId(foundUser.id);
    return res.status(200).json(getJournalResponseForPsychologist(journalUser, foundUser, req.body as getQueryPayload));
  } catch (error) {
    if (error instanceof Prisma.PrismaClientValidationError)
      return res.status(200).json(handleErrorEmptyDataResponse(req.body as getQueryPayload));
    console.error('error get users journal', error);
    return res.status(500).json(serverErrorResponse());
  }
};

const getUserJournalDetailForPsychologist = async (req: Request, res: Response) => {
  const { username_or_fullname, id } = req.params;
  try {
    const foundUser = await UserService.getUserByUsernameOrFullName(username_or_fullname);
    if (!foundUser) return res.status(400).json(nameNotFoundResponse(username_or_fullname));
    if (!foundUser.allow_journal)
      return res.status(400).json(isNotAllowedSeenJournalResponse(titleCase(foundUser.full_name)));
    const journalDetailHistory = await JournalingService.getDetailJournalByUserId(foundUser.id, id);
    if (!journalDetailHistory) return res.status(404).json(idNotFoundResponse(id));
    return res.status(200).json(getJournalDetailResponse(journalDetailHistory));
  } catch (error) {
    console.error('error create self screening', error);
    return res.status(500).json(serverErrorResponse());
  }
};

const JournalingController = {
  createJournal,
  getJournalHistory,
  getJournalDetailHistory,
  getUserJournalForPsychologist,
  getUserJournalDetailForPsychologist,
};

export default JournalingController;
