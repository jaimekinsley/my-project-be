require('dotenv').config();

const client = require('./lib/client');

// Initiate database connection
client.connect();

const app = require('./lib/app');

const PORT = process.env.PORT || 7890;

// get all of the clouds

app.get('/clouds', async(req, res) => {
  const data = await client.query(`
  SELECT clouds.id, clouds.name, clouds.level, clouds.is_severe, spotter.spotter
  FROM clouds
  JOIN spotter
  on clouds.spotter_id = spotter.id`);

  res.json(data.rows);
});

// get all of the spotter

app.get('/spotter', async(req, res) => {
  const data = await client.query('SELECT * from spotter');

  res.json(data.rows);
});

// get one cloud
app.get('/clouds/:id', async(req, res) => {
  const data = await client.query(`
  SELECT clouds.id, clouds.name, clouds.level, clouds.is_severe, spotter.spotter
  FROM clouds
  JOIN spotter
  on clouds.spotter_id = spotter.id
  where clouds.id = $1`,
  [req.params.id]);

  res.json(data.rows[0]);
});

// create a cloud
app.post('/clouds', async(req, res) => {
  try {
    const data = await client.query(
      `INSERT INTO clouds (user_id, name, level, is_severe, spotter_id)
      values ($1, $2, $3, $4, $5)
      returning*;`,
      [1, req.body.name, req.body.level, req.body.is_severe, req.body.spotter_id]
    );

    res.json(data.rows[0]);
  } catch(e) {
    console.error(e);
    res.json(e);
  }
});

// edit a cloud's name
app.put('/clouds/:id', async(req, res) => {
  try {
    const id = req.params.id;
    const data = await client.query(
      `UPDATE clouds
      SET name = $2,
          level = $3,
          is_severe = $4
          WHERE id = $1
          RETURNING *;`,
      [id, req.body.name, req.body.level, req.body.is_severe]
    );

    res.json(data.rows[0]);
  } catch(err) {
    if(err.code === '23505'){
      res.status(400).json({
        error: `"${req.body.name}" already exists`
      });
    }
    else {
      res.status(500).json({
        error: err.message || err
      });
    }
  }
});

// delete a cloud
app.delete('/clouds/:id', async(req, res) => {
  const id = req.params.id;

  try {
    const result = await client.query(`
    DELETE FROM clouds
    WHERE id = $1
    RETURNING *;`,
    [id]);
    if(result.rowCount === 0){
      res.status(404).json({
        error: 'Resource not found in database'
      });
    } else {
      res.json(result.rows[0]);
    }
  }
  catch(err) {
    if(err.code === '23505') {
      res.status(400).json({
        error: 'Could not remove, cloud is in use.'
      });
    }
    else {
      res.status(500).json({
        error: err.message || err
      });
    }
  }
});


app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Started on ${PORT}`);
});

module.exports = app;
