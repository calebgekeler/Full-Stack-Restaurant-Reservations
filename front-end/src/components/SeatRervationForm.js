import React from "react";

export default function SeatReservationForm({setTable, tables, idToPut, setIdToPut}){
  const selectOptions = tables.map((table) =>(
    table.reservation_id === null ? 
    <option key={table.table_id} value={table.table_id}>{table.table_name} - {table.capacity}</option>
    : null
  ))
  const changeHandler = (e) =>{
    setIdToPut(e.target.value);
    setTable(tables.find(table=>table.table_id==e.target.value));
  }
  
  const selectMenu = (
    <select name="table_id"
      className="custom-select custom-select mb-3 col-3" 
      aria-label="Default select example"
      onChange={changeHandler}
      value={idToPut}>
      <option name="table_id" selected>Tables</option>
      {selectOptions}
    </select>
  )
  return(
    <>
      <h3>Select Table</h3>
      {selectMenu}
    </>
  )
}