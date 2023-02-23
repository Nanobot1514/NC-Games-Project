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
