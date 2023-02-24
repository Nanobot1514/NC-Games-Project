const db = require("../db/connection");
const reviews = require("../db/data/test-data/reviews");

exports.fetchReviews = (category, sort_by = "created_at", order = "desc") => {
  const validSortByOptions = [
    "review_id",
    "title",
    "designer",
    "review_img_url",
    "votes",
    "category",
    "owner",
    "created_at",
    "comment_count",
  ];

  const validCategories = [
    "social deduction",
    "dexterity",
    "children's games",
    "euro game",
    "strategy",
    "hidden-roles",
    "push-your-luck",
    "roll-and-write",
    "deck-building",
    "engine-building",
  ];

  if (sort_by && !validSortByOptions.includes(sort_by)) {
    return Promise.reject("Invalid Request");
  }

  const orderOptions = ["asc", "desc"];
  if (order && !orderOptions.includes(order)) {
    return Promise.reject("Invalid Request");
  }

  let query = `
  SELECT reviews.review_id, reviews.designer, reviews.category, reviews.title, reviews.created_at, reviews.votes, reviews.review_img_url, reviews.owner, reviews.review_body, COUNT(comments.comment_id) AS comment_count
  FROM reviews
  LEFT JOIN comments ON reviews.review_id = comments.review_id`;
  const queryParams = [];

  if (category !== undefined) {
    query += ` WHERE reviews.category = $1`;
    queryParams.push(category);
  }

  if (sort_by && order) {
    query += `
  GROUP BY reviews.review_id 
  ORDER BY ${sort_by} ${order};`;
  }

  return db.query(query, queryParams).then(({ rows }) => {
    if (!rows[0] && category && !validCategories.includes(category)) {
      return Promise.reject("Not Found");
    } else if (!rows[0] && category && validCategories.includes(category)) {
      return rows;
    } else {
      rows.forEach((row) => (row.comment_count = +row.comment_count));
      return rows;
    }
  });
};

exports.fetchReviewById = (review_id) => {
  const query = `
  SELECT reviews.review_id, reviews.designer, reviews.category, reviews.title, reviews.created_at, reviews.votes, reviews.review_img_url, reviews.owner, reviews.review_body, COUNT(comments.comment_id) AS comment_count
  FROM reviews
  LEFT JOIN comments ON reviews.review_id = comments.review_id
      WHERE reviews.review_id = $1
      GROUP BY reviews.review_id;
      `;
  return db.query(query, [review_id]).then(({ rows }) => {
    if (!rows[0]) return Promise.reject("Not Found");
    else {
      rows[0].comment_count = +rows[0].comment_count;
      return rows[0];
    }
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

exports.updateReview = (review_id, update) => {
  const { inc_votes } = update;
  const query = `
  UPDATE reviews SET votes = votes + $1 WHERE review_id = $2
  RETURNING*;`;
  return db.query(query, [inc_votes, review_id]).then(({ rows }) => {
    if (!rows[0]) return Promise.reject("Not Found");
    else return rows[0];
  });
};

exports.insertReviewComment = (review_id, newComment) => {
  const { body } = newComment;
  const query = `INSERT INTO comments (body, author, review_id)
    VALUES($1, $2, $3)
    RETURNING *;`;
  return db
    .query(query, [body, newComment.username, review_id])
    .then(({ rows }) => {
      return rows[0];
    });
};
