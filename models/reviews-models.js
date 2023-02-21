const db = require("../db/connection");
const reviews = require("../db/data/test-data/reviews");

exports.fetchReviews = () => {
  const query = `
       SELECT reviews.*, COUNT(comments.comment_id) AS comment_count
                  FROM reviews
                  LEFT JOIN comments ON reviews.review_id = comments.review_id
                  GROUP BY reviews.review_id
                  ORDER BY reviews.created_at DESC;`;
  return db.query(query).then(({ rows }) => {
    rows.forEach((row) => (row.comment_count = +row.comment_count));
    return rows;
  });
};

exports.fetchReviewById = (review_id) => {
  const query = `
      SELECT review_id, title, review_body, designer, review_img_url, votes, category, owner, created_at
      FROM reviews
      WHERE review_id = $1;
      `;
  return db.query(query, [review_id]).then(({ rows }) => {
    if (!rows[0]) return Promise.reject("Not Found");
    else return rows[0];
  });
};

exports.fetchReviewComments = (review_id) => {
  return db
    .query(`SELECT * FROM reviews WHERE review_id = $1`, [review_id])
    .then(({ rows }) => {
      if (!rows[0]) return Promise.reject("Not Found");
      const query = `SELECT * FROM comments WHERE review_id = $1 
        ORDER BY created_at DESC;`;
      return db.query(query, [review_id]);
    })
    .then(({ rows }) => {
      if (!rows[0]) return Promise.reject("Not Found");
      return rows;
    });
};
