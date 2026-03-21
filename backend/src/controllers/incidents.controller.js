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

const createIncidents = async (req, res) => {
    try {
        const {user_name, title, description, severity} = req.body;
        
        // Validate fields to prevent unexpected input
        const allowFields = ['user_name', 'title', 'description', 'severity'];
        const receivedFields = Object.keys(req.body);

        const invalidFields = receivedFields.filter(
            field => !allowFields.includes(field)
        );

        if(invalidFields.length > 0){
            return res.status(400).json({
                message: "Permited fields: user_name, title, description, severity",
                error: `Invalid fields: ${invalidFields.join(', ')}`
            });
        }

        // Ensure required fields 
        if(!user_name|| !title || !severity){
           return res.json("Missing required fields: user_name, title, severity");
        }

        // Ensure "severity" values
        const validSeverities = ["low", "medium", "high", "critical", "info"]
        if(!validSeverities.includes(severity)){
            return res.json("severity can only be: low, medium, high, critical or info")
        }

        const result = db.query(`
            INSERT INTO INCIDENTS (user_name, title, description, severity) 
            VALUES ($1, $2, $3, $4)`,
            [user_name, title, description, severity]
        );
        res.status(201).json((await result).rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Error creating incidents'});
    }
};

const deleteIncident = async (req,res) => {
    try {
        const id = parseInt(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({ error: 'Invalid ID' });
        }

        const result = db.query(`
            DELETE FROM INCIDENTS WHERE id=$1`,
            [id]
        );
        if((await result).rowCount == 0){
            return res.status(404).json({error: 'id not found'})
        }

        res.status(200).json({
            message: 'Deleted succesfully',
            incident: (await result).rows[0]
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Error deleting incidents'});
        
    }
};

module.exports = { getIncidents, createIncidents, deleteIncident };