import multer, { FileFilterCallback, memoryStorage } from 'multer';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = memoryStorage();
export const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb: FileFilterCallback) {
    cb(null, true);
  },
});

const getPublicIdFromUrl = (url: string): string => {
  const urlParts = url.split('/');
  const folderAndFileName = urlParts.slice(-2).join('/');
  const publicId = folderAndFileName.split('.')[0];
  return publicId;
};

export const uploadToCloudinary = (buffer: Buffer, mimetype: string): Promise<UploadApiResponse> => {
  return new Promise((resolve, reject) => {
    let folder = 'others';
    if (mimetype.startsWith('image/')) {
      folder = 'images';
    } else if (mimetype === 'audio/mp3' || mimetype === 'audio/mpeg') {
      folder = 'audios';
    }

    const stream = cloudinary.uploader.upload_stream(
      {
        resource_type: mimetype.startsWith('image/') ? 'image' : 'video',
        folder: folder,
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result!);
        }
      },
    );
    stream.end(buffer);
  });
};

export const deleteFromCloudinary = async (fileUrl: string) => {
  const publicId = getPublicIdFromUrl(fileUrl).trim();
  console.log(publicId);
  await cloudinary.uploader.destroy(publicId, (error, result) => {
    if (error) {
      console.log('error', error);
    } else {
      console.log('success', result);
    }
  });
};
