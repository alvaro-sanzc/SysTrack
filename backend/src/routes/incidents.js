const express = require("express");
const {getIncidents} = require('../controllers/incidents.controller');
const router = express.Router();

router.get('/',getIncidents);

module.exports = router;