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

function update(id, table){
  return knex(tableName)
    .select("*")
    .where({table_id: id})
    .update(table, "*");
}


module.exports = { 
  list,
  read,
  create,
  update,
}