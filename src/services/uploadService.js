const cloudinary = require('../config/cloudinary');
const ApiError = require('../utils/apiError');

const cleanEnv = (value, fallback = '') => {
  const raw = (value || fallback).toString();
  return raw.replace(/[\r\n]/g, '').trim().replace(/^['"]|['"]$/g, '');
};

const uploadImageBuffer = async (buffer) => {
  const cloudName = cleanEnv(process.env.CLOUDINARY_CLOUD_NAME);
  const apiKey = cleanEnv(process.env.CLOUDINARY_API_KEY);
  const apiSecret = cleanEnv(process.env.CLOUDINARY_API_SECRET);

  if (!cloudName || !apiKey || !apiSecret) {
    throw new ApiError(500, 'Cloudinary is not configured on the server');
  }

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: 'social-feed/posts'
      },
      (error, result) => {
        if (error) {
          reject(new ApiError(500, 'Image upload failed'));
          return;
        }

        resolve(result.secure_url);
      }
    );

    stream.end(buffer);
  });
};

module.exports = {
  uploadImageBuffer
};
