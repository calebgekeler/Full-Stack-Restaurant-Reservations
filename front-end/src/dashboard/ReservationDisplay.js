import React from 'react-router-dom';

function ReservationDisplay({reservations}){
  return reservations.map((res) =>
      <article key={res.reservation_id}>
        <h4>Name: {res.last_name}, {res.first_name}</h4>
        <p>Mobile number: {res.mobile_number}</p>
        <p>Time of reservation: {res.reservation_time}</p>
        <p>Number of people: {res.people}</p>
        <hr />
      </article>
  )
}

export default ReservationDisplay;