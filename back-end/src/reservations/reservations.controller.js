/**
 * List handler for reservation resources
 */
const service = require("./reservations.service");

async function list(req, res, next) {
  const date = req.query.date;
  if(!date){
    return next();
  }
  const result = await service.list(date);
  const sortedResult = result.sort((a, b) => a.reservation_time > b.reservation_time ? 1 : -1);
  res.json({data: sortedResult});
}

async function search(req, res){
  const phoneNum = req.query.mobile_number;
  const result = await service.search(phoneNum);
  res.json({data: result})
}

async function reservationExists(req, res, next){
  const {reservation_id} = req.params;
  const reservation = await service.read(reservation_id);
  if(!reservation){
    next({
      status: 404,
      message: `Reservation ${reservation_id} does not exist.`
    })
  }
  res.locals.reservation = reservation;
  next();
}

function read(req, res){
  res.json({data: res.locals.reservation});
}

function validateBody(req, res, next){
  const body = req.body.data;
  if(!body){
    next({
      status: 400,
      message: `body is invalid`
    })
  }
  next();
}

function validateFirstName(req, res, next){
  const firstName = req.body.data.first_name;
  if(!firstName){
    next({
      status: 400,
      message: `first_name is invalid`
    })
  }
  next();
}

function validateLastName(req, res, next){
  const lastName = req.body.data.last_name;
  if(!lastName){
    next({
      status: 400,
      message: `last_name is invalid`,
    })
  }
  next();
}

function validateMobile(req, res, next){
  const num = req.body.data.mobile_number;
  if(!num){
    next({
      status: 400,
      message: `mobile_number is invalid`,
    })
  }
  next();
}

function validateResDate(req, res,  next){
  const date = req.body.data.reservation_date;
  let year;
  if(date){
    let parts = date.split("-");
    year = Number(parts[0]);
  }
  if(!date || isNaN(year) || year<1000){
    next({
      status: 400,
      message: `reservation_date is invalid`
    })
  }
  next();
}

function validateResTime(req, res, next){
  const time = req.body.data.reservation_time;
  let hours;
  if(time){
    hours = Number(time.split(":")[0]);
  }
  if(!time || isNaN(hours)){
    next({
      status: 400,
      message: `reservation_time is invalid`
    })
  }
  next();
}

function validatePeople(req, res, next){
  const people = req.body.data.people;
  if(!people || people<1 || typeof people !== "number"){
    next({
      status: 400,
      message: `number of people is invalid`
    })
  }
  next();
}

function validateDateIsFuture(req, res, next){
  const date = req.body.data.reservation_date;
  let today = new Date();
  let todayAsStr = `${today.getFullYear()}
    -${today.getMonth()+1 < 10 ? `0${today.getMonth()+1}` : today.getMonth()+1}
    -${today.getDate()<10 ? `0${today.getDate()}` : today.getDate()}`;

  if(date < todayAsStr){
    next({
      status: 400,
      message: `reservation needs to be in the future`
    })
  }
  res.locals.date = date;
  next();
}

function validateNotTues(req, res, next){
  const tempDate = new Date(res.locals.date);
  const date = new Date(`${res.locals.date} GMT${tempDate.getTimezoneOffset === 240 ? -4 : -5}`);
  if(date.getDay()===2){
    next({
      status: 400,
      message: 'we are closed Tuesdays'
    })
  }
  next();
}

function validateEligibleTime(req, res, next){
  const time = req.body.data.reservation_time;
  let [hours, minutes, seconds] = time.split(":");
  if(Number(hours)<10 || Number(hours)<=10 && Number(minutes)<30){
    next({
      status: 400,
      message: `We open at 10:30am.`
    })
  }
  if(Number(hours)>21 || Number(hours)>=21 && Number(minutes)>30){
    next({
      status: 400,
      message: `We close at 10:30pm. Cannot make a reservation before 9:30pm.`
    })
  }
  next();
}

function validateOnlyBooked(req, res, next){
  const status = req.body.data.status;
  if(status!=="booked"){
    next({
      status: 400,
      message: `Creating a reservation must have the "booked" status, not the "${status}" status.`
    })
  }
  next();
}

async function create(req, res){
  const reservation = req.body.data;
  const result = await service.create(reservation);
  res.status(201).json({data: result})
}

function validateAcceptableStatus(req, res, next){
  const acceptableStatuses = ["booked", "seated", "finished", "cancelled"];
  const status = req.body.data.status;
  if(!acceptableStatuses.includes(status)){
    next({
      status: 400,
      message: `Status, ${status}, is not acceptable`
    })
  }
  next();
}

function validateCurrentStatusIsNotFinished(req, res, next){
  if(res.locals.reservation.status==="finished"){
    next({
      status: 400,
      message: `Current status is already finished. Cannot update`
    })
  }
  next();
}

async function updateStatus(req, res, next){
  const status = req.body.data.status;
  const updatedRes = {...res.locals.reservation, status};
  const data = await service.updateStatus(res.locals.reservation.reservation_id, updatedRes);
  res.status(200).json({data});
}

async function updateReservation(req, res, next){
  const reservation = req.body.data;
  const resBackFromService = await service.updateReservation(reservation);
  res.json({data: resBackFromService});
}

module.exports = {
  list: [list, search],
  read: [reservationExists, read],
  create: [
    validateBody, 
    validateFirstName, 
    validateLastName, 
    validateMobile, 
    validateResDate,
    validateResTime,
    validatePeople,
    validateDateIsFuture,
    validateNotTues,
    validateEligibleTime,
    validateOnlyBooked,
    create
  ],
  updateStatus: [
    reservationExists, 
    validateAcceptableStatus, 
    validateCurrentStatusIsNotFinished,
    updateStatus
  ],
  edit: [
    reservationExists,
    validateBody, 
    validateFirstName, 
    validateLastName, 
    validateMobile, 
    validateResDate,
    validateResTime,
    validatePeople,
    updateReservation,
  ]
};
