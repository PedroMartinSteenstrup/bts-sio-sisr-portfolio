// Items in the global namespace are accessible throught out the node application
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

//get all from our database
const getData = async (sql_query, values) => {
    try {
        return await new Promise(function (resolve, reject) {
            pool.query(sql_query, values, (error, results) => {
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
    } catch (err) {
        console.error(err);
    }
};

/**
 * Insérer données dans une table.
 * @param {string} sql_query - The SQL query to execute.
 * @param {Array} values - The values to insert.
 * @returns {Promise<object>} - A promise that resolves with the result of the query.
 */
const insertData = async (sql_query, values) =>  {
    try {
        return await new Promise((resolve, reject) => {
            pool.query(sql_query, values, (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        });
    } catch (err) {
        console.error('Error inserting data:', err);
        throw err;
    }
};


module.exports = {
    getData,
    insertData
};