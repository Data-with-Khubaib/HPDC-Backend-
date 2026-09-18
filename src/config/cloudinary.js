// src/config/cloudinary.js
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'demo',
  api_key: process.env.CLOUDINARY_API_KEY || 'demo_key',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'demo_secret',
});

async function uploadBuffer(buffer, options = {}) {
  const isConfigured =
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_KEY !== 'your_api_key' &&
    process.env.CLOUDINARY_API_KEY !== 'demo_key';

  if (isConfigured) {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { resource_type: 'auto', folder: 'hpdc_documents', ...options },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.end(buffer);
    });
  }

  // Fallback for development if live Cloudinary keys are not provided
  const filename = options.public_id || `doc_${Date.now()}`;
  return {
    secure_url: `https://res.cloudinary.com/demo/image/upload/v1/hpdc/${filename}.pdf`,
    public_id: filename,
    format: 'pdf',
    resource_type: 'raw',
  };
}

module.exports = {
  cloudinary,
  uploadBuffer,
};
