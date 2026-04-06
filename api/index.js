const app = require('../src/app');
const connectDB = require('../src/config/db');

const setCorsHeaders = (req, res) => {
  const configuredOrigin = (process.env.CLIENT_ORIGIN || '*').replace(/[\r\n]/g, '').trim() || '*';
  const requestOrigin = req.headers.origin;
  const allowOrigin = configuredOrigin === '*' ? '*' : requestOrigin || configuredOrigin;

  res.setHeader('Access-Control-Allow-Origin', allowOrigin);
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
};

module.exports = async (req, res) => {
  const isHealth = req.url === '/api/health';
  const isPreflight = req.method === 'OPTIONS';

  if (isPreflight) {
    setCorsHeaders(req, res);
    return res.status(204).end();
  }

  if (!isHealth) {
    try {
      await connectDB();
    } catch (error) {
      setCorsHeaders(req, res);
      return res.status(503).json({
        success: false,
        message: 'Database connection failed on server'
      });
    }
  }

  return app(req, res);
};
