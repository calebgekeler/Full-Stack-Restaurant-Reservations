const knex = require("../db/connection");
const tableName = "reservations"
function list(date){
  return knex(tableName)
  .select("*")
  .where({reservation_date: date});
}

function create(reservation){
  return knex(tableName)
    .insert(reservation)
    .returning("*")
    .then(reservation=>reservation[0]);
}

module.exports = {
  list,
  create
};