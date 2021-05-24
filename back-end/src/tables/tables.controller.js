const service = require("./tables.service");
const errorCatcher = require("../errors/asyncErrorBoundary");
const resService = require("../reservations/reservations.service");

async function list(req, res) {
  const result = await service.list();
  const sortedResult = result.sort((a, b) => a.table_name > b.table_name ? 1 : -1);
  res.json({
    data: sortedResult,
  });
}

async function tableExists(req, res, next){
  const {table_id} = req.params;
  const table = await service.read(table_id);
  if(!table){
    next({
      status: 404, //this was changed to 404 to pass us-05
      message: `Table ${table_id} does not exist`
    })
  }
  res.locals.table = table;
  next();
}

function read(req, res){
  res.json({data: res.locals.table});
}

function bodyHasData(req, res, next){
  const data = req.body.data;
  if(!data){
    return next({
      status: 400,
      message: `request is missing a body`
    })
  }
  next();
}

function bodyHasTableName(req, res, next){
  const tableName = req.body.data.table_name;
  if(!tableName || tableName.length<2){
    return next({
      status: 400,
      message: `table_name is require`
    })
  }
  next();
}

function bodyHasCapacity(req, res, next){
  const capacity = req.body.data.capacity;
  if(!capacity || isNaN(capacity) || capacity<1){
    next({
      status: 400,
      message: `request required a capacity of 1 or higher`
    })
  }
  next();
}

async function create(req, res){
  const table = req.body.data;
  const result = await service.create(table);
  res.status(201).json({data: result});
}

function bodyHasResId(req, res, next){
  const resId = req.body.data.reservation_id;
  if(!resId){
    return next({
      status: 400,
      message: `body require reservation_id`
    });
  }
  next();
}

async function tableIsOccupided(req, res, next){
  const tableId = req.params.table_id;
  const table = await service.read(tableId);
  if(table.reservation_id!==null){
    return next({
      status: 400,
      message: `the table is already occupied`
    });
  }
  res.locals.table = table;
  next();
}

async function resExists(req, res, next){
  const resId = req.body.data.reservation_id;
  const reservation = await resService.read(resId);
  if(!reservation){
    next({
      status: 404,
      message: `reservation ${resId} does not exist`

    });
  }
  res.locals.reservation = reservation;
  next();
}

function tableIsBigEnough(req, res, next){
  if(res.locals.reservation.people>res.locals.table.capacity){
    return next({
      status: 400,
      message: `this table does not have enough capacity`
    })
  }
  next();
}

function validateTableIsNotSeated(req, res, next){
  if(res.locals.reservation.status==="seated"){
    next({
      status: 400,
      message :`reservation is already seated`
    })
  }
  next();
}

async function seatResToTable(req, res){
  // adds the reservation_id to the table to "seat the table"
  // from this function, need to change the status of the reservation to "seated"
  const { table: { reservation_id: resId, ...table }} = res.locals;
  const reservationId = res.locals.reservation.reservation_id;
  const updatedTable = {...table, ...req.body.data};
  const data = await service.update(res.locals.table.table_id, updatedTable, reservationId);
  __changeResStatus("seated", reservationId, res.locals.reservation);
  
  res.status(200).json({data});
}

async function tableIsNotOccupied(req, res, next){
  const tableId = req.params.table_id;
  const table = await service.read(tableId);
  if(table.reservation_id===null){
    return next({
      status: 400,
      message: `the table is not occupied`
    });
  }
  res.locals.table = table;
  next();
}

async function unassignTable(req, res, next){
  const tableId = req.params.table_id;
  const result = await service.unassign(tableId);
  const resId = res.locals.table.reservation_id;
  const reservation = await resService.read(resId);
  await __changeResStatus("finished", resId, reservation)
  res.status(200).json({data: result});
}

async function __changeResStatus(newStatus, id, res){
  return await resService.updateStatus(id, {...res, status: newStatus});
}

module.exports = {
  list: [errorCatcher(list)],
  read: [tableExists, errorCatcher(read)],
  create: [bodyHasData, bodyHasTableName, bodyHasCapacity, errorCatcher(create)],
  update: [tableExists, bodyHasData, bodyHasResId, tableIsOccupided, resExists, tableIsBigEnough, validateTableIsNotSeated, errorCatcher(seatResToTable)],
  unassign: [tableExists, tableIsNotOccupied, errorCatcher(unassignTable)]
}