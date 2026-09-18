// src/routes/upload.routes.js
const { uploadBuffer } = require('../config/cloudinary');

async function uploadRoutes(fastify) {
  fastify.post('/upload', async (req, reply) => {
    try {
      // Handle multipart file upload
      const data = await req.file();
      if (!data) {
        return reply.code(400).send({ success: false, error: 'No file provided' });
      }

      const buffer = await data.toBuffer();
      const filename = data.filename.replace(/\.[^/.]+$/, "");
      const ext = data.filename.split('.').pop();

      const result = await uploadBuffer(buffer, {
        public_id: `${filename}_${Date.now()}`,
        resource_type: 'auto',
      });

      return reply.code(200).send({
        success: true,
        url: result.secure_url,
        file_name: data.filename,
        file_type: data.mimetype,
        format: ext,
      });
    } catch (err) {
      req.log.error(err);
      return reply.code(500).send({ success: false, error: err.message || 'File upload failed' });
    }
  });
}

module.exports = uploadRoutes;
