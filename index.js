const pg = require('pg');
const client = new pg.Client('postgres://localhost/ice_cream_shop_db');
const express = require('express');
const app = express();
app.use(express.json());
const path = require('path');

const homePage = path.join(__dirname, 'index.html');
app.get('/', (req, res)=> res.sendFile(homePage));

const reactApp = path.join(__dirname, 'dist/main.js');
app.get('/dist/main.js', (req, res)=> res.sendFile(reactApp));

const reactSourceMap = path.join(__dirname, 'dist/main.js.map');
app.get('/dist/main.js.map', (req, res)=> res.sendFile(reactSourceMap));

const styleSheet = path.join(__dirname, 'styles.css');
app.get('/styles.css', (req, res)=> res.sendFile(styleSheet));

app.get('/api/flavors', async(req, res, next)=> {
  try {
    const SQL = `
      SELECT *
      FROM flavors
    `;
    const response = await client.query(SQL);
    res.send(response.rows);
  } catch (error) {
    next(error);
  }
});

app.get('/api/flavors/:id', async(req, res, next)=> {
  try {
    const SQL = `
      SELECT *
      FROM flavors
      WHERE id = $1
    `;
    const response = await client.query(SQL, [ req.params.id ]);
    if(response.rows.length === 0) {
      throw new Error("ID does not exist");
    }
    res.send(response.rows[0]);
  } catch (error) {
    next(error);
  }
});

app.delete('/api/flavors/:id', async(req, res, next)=> {
  try {
    const SQL = `
      DELETE
      FROM flavors
      WHERE id = $1
    `;
    const response = await client.query(SQL, [ req.params.id ]);
    res.send(response);
  } catch (error) {
    next(error);
  }
});

app.use('*', (req, res, next)=> {
  res.status(404).send('Invalid Route');
});

app.use((err, req, res, next)=> {
  console.log('error handler');
  res.status(500).send(err.message);
});

const init = async()=> {
  await client.connect();
  console.log('connected to database');
  const SQL = `
  DROP TABLE IF EXISTS flavors;
    CREATE TABLE flavors(
      id SERIAL PRIMARY KEY,
      name VARCHAR(20)
    );
    INSERT INTO flavors(name) VALUES ('Vanilla');
    INSERT INTO flavors(name) VALUES ('Chocolate');
    INSERT INTO flavors(name) VALUES ('Strawberry');
    INSERT INTO flavors(name) VALUES ('Mint Chocolate Chip');
    INSERT INTO flavors(name) VALUES ('Cookies and Cream');
    INSERT INTO flavors(name) VALUES ('Rocky Road');
    INSERT INTO flavors(name) VALUES ('Butter Pecan');
    INSERT INTO flavors(name) VALUES ('Coffee');
    INSERT INTO flavors(name) VALUES ('Rainbow Sherbet');
    INSERT INTO flavors(name) VALUES ('Pistachio');
  `;
  await client.query(SQL);
  console.log('create your tables and seed data');

  const port = process.env.PORT || 3000;
  app.listen(port, ()=> {
    console.log(`listening on port ${port}`);
  });
}

init();
