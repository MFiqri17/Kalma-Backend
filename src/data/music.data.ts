import { lowerCase } from 'text-case';
import { getFormatDate } from '../utils/functions/coditionFunctions';
import { createMusicPayload, updateMusicPayload } from '../utils/types/payload';
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

const MusicData = {
  getMusicByTitle,
  createMusic,
  updateMusic,
};

export default MusicData;
