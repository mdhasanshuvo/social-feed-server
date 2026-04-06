const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const swaggerUi = require('swagger-ui-express');
const routes = require('./routes');
const swaggerSpec = require('./config/swagger');
const errorHandler = require('./middleware/errorHandler');
const ApiError = require('./utils/apiError');
const sanitizeRequest = require('./middleware/sanitize');

const app = express();
const clientOrigin = (process.env.CLIENT_ORIGIN || '*').replace(/[\r\n]/g, '').trim() || '*';

app.use(cors({ origin: clientOrigin }));
app.use(helmet());
app.use(express.json({ limit: '1mb' }));
app.use(sanitizeRequest);

app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, message: 'Server is healthy' });
});

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api', routes);

app.use((req, res, next) => {
  next(new ApiError(404, 'Route not found'));
});

app.use(errorHandler);

module.exports = app;
