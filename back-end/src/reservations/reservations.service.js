const { table } = require("../db/connection");
const knex = require("../db/connection");
const tableName = "reservations";

function list(date){
  return knex(tableName)
  .select("*")
  .where({reservation_date: date});
}

function read(id){
  return knex(tableName)
    .select("*")
    .where({reservation_id: Number(id)})
    .then(reservation => reservation[0])
}

function create(reservation){
  return knex(tableName)
    .insert(reservation)
    .returning("*")
    .then(reservation=>reservation[0]);
}

module.exports = {
  list,
  read,
  create
};