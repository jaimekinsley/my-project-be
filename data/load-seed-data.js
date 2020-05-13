const client = require('../lib/client');
// import our seed data:
const clouds = require('./clouds.js');
const usersData = require('./users.js');
const spotterData = require('./spotter.js');


run();

async function run() {


  try {
    await client.connect();

    await Promise.all(
      spotterData.map(spotter => {
        return client.query(`
          INSERT INTO spotter (spotter)
          VALUES ($1)
          RETURNING *;
          `,
        [spotter.spotter]);
      })
    );


    const users = await Promise.all(
      usersData.map(user => {
        return client.query(`
                      INSERT INTO users (email, hash)
                      VALUES ($1, $2)
                      RETURNING *;
                  `,
        [user.email, user.hash]);
      })
    );

    const user = users[0].rows[0];

    await Promise.all(
      clouds.map(cloud => {
        return client.query(`
                    INSERT INTO clouds (name, level, is_severe, user_id, spotter_id)
                    VALUES ($1, $2, $3, $4, $5);
                `,
        [cloud.name, cloud.level, cloud.is_severe, user.id, cloud.spotter_id]);
      })
    );


    console.log('seed data load complete');
  }
  catch(err) {
    console.log(err);
  }
  finally {
    client.end();
  }

}
