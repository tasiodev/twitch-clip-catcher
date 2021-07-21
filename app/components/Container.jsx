import React, { useState, useEffect } from "react";
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import CreateRoom from "./CreateRoom";
import Room from "./Room";
import Topbar from "./Topbar";

const Container = () => {
  const [channel, setChannel] = useState(null);
  useEffect(() => {
    if (localStorage.getItem("channel")) {
      setChannel(localStorage.getItem("channel"));
    }
  }, [])
  return (
    <div>
      <BrowserRouter>
        <Topbar />
        <Switch>
          <Route path={"/:channel"} component={Room} />
          <Route path={"/"} component={CreateRoom} />
          <Redirect to="/" />
        </Switch>
      </BrowserRouter>
      <div className="contact" onClick={() => window.open("mailto:shidarg@gmail.com")}>
        Contact
      </div>
    </div>)
}

export default Container;