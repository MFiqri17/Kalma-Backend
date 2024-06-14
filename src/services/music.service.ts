import MusicData from '../data/music.data';
import { getWhereConditionFunction } from '../utils/functions/conditionFunctions';
import { deleteFromCloudinary, uploadToCloudinary } from '../utils/functions/fileFunction';
import { createMusicPayload, getQueryPayload, updateMusicPayload } from '../utils/types/payload';
import { Music } from '../utils/types/types';

const createMusic = async (musicPayload: createMusicPayload, userId: string) => {
  const music_url = musicPayload.music_file
    ? (await uploadToCloudinary(musicPayload.music_file.buffer, musicPayload.music_file.mimetype)).secure_url
    : musicPayload.music_link!;
  return MusicData.createMusic(musicPayload, music_url, userId);
};

const updateMusic = async (musicPayload: updateMusicPayload, musicFound: Music, userId: string) => {
  if (musicPayload.music_file) {
    await deleteFromCloudinary(musicFound.music_link);
    const urlResult = (await uploadToCloudinary(musicPayload.music_file.buffer, musicPayload.music_file.mimetype))
      .secure_url;
    return MusicData.updateMusic(musicPayload, musicFound.id, urlResult, userId);
  } else if (musicPayload.music_link) {
    if (musicFound.music_link.trim() !== musicPayload.music_link.trim())
      await deleteFromCloudinary(musicFound.music_link);
    return MusicData.updateMusic(musicPayload, musicFound.id, musicPayload.music_link, userId);
  } else {
    return MusicData.updateMusic(musicPayload, musicFound.id, musicFound.music_link, userId);
  }
};

const getMusic = async (getPayload?: Partial<getQueryPayload>) => {
  if (getPayload && Object.keys(getPayload).length > 0) {
    const allColumns = ['title', 'author', 'genre', 'created_at_formatted', 'modified_at_formatted'];
    const whereCondition = getWhereConditionFunction(getPayload, allColumns);
    const [totalCount, data] = await Promise.all([
      MusicData.getMusicTotal(whereCondition),
      MusicData.getMusic(whereCondition, getPayload),
    ]);
    return { totalCount, data };
  }
  const [totalCount, data] = await Promise.all([
    MusicData.getMusicTotalWithoutCondition(),
    MusicData.getMusicWithoutCondition(),
  ]);
  return { totalCount, data };
};

const getMusicById = (musicId: string) => MusicData.getMusicById(musicId);
const deleteMusicById = async (musicId: string, musicLink: string) => {
  await deleteFromCloudinary(musicLink);
  return MusicData.deleteMusicById(musicId);
};

const MusicService = {
  createMusic,
  updateMusic,
  getMusic,
  getMusicById,
  deleteMusicById,
};

export default MusicService;
