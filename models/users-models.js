const db = require("../db/connection");

exports.fetchUsers = () => {
  return db.query(`SELECT * FROM users;`).then(({ rows }) => {
    return rows;
  });
};

exports.fetchUserByUsername = (username) => {
  const query = `SELECT * FROM users WHERE username = $1`;
  return db.query(query, [username]).then(({ rows }) => {
    if (!rows[0]) return Promise.reject("Not Found");
    else {
      return rows[0];
    }
  });
};
