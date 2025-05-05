const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const { check, validationResult } = require('express-validator');
const dotenv = require('dotenv');
const winston = require('winston');
const asyncHandler = require('express-async-handler');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const sampleData = {
  items: [
    { id: '1', name: 'Example 1', description: 'This is an example item', createdAt: '2024-03-20T10:00:00Z' },
    { id: '2', name: 'Example 2', description: 'This is another example item', createdAt: '2024-03-20T11:00:00Z' }
  ]
};

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [new winston.transports.Console()]
});

app.use(cors());
app.use(helmet());
app.use(morgan('combined', { stream: { write: (message) => logger.info(message.trim()) } }));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));
app.use(bodyParser.json());
app.use(compression());
app.use(cookieParser());

/**
 * @route GET /health
 * @description Health check endpoint
 */
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

/**
 * @route POST /items
 * @description Create a new item or multiple items
 */
app.post('/items', asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  let newItem;
  if (Array.isArray(req.body)) {
    newItem = req.body.map((item,index) => ({...item, id: (sampleData.items.length + 1 + index).toString()}));
    sampleData.items = [...sampleData.items, ...newItem]
  } else {
    newItem = { ...req.body, id: (sampleData.items.length + 1).toString() };
    sampleData.items.push(newItem);
  }
  res.status(201).json(newItem);
}));


/**
 * @route GET /items
 * @description Get all items
 */
app.get('/items', (req, res) => {
  res.json(sampleData.items);
});

/**
 * @route GET /items/:id
 * @description Get a single item by ID
 */
app.get('/items/:id', (req, res) => {
  const item = sampleData.items.find((item) => item.id === req.params.id);
  if (item) {
    res.json(item);
  } else {
    res.status(404).send('Item not found');
  }
});

/**
 * @route PUT /items/:id
 * @description Update an item by ID
 */
app.put('/items/:id', asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  const index = sampleData.items.findIndex((item) => item.id === req.params.id);
  if (index === -1) {
    res.status(404).send('Item not found');
  } else {
    sampleData.items[index] = { ...sampleData.items[index], ...req.body };
    res.json(sampleData.items[index]);
  }
}));

/**
 * @route DELETE /items/:id
 * @description Delete an item by ID
 */
app.delete('/items/:id', (req, res) => {
  const index = sampleData.items.findIndex((item) => item.id === req.params.id);
  if (index === -1) {
    res.status(404).send('Item not found');
  } else {
    sampleData.items.splice(index, 1);
    res.status(204).send();
  }
});

/**
 * @route DELETE /items
 * @description Delete multiple items by IDs
 */
app.delete('/items', asyncHandler(async (req, res) => {
    const idsToDelete = req.body;
    if (!Array.isArray(idsToDelete)) {
        return res.status(400).json({ error: 'Request body must be an array of IDs' });
    }
    sampleData.items = sampleData.items.filter(item => !idsToDelete.includes(item.id));
    res.status(204).send();
}));

/**
 * @middleware errorHandler
 * @description Centralized error handling middleware
 */
app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(port, () => {
  logger.info(`Server listening on port ${port}`);
});