const db = require("../db/connection");

exports.removeCommentById = (comment_id) => {
  const query = `
    DELETE FROM comments
    WHERE comment_id = $1
    RETURNING *;`;
  return db.query(query, [comment_id]).then(({ rows }) => {
    if (!rows[0]) return Promise.reject("Not Found");
  });
};

exports.updateCommentById = (comment_id, update) => {
  const { inc_votes } = update;
  const query = `
  UPDATE comments SET votes = votes + $1 WHERE comment_id = $2
  RETURNING*;`;
  return db.query(query, [inc_votes, comment_id]).then(({ rows }) => {
    if (!rows[0]) return Promise.reject("Not Found");
    else return rows[0];
  });
};
