// https://node-postgres.com/features/pooling
const Pool = require("pg").Pool;
// https://nodejs.org/en/learn/command-line/how-to-read-environment-variables-from-nodejs
const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: process.env.POSTGRES_PORT,
});

app.get('/', (req, res) => {
  getCourses().then((courses) => {
    res.send(`This is the server endpoint! ` + courses[0][1])
  });
  // res.send(`This is the server endpoint! `+courses)
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
});

//get all merchants our database
const getCourses = async () => {
  try {
    return await new Promise(function (resolve, reject) {
      pool.query("SELECT * FROM courses", (error, results) => {
        if (error) {
          reject(error);
        }
        if (results && results.rows) {
          resolve(results.rows);
        } else {
          reject(new Error("No results found"));
        }
      });
    });
  } catch (error_1) {
    console.error(error_1);
    throw new Error("Internal server error");
  }
};


module.exports = {
  getCourses,
};