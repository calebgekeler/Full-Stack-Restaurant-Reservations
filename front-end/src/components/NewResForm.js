import React, {useState} from 'react';
import {useHistory} from 'react-router-dom';
import {createReservation} from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import SubmitCancelBtn from "./SubmitCancelBtn";
import ReservationForm from "./ReservationForm";

function NewResForm(){
  const history = useHistory();
  const intitialFormData = {
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: ``,
    reservation_time: ``,
    people: 1,
    status: "booked"
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
      resForm.mobile_number.length===10 &&
      resForm.reservation_date.length!==0 &&
      resForm.reservation_time.length!==0 &&
      resForm.people > 0 &&
      !resInThePast() &&
      dateObj.getDay()!== 2 &&
      !resBefore1030Logic() &&
      !resAfter2130Logic()
    )
  }

  function resBefore1030Logic(){
    if(dateObj.getHours()<10){return true};
    if(dateObj.getHours()<=10 && dateObj.getMinutes()<30){return true};
    return false;
  }

  function resAfter2130Logic(){
    if(dateObj.getHours()>21){return true};
    if(dateObj.getHours()>=21 && dateObj.getMinutes()>30){return true};
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
      <ReservationForm 
        submitHandler={submitHandler}
        changeHandler={changeHandler}
        resForm={resForm}
        dateObj={dateObj}
      />
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