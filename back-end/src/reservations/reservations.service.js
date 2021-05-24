const { table } = require("../db/connection");
const knex = require("../db/connection");
const tableName = "reservations";

function list(date){
  return knex(tableName)
  .select("*")
  .whereNot("status", "finished")
  .andWhereNot("status", "cancelled")
  .andWhere({reservation_date: date});
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

function updateStatus(id, updatedRes){
  return knex(tableName)
    .select("*")
    .where({reservation_id: id})
    .update(updatedRes, "*")
    .then(reservation => reservation[0]);
}

function search(mobile_number) {
  return knex(tableName)
    .whereRaw(
      "translate(mobile_number, '() -', '') like ?",
      `%${mobile_number.replace(/\D/g, "")}%`
    )
    .orderBy("reservation_date");
}

function updateReservation(reservation){
  return knex(tableName)
    .select("*")
    .where({reservation_id: reservation.reservation_id})
    .update(reservation, "*")
    .then(reservation=>reservation[0]);
}

module.exports = {
  list,
  read,
  create,
  updateStatus,
  search,
  updateReservation,
};