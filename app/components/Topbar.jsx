import React from "react";
import { useHistory } from "react-router-dom";

const Topbar = () =>{
    const history = useHistory();
  
  return ( 
    <div className="topbar">
        <div className="logo" onClick={() => history.push("/")}>
          <img src="https://cdn.glitch.com/f3a1bc34-b8f0-450b-8770-02cb92a0e58d%2Freaclips2.png?v=1589119305323" />
        </div>
    </div>
  )
}

export default Topbar;