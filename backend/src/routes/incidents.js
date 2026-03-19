const express = require("express");
const {getIncidents, createIncidents} = require('../controllers/incidents.controller');
const router = express.Router();

router.get('/',getIncidents);

router.post('/',createIncidents);

module.exports = router;