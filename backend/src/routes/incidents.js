const express = require("express");
const {getIncidents, createIncidents, updateIncident, deleteIncident} = require('../controllers/incidents.controller');
const router = express.Router();

router.get('/',getIncidents);

router.post('/',createIncidents);

router.patch('/:id', updateIncident);

router.delete('/:id', deleteIncident);

module.exports = router;