import React, { useState } from "react";
import "./Login.css";

const Login = ({ history }) => {
  const [userName, setUserName] = useState("");
  const [room, setRoom] = useState("0");

  const loginToChatGroupHandler = (e) => {
    e.preventDefault();
    if (userName.length < 3 || room === "0") {
      return alert("Please choose your group and user name!");
    }
    history.push(`/massenger?userName=${userName}&room=${room}`);
  };

  return (
    <section id="login">
      <div className="login_form_wrapper">
        <h1>Messenger</h1>
        <form className="login_form" onSubmit={loginToChatGroupHandler}>
          <input
            type="text"
            placeholder="Username :"
            className="mb-2"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
          <select
            className="my-2"
            value={room}
            onChange={(e) => setRoom(e.target.value)}
          >
            <option value="0" disabled>
            Select a group
            </option>
            <option>University</option>
            <option>Family</option>
            <option>Friends</option>
            <option>Work</option>
          </select>
          <button type="submit">Login</button>
        </form>
      </div>
    </section>
  );
};

export default Login;
