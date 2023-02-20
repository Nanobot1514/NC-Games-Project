const db = require("../db/connection");
const categories = require("../db/data/test-data/categories");

exports.fetchCategories = () => {
  return db
    .query(
      `
            SELECT * FROM categories
        `
    )
    .then((categories) => {
      if (categories.rowCount === 0) {
        return Promise.reject("No Categories Found");
      } else {
        return categories.rows;
      }
    });
};

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
