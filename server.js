require('dotenv').config();

const client = require('./lib/client');

// Initiate database connection
client.connect();

const app = require('./lib/app');

const PORT = process.env.PORT || 7890;

// get all of the clouds

app.get('/clouds', async(req, res) => {
  const data = await client.query('SELECT * from clouds');

  // const data = await client.query(`SELECT
  //   clouds.id,
  //   clouds.name,
  //   clouds.level,
  //   clouds.is_severe,
  //   clouds.spotter_id,
  //   spotter.spotter,

  //   FROM clouds

  //   JOIN spotter

  //   ON clouds.spotter_id = spotter.id`);


  res.json(data.rows);
});

// get all of the spotter

app.get('/spotter', async(req, res) => {
  const data = await client.query('SELECT * from spotter');

  res.json(data.rows);
});

// get one cloud
app.get('/clouds/:id', async(req, res) => {
  const id = req.params.id;
  console.log('searching for cloud', id);
  const data = await client.query(
    'SELECT * from clouds where id=$1',
    [id]
  );
  res.json(data.rows[0]);
});

// create a cloud
app.post('/clouds/', async(req, res) => {
  try {
    const data = await client.query(
      `insert into clouds (name, level, is_severe, user_id)
      values ($1, $2, $3, $4)
      returning*;`,
      [req.body.name, req.body.level, req.body.is_severe, 1]
    );

    res.json(data.rows[0]);
  } catch(e) {
    console.error(e);
    res.json(e);
  }
});

// edit a cloud's name
app.put('/clouds/', async(req, res) => {
  try {
    const data = await client.query(
      `insert into clouds (name, level, is_severe, user_id)
      values ($1, $2, $3, $4)
      returning*;`,
      [req.body.name, req.body.level, req.body.is_severe, 1]
    );

    res.json(data.rows[0]);
  } catch(e) {
    console.error(e);
    res.json(e);
  }
});





app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Started on ${PORT}`);
});

module.exports = app;
