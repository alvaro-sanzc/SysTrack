const express = require("express");

const app = express();

// Middlewares
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.send('API funcionando');
});

const incidents = require('./routes/incidents');
app.use('/incidents',incidents);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 404,
    message: 'Ruta no encontrada'
  });
});

// Error handler
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    message: err.message || 'Error interno del servidor'
  });
});

module.exports = app;