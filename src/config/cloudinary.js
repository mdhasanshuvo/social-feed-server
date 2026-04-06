const cloudinary = require('cloudinary').v2;

const cleanEnv = (value, fallback = '') => {
  const raw = (value || fallback).toString();
  return raw.replace(/[\r\n]/g, '').trim().replace(/^['"]|['"]$/g, '');
};

const cloudName = cleanEnv(process.env.CLOUDINARY_CLOUD_NAME);
const apiKey = cleanEnv(process.env.CLOUDINARY_API_KEY);
const apiSecret = cleanEnv(process.env.CLOUDINARY_API_SECRET);

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret
});

module.exports = cloudinary;
