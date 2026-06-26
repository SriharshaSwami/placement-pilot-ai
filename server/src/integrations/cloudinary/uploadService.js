import cloudinary from './config.js';
import CustomError from '../../errors/CustomError.js';

import { Readable } from 'stream';

export const uploadFile = async (file, folder = 'placementpilot') => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder, resource_type: 'auto' },
      (error, result) => {
        if (error) {
          return reject(new CustomError(`Failed to upload to Cloudinary: ${error.message}`, 502, 'UPLOAD_GATEWAY_ERROR'));
        }
        resolve({
          url: result.secure_url,
          publicId: result.public_id,
          format: result.format,
          bytes: result.bytes,
        });
      }
    );

    const readable = new Readable();
    readable.push(file.buffer);
    readable.push(null);
    readable.pipe(uploadStream);
  });
};

export const deleteFile = async (publicId) => {
  try {
    // Try image first (Cloudinary auto-detects PDFs as image type)
    let result = await cloudinary.uploader.destroy(publicId, { resource_type: 'image' });
    if (result.result !== 'ok') {
      // Fallback to raw
      await cloudinary.uploader.destroy(publicId, { resource_type: 'raw' });
    }
  } catch (error) {
    throw new CustomError(`Failed to delete from Cloudinary: ${error.message}`, 500, 'DELETE_ERROR');
  }
};
