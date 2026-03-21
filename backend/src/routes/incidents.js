const express = require("express");
const {getIncidents, createIncidents, deleteIncident} = require('../controllers/incidents.controller');
const router = express.Router();

router.get('/',getIncidents);

router.post('/',createIncidents);

router.delete('/:id', deleteIncident);

module.exports = router;