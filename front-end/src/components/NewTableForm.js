import React, {useState} from 'react';
import SubmitCancelBtn from './SubmitCancelBtn';
import {useHistory} from "react-router-dom";
import {createTable} from "../utils/api";

export default function NewTableForm(){

  const intitialFormData = {
    table_name: "",
    capacity: 0
  }

  const history = useHistory();
  
  let [tableForm, setTableForm] = useState({...intitialFormData});

  const submitHandler = async (e) =>{
    e.preventDefault();
    const abortController = new AbortController();
    await createTable(tableForm, abortController.signal);
    // post the new table
    history.push("/dashboard");
  }

  const cancelHandler = () => {
    history.goBack();
    setTableForm({...intitialFormData});
  }

  const changeHandler = (e) =>{
    if(e.target.name==="capacity"){
      setTableForm({
        ...tableForm,
        [e.target.name]: e.target.valueAsNumber
      })
    } else{
      setTableForm({
        ...tableForm,
        [e.target.name]: e.target.value
      });
    }
  };

  function validateBeforeSubmit(){
    return(
      tableForm.table_name.length>=2 &&
      tableForm.capacity>=1
    )
  }

  return (
    <section>
      <h3>New Table</h3>
      <p>All fields are required.</p>
      <form onSubmit={submitHandler}>
        <div className="form-row">
          <div className="form-group col-md-6">
            <label htmlFor="table_name">Table name</label>
            <input 
              className="form-control"
              id="table_name"
              name="table_name"
              placeholder="Name for table..."
              value={tableForm.table_name}
              onChange={changeHandler}
              type="name"
            />
          </div>
          <div className="form-group col-md-6">
            <label htmlFor="capacity">Table capacity</label>
            <input 
              className="form-control"
              id="capacity"
              name="capacity"
              placeholder="Capacity for table..."
              value={tableForm.capacity}
              onChange={changeHandler}
              type="number"
            />
          </div>
        </div>
      </form>
      <SubmitCancelBtn 
        validation={validateBeforeSubmit}
        submitHandler={submitHandler}
        cancelHandler={cancelHandler}
      />
    </section>
  );
}