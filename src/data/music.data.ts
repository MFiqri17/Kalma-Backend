import { lowerCase } from 'text-case';
import { getFormatDate } from '../utils/functions/conditionFunctions';
import { createMusicPayload, getQueryPayload, updateMusicPayload } from '../utils/types/payload';
import prisma from './prisma';

const getMusicByTitle = (title: string) => prisma.musicMeditations.findUnique({ where: { title: title } });

const createMusic = (musicPayload: createMusicPayload, musicUrl: string, userId: string) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { music_file, music_link, title, ...restData } = musicPayload;
  return prisma.musicMeditations.create({
    data: {
      title: lowerCase(title),
      created_at: getFormatDate(),
      created_at_formatted: getFormatDate('MMMM Do YYYY, HH:mm:ss'),
      created_by: userId,
      modified_at: getFormatDate(),
      modified_at_formatted: getFormatDate('MMMM Do YYYY, HH:mm:ss'),
      modified_by: userId,
      music_link: musicUrl,
      ...restData,
    },
  });
};

const updateMusic = (musicPayload: updateMusicPayload, musicId: string, musicUrl: string, userId: string) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { music_file, music_link, title, ...restData } = musicPayload;
  return prisma.musicMeditations.update({
    where: { id: musicId },
    data: {
      title: lowerCase(title),
      modified_at: getFormatDate(),
      modified_at_formatted: getFormatDate('MMMM Do YYYY, HH:mm:ss'),
      modified_by: userId,
      music_link: musicUrl,
      ...restData,
    },
  });
};

const getMusicWithoutCondition = () =>
  prisma.musicMeditations.findMany({
    select: {
      id: true,
      title: true,
      author: true,
      genre: true,
      music_link: true,
      created_at_formatted: true,
      modified_at_formatted: true,
      user: {
        select: {
          full_name: true,
        },
      },
      modifiedUser: {
        select: {
          full_name: true,
        },
      },
    },
  });

const getMusicTotalWithoutCondition = () => prisma.musicMeditations.count();

const getMusicTotal = (whereCondition: object) =>
  prisma.journals.count({
    where: whereCondition,
  });

const getMusic = async (whereCondition: object, getPayload: Partial<getQueryPayload>) => {
  const { sort_column, sort_value, size, page } = getPayload;
  return prisma.musicMeditations.findMany({
    where: whereCondition,
    orderBy: {
      [sort_column || 'modified_at']: sort_value || 'desc',
    },
    skip: page && size ? (page - 1) * size : 0,
    take: size || (await getMusicTotal(whereCondition)),
    select: {
      id: true,
      title: true,
      author: true,
      genre: true,
      music_link: true,
      created_at_formatted: true,
      modified_at_formatted: true,
      user: {
        select: {
          full_name: true,
        },
      },
      modifiedUser: {
        select: {
          full_name: true,
        },
      },
    },
  });
};

const getMusicById = (musicId: string) => prisma.musicMeditations.findUnique({ where: { id: musicId } });
const deleteMusicById = (musicId: string) => prisma.musicMeditations.delete({ where: { id: musicId } });

const MusicData = {
  getMusicByTitle,
  createMusic,
  updateMusic,
  getMusicWithoutCondition,
  getMusicTotalWithoutCondition,
  getMusicTotal,
  getMusic,
  getMusicById,
  deleteMusicById,
};

export default MusicData;
