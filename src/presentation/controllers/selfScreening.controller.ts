import { Request, Response } from 'express';
import SelfScreeningService from '../../services/selfScreening.service';
import {
  handleErrorEmptyDataResponse,
  idNotFoundResponse,
  selfScreeningHistoryDetailResponse,
  selfScreeningHistoryResponse,
  selfScreeningTestResponse,
  serverErrorResponse,
} from '../../utils/functions/responseFunction';
import { getQueryPayload, selfScreeningPayload } from '../../utils/types/payload';
import { selfScreeningSetterFunction } from '../../utils/functions/selfScreeningFunction';
import { Prisma } from '@prisma/client';

const createSelfScreening = async (req: Request, res: Response) => {
  try {
    const formatedPayload = selfScreeningSetterFunction(req.body as selfScreeningPayload);
    const createdSelfScreening = await SelfScreeningService.createSelfScreening(formatedPayload, req.user!.id);
    return res.status(200).json(selfScreeningTestResponse(createdSelfScreening));
  } catch (error) {
    console.error('error create self screening', error);
    return res.status(500).json(serverErrorResponse());
  }
};

const getSelfScreeningHistory = async (req: Request, res: Response) => {
  try {
    const selfScreeningHistory = await SelfScreeningService.getSelfScreenings(
      req.user!.id,
      req.body as getQueryPayload,
    );
    return res.status(200).json(selfScreeningHistoryResponse(selfScreeningHistory, req.body as getQueryPayload));
  } catch (error) {
    if (error instanceof Prisma.PrismaClientValidationError)
      return res.status(200).json(handleErrorEmptyDataResponse(req.body as getQueryPayload));
    console.error('error get self screening history', error);
    return res.status(500).json(serverErrorResponse());
  }
};

const getDetailSelfScreeningHistory = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const selfScreeningDetailHistory = await SelfScreeningService.getDetailSelfScreening(req.user!.id, id);
    if (!selfScreeningDetailHistory) return res.status(404).json(idNotFoundResponse(id));
    return res.status(200).json(selfScreeningHistoryDetailResponse(selfScreeningDetailHistory));
  } catch (error) {
    console.error('error get self screening history detail', error);
    return res.status(500).json(serverErrorResponse());
  }
};

const SelfScreeningController = {
  createSelfScreening,
  getSelfScreeningHistory,
  getDetailSelfScreeningHistory,
};

export default SelfScreeningController;
