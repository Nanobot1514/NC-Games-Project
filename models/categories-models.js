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
      console.log(categories);
      if (categories.rowCount === 0) {
        return Promise.reject("No Categories Found");
      } else {
        return categories.rows;
      }
    });
};
