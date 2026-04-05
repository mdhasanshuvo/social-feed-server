const cloudinary = require('../config/cloudinary');
const ApiError = require('../utils/apiError');

const uploadImageBuffer = async (buffer) => {
  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
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
