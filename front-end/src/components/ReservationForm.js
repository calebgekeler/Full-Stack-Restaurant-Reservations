import React from 'react';

export default function ReservationForm(props){
  const resOnTuesdayMess = <p className="alert alert-danger">We are closed Tuesdays. Please pick another day.</p>;

  const resInPastMess = <p className="alert alert-danger">Cannot pick a reservation date or time before now.</p>;

  const resBefore1030Mess = <p className="alert alert-danger">Cannot make a reservation before 10:30am</p>;

  const resAfter2130Mess = <p className="alert alert-danger">We close at 10:30pm. Cannot make a reservation after 9:30pm.</p>;

  function resBefore1030Logic(){
    if(props.dateObj.getHours()<10){return true};
    if(props.dateObj.getHours()<=10 && props.dateObj.getMinutes()<30){return true};
    return false;
  }

  function resAfter2130Logic(){
    if(props.dateObj.getHours()>21){return true};
    if(props.dateObj.getHours()>=21 && props.dateObj.getMinutes()>30){return true};
    return false;
  }

  function resInThePast(){
    let today = new Date();
    if(props.dateObj.getTime()<today.getTime()){return true}
  }

  return(
    <form onSubmit={props.submitHandler}>
      <div className="form-row">
        <div className="form-group col-md-6">
          <label htmlFor="first_name">First name</label>
          <input 
            className="form-control"
            id="first_name"
            name="first_name"
            placeholder="First name..."
            value={props.resForm.first_name}
            onChange={props.changeHandler}
            type="name"
          />
        </div>
        <br />
        <div className="form-group col-md-6">
          <label htmlFor="last_name">Last name</label>
          <input 
            className="form-control"
            id="last_name"
            name="last_name"
            placeholder="Last name..."
            value={props.resForm.last_name}
            onChange={props.changeHandler}
            type="name"
          />
        </div>
        <br />
        <div className="form-group col-md-6">
          <label htmlFor="mobile_number">Phone number</label>
            <input 
              className="form-control"
              id="mobile_number"
              name="mobile_number"
              placeholder="Mobile number..."
              value={props.resForm.mobile_number}
              onChange={props.changeHandler}
              type="text"
            />
        </div>
        <br />
        <div className="form-group col-md-6">
          <label htmlFor="reservation_time">How many in the party?</label>
            <input 
              className="form-control"
              id="reservation_time"
              name="people"
              value={props.resForm.people}
              onChange={props.changeHandler}
              type="number"
            />
        </div>
        <br />
        <div className="form-group col-md-6">
          <label htmlFor="reservation_date">Pick a date for the reservation</label>
          {props.dateObj.getDay()===2 ? resOnTuesdayMess : null}
          {resInThePast() && props.resForm.reservation_date!=="" ? resInPastMess : null}
          <input 
            className="form-control"
            id="reservation_date"
            name="reservation_date"
            value={props.resForm.reservation_date}
            onChange={props.changeHandler}
            type="date"
          />
        </div>
        <br />
        <div className="form-group col-md-6">
          <label htmlFor="reservation_time">Pick a time for the reservation</label>
          {resBefore1030Logic() ? resBefore1030Mess: null}
          {resAfter2130Logic() ? resAfter2130Mess : null}
          <input 
            className="form-control"
            if="reservation_time"
            name="reservation_time"
            required
            value={props.resForm.reservation_time}
            onChange={props.changeHandler}
            type="time"
          />
        </div>          
      </div>
    </form>
  )
}