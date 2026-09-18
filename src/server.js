// src/server.js
// HPDC ESG Certificate Platform � Fastify Server Bootstrap
require('dotenv').config();

const Fastify = require('fastify');
const cors = require('@fastify/cors');
const jwt = require('@fastify/jwt');
const websocket = require('@fastify/websocket');
const multipart = require('@fastify/multipart');

// Route imports
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const uploadRoutes = require('./routes/upload.routes');
const dashboardRoutes = require('./routes/dashboard.routes');
const applicationRoutes = require('./routes/application.routes');
const commentRoutes = require('./routes/comment.routes');
const certificateRoutes = require('./routes/certificate.routes');
const logRoutes = require('./routes/log.routes');
const companyRoutes = require('./routes/company.routes');
const surveyRoutes = require('./routes/survey.routes');
const certManagementRoutes = require('./routes/cert-management.routes');
const publicRoutes = require('./routes/public.routes');

// DI Container
const buildContainer = require('./container');

async function start() {
  const fastify = Fastify({
    logger: {
      level: process.env.LOG_LEVEL || 'info',
    },
  });

  // CORS � allow frontend origin
  await fastify.register(cors, {
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  });

  // JWT
  await fastify.register(jwt, {
    secret: process.env.JWT_ACCESS_SECRET || 'super_secret_hpdc_access_key_2026',
  });

  // WebSocket
  await fastify.register(websocket);

  // Multipart for File Uploads
  await fastify.register(multipart, {
    limits: {
      fileSize: 25 * 1024 * 1024, // 25MB max
    },
  });

  // BigInt JSON serialization
  fastify.addHook('preSerialization', async (request, reply, payload) => {
    return JSON.parse(
      JSON.stringify(payload, (key, value) =>
        typeof value === 'bigint' ? value.toString() : value
      )
    );
  });

  // Build DI Container
  const container = buildContainer(fastify);

  // Swagger Documentation
  await fastify.register(require('@fastify/swagger'), {
    openapi: {
      info: {
        title: 'HPDC ESG Certification & Compliance Platform API',
        description: 'Complete API documentation for Company and Admin portals',
        version: '1.0.0',
      },
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
      },
    },
  });

  await fastify.register(require('@fastify/swagger-ui'), {
    routePrefix: '/docs',
    uiConfig: {
      docExpansion: 'list',
      deepLinking: false,
    },
  });

  // Public routes (no auth)
  await fastify.register(async (instance) => {
    await authRoutes(instance, container);
  });

  // Public-facing endpoints (no auth, no prefix)
  await fastify.register(publicRoutes);

  // API routes
  await fastify.register(async (instance) => {
    await userRoutes(instance, container);
    await uploadRoutes(instance);
    await dashboardRoutes(instance, container);
    await applicationRoutes(instance, container);
    await commentRoutes(instance, container);
    await certificateRoutes(instance, container);
    await logRoutes(instance, container);
    await companyRoutes(instance, container);
    await surveyRoutes(instance, container);
    await certManagementRoutes(instance, container);
  }, { prefix: '/api' });

  // Health Check
  fastify.get('/health', async () => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  });

  // Start Server
  const port = parseInt(process.env.PORT) || 4000;
  const host = process.env.HOST || '0.0.0.0';

  try {
    await fastify.listen({ port, host });
    console.log(`HPDC Backend running at http://${host}:${port}`);
    console.log(`Swagger Docs at http://localhost:${port}/docs`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

start();

