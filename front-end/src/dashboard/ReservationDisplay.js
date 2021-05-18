import React from 'react-router-dom';

function ReservationDisplay({reservations}){
  

  let result = reservations.map((res) =>
    <div key={res.reservation_id} className="col-lg-6 p-3">
      <div className="card bg-light">
        <div className="card-body">
          <h5 className="card-title">{res.last_name}, {res.first_name}</h5>
          <p className="card-text">Mobile number: {res.mobile_number}</p>
          <p className="card-text">Time of reservation: {res.reservation_time}</p>
          <p className="card-text">Reservation ID: {res.reservation_id}</p>
          <a href={`/reservations/${res.reservation_id}/seat`} className="btn btn-primary">Seat</a>
        </div>
      </div>
    </div>
  );
  
  return(
    <div className="row">
      {result}
    </div>
  )
}

export default ReservationDisplay;