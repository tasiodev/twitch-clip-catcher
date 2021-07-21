import React, { useState, useEffect } from "react";
import *  as actions from "../actions/actions";
import { useHistory } from "react-router-dom";
import PageTitle from "./PageTitle";

const CreateRoom = (props) => {

  const [channel, setChannel] = useState(null);
  const history = useHistory();

  const enterHandler = () => {
    if (channel) {
      history.push("/" + channel);
    }
  }
  const keyHandler = (event) => {
    if (event.key === "Enter") {
      enterHandler();
    }
  }
  return (
    <div className="home">
      <div className="homeInputDiv">
        <input className="homeInput" onKeyPress={keyHandler} placeholder="Enter channel name..." type="text" onChange={e => setChannel(e.target.value)} value={channel ? channel : ""} />
      </div>
      <div className="homeButtonDiv">
        <button className="homeButton" onClick={enterHandler}>Enter</button>
      </div>
      <PageTitle title={"Reaclips"}/>
    </div>)
}

export default CreateRoom;