import React, {useState} from 'react';

export default function Login(){
  let [userName] = useState("");
  //let [password, setPassword] = useState("");
  const loginForm = (
    <form>
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input 
            className="form-control"
            name="username"
            value={userName}
            type="username"
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          
        </div>
      </div>
    </form>
  )
  return(
    <section>
      {loginForm}
    </section>
  )
}