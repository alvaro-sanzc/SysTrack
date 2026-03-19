const db = require('../db/conn');

const getIncidents = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM incidents');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching incidents' });
  }
};

module.exports = { getIncidents };