import MusicData from '../data/music.data';
import { deleteFromCloudinary, uploadToCloudinary } from '../utils/functions/fileFunction';
import { createMusicPayload, updateMusicPayload } from '../utils/types/payload';
import { Music } from '../utils/types/types';

const getMusicByTitle = (title: string) => MusicData.getMusicByTitle(title);

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

const MusicService = {
  getMusicByTitle,
  createMusic,
  updateMusic,
};

export default MusicService;
