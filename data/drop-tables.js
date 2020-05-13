const client = require('../lib/client');

run();

async function run() {

  try {
    await client.connect();

    await client.query(`
            DROP TABLE IF EXISTS users CASCADE;
            DROP TABLE IF EXISTS spotter CASCADE;
            DROP TABLE IF EXISTS clouds;
        `);

    console.log('drop tables complete');
  }
  catch(err) {
    console.log(err);
  }
  finally {
    client.end();
  }

}
