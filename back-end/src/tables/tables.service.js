const { where } = require("../db/connection");
const knex = require("../db/connection");
const tableName = "tables";

function list(){
  return knex(tableName)
    .select("*")
}

function read(id){
  return knex(tableName)
    .select("*")
    .where({table_id: id})
    .then(table => table[0])
}

function create(table){
  return knex(tableName)
    .insert(table)
    .returning("*")
    .then(table=>table[0]);
}

async function update(id, table, resId){
  // when we update the table, use knex.transaction to also update reservation status to "seated"
  // const trx = await knex.transaction();

  // trx(tableName)
  //   .select("*")
  //   .where({table_id: id})
  //   .update(table, "*")
  //   .then(function(){
  //     return trx("reservations")
  //       .select("*")
  //       .where({reservation_id: resId})
  //       .insert({status: "seated"})
  //   })
  return knex(tableName)
    .select("*")
    .where({table_id: id})
    .update(table, "*");
}

function unassign(id){
  return knex(tableName)
    .where({table_id: id})
    .update({reservation_id: null})
}


module.exports = { 
  list,
  read,
  create,
  update,
  unassign,
}