import React, {useState} from 'react';
import {useHistory} from 'react-router-dom';
import {createReservation} from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import {today} from "../utils/date-time";

function NewResForm(){
  const history = useHistory();
  const intitialFormData = {
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: today(),
    reservation_time: "",
    people: 1,
  }

  let [resForm, setResForm] = useState({...intitialFormData});
  let [resErrors, setResErrors] = useState(null);
  
  let tempDate = new Date(`${resForm.reservation_date}`);
  const dateObj = new Date(`${resForm.reservation_date} GMT${tempDate.getTimezoneOffset === 240 ? -4 : -5}`);



  const submitHandler = async (e) =>{
    e.preventDefault();
    const abortController = new AbortController();
    await createReservation(resForm, abortController.signal)
      .catch(setResErrors);
    console.log(resErrors)
    if(resErrors===null){
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
      resForm.reservation_date>=today() &&
      dateObj.getDay()!== 2
    )
  }

  function resOnTuesday(){
    return <p className="alert alert-danger">We are closed Tuesdays. Please pick another day.</p>
  }

  function resInPast(){
    return <p className="alert alert-danger">Cannot pick a date before today.</p>
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
              placeholder = "First name..."
              value={resForm.first_name}
              onChange={changeHandler}
              type="name"
              required
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
              required={true}
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
                required
              />
          </div>
          <br />
          <div className="form-group col-md-6">
            <label htmlFor="reservation_date">Pick a date for the reservation</label>
            {dateObj.getDay()===2 ? resOnTuesday() : null}
            {resForm.reservation_date<today() ? resInPast() : null}
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
      <div className="row pl-3 pr-3 justify-content-around">
        <button type="submit" disabled={!validateBeforeSubmit()} className="btn btn-success" onClick={submitHandler}>Submit</button>
        <button type="cancel" className="btn btn-danger" onClick={cancelHandler}>Cancel</button>
      </div>
      <ErrorAlert error={resErrors} />
    </section>
  )
}

export default NewResForm;