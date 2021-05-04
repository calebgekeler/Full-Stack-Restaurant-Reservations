/**
 * List handler for reservation resources
 */
const service = require("./reservations.service");

async function list(req, res) {
  const date = req.query.date;
  const result = await service.list(date);
  const sortedResult = result.sort((a, b) => a.reservation_time > b.reservation_time ? 1 : -1);
  res.json({
    data: sortedResult,
  });
}

function validateBody(req, res, next){
  const body = req.body.data;
  console.log("BODY IN API CONTROLLER", body)
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

  console.log("TODAY FORMATTED" ,todayAsStr);
  console.log("DATE OF RESERVATION", date);
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

async function create(req, res){
  const reservation = req.body.data;
  const result = await service.create(reservation);
  res.status(201).json({data: result})
}

module.exports = {
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
    create
  ],
  list,
};
