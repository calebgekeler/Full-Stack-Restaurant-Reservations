import React, {useState} from 'react';
import {useHistory} from 'react-router-dom';
import {createReservation} from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import SubmitCancelBtn from "./SubmitCancelBtn";

function NewResForm(){
  const history = useHistory();
  const intitialFormData = {
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: ``,
    reservation_time: ``,
    people: 1,
  }

  let [resForm, setResForm] = useState({...intitialFormData});
  let [resErrors, setResErrors] = useState(null);
  let error = null;
  
  const dateObj = new Date(`${resForm.reservation_date} ${resForm.reservation_time}`); // broken

  const submitHandler = async (e) =>{
    e.preventDefault();
    const abortController = new AbortController();
    await createReservation(resForm, abortController.signal)
      .catch(err => error = err); // does not handle errors with .catch(setResErrors)
    setResErrors(error);
    if(error===null){
      setResForm({...intitialFormData});
      history.push(`/dashboard?date=${resForm.reservation_date}`);
    } else{
      return () => abortController.abort();
    }
  }

  const cancelHandler = () => {
    history.goBack();
    setResForm({...intitialFormData});
  }

  const changeHandler = (e) =>{
    if(e.target.name==="people"){
      setResForm({
        ...resForm,
        [e.target.name]: e.target.valueAsNumber
      })
    } else{
      setResForm({
        ...resForm,
        [e.target.name]: e.target.value
      });
    }
  };

  function validateBeforeSubmit(){
    return(
      resForm.first_name.length!==0 &&
      resForm.last_name.length!==0 &&
      resForm.mobile_number.length!==0 &&
      resForm.reservation_date.length!==0 &&
      resForm.reservation_time.length!==0 &&
      resForm.people > 0 &&
      !resInThePast() &&
      dateObj.getDay()!== 2 &&
      !resBefore1030Logic() &&
      !resAfter2130Logic()
    )
  }

  // alert messages and logic
  const resOnTuesdayMess = <p className="alert alert-danger">We are closed Tuesdays. Please pick another day.</p>;

  const resInPastMess = <p className="alert alert-danger">Cannot pick a reservation date or time before now.</p>;

  const resBefore1030Mess = <p className="alert alert-danger">Cannot make a reservation before 10:30am</p>;

  const resAfter2130Mess = <p className="alert alert-danger">We close at 10:30pm. Cannot make a reservation after 9:30pm.</p>;

  function resBefore1030Logic(){
    if(dateObj.getUTCHours()<10){return true};
    if(dateObj.getUTCHours()<=10 && dateObj.getUTCMinutes()<30){return true};
    return false;
  }

  function resAfter2130Logic(){
    if(dateObj.getUTCHours()>21){return true};
    if(dateObj.getUTCHours()>=21 && dateObj.getUTCMinutes()>30){return true};
    return false;
  }

  function resInThePast(){
    let today = new Date();
    if(dateObj.getTime()<today.getTime()){return true}
  }


  return(
    <section>
      <h3>New Reservation</h3>
      <p>All fields are required.</p>
      <form onSubmit={submitHandler}>
        <div className="form-row">
          <div className="form-group col-md-6">
            <label htmlFor="first_name">First name</label>
            <input 
              className="form-control"
              id="first_name"
              name="first_name"
              placeholder="First name..."
              value={resForm.first_name}
              onChange={changeHandler}
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
              value={resForm.last_name}
              onChange={changeHandler}
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
                value={resForm.mobile_number}
                onChange={changeHandler}
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
                value={resForm.people}
                onChange={changeHandler}
                type="number"
              />
          </div>
          <br />
          <div className="form-group col-md-6">
            <label htmlFor="reservation_date">Pick a date for the reservation</label>
            {dateObj.getDay()===2 ? resOnTuesdayMess : null}
            {resInThePast() && resForm.reservation_date!=="" ? resInPastMess : null}
            <input 
              className="form-control"
              id="reservation_date"
              name="reservation_date"
              value={resForm.reservation_date}
              onChange={changeHandler}
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
              value={resForm.reservation_time}
              onChange={changeHandler}
              type="time"
            />
          </div>          
        </div>
      </form>
      <SubmitCancelBtn 
        validation={validateBeforeSubmit} 
        submitHandler={submitHandler} 
        cancelHandler={cancelHandler}
      />
      <ErrorAlert error={resErrors} />
    </section>
  )
}

export default NewResForm;