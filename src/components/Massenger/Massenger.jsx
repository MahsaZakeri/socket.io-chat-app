import React, { useEffect, useState, useRef } from "react";
import queryString from "query-string";
import io from "socket.io-client";
import ReactEmoji from "react-emoji";
import "./Massenger.css";

let socket;

const Massenger = ({ location, history }) => {
  const [userName, setUserName] = useState("");
  const [room, setRoom] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);

  const ENDPOINT = process.env.SOCKETIOENDPOINT || "localhost:5000";

  const messageWrapperRef = useRef();

  useEffect(() => {
    const { userName: name, room: group } = queryString.parse(location.search);
    setUserName(name);
    setRoom(group);

    socket = io(ENDPOINT);

    socket.emit("join", { name, room: group }, ({ errorMessage }) => {
      if (errorMessage && errorMessage.length > 0) {
        return alert(errorMessage);
      }
      return;
    });

    return () => {
      socket.emit("leave");

      socket.off();
    };
  }, [location.search, ENDPOINT]);

  useEffect(() => {
    socket.on("message", (message) => {
      setMessages([...messages, message]);
      const msgWrapperHeight = messageWrapperRef.current;
      msgWrapperHeight.scrollTop = msgWrapperHeight.scrollHeight;
    });

    socket.on("roomData", (data) => {
      const { room: group, users: groupsUsers } = data;
      if (group === room && groupsUsers.length > 0) {
        setUsers(groupsUsers);
      }
    });
  }, [messages, room]);

  const sendMessageHandler = (e) => {
    e.preventDefault();

    if (message.length > 0) {
      socket.emit("sendMessage", message, ({ errorMessage }) =>
        errorMessage && errorMessage.length > 0
          ? alert(errorMessage)
          : setMessage("")
      );
    }
  };

  return (
    <section id="massenger">
      <div className="massenger_header">
        <strong>Messenger</strong>
        <button className="leave_group_btn" onClick={() => history.push("/")}>
        Leave the chat
        </button>
      </div>
      <aside className="massenger_sidebar">
        {room.length > 0 && (
          <span className="chat_group_name">
          Group Name :<strong className="mx-1">{room}</strong>
          </span>
        )}
        <h5>Active users</h5>
        <ul className="users">
          <li>{userName.length > 0 && userName}</li>
          {users.length > 0 &&
            users
              .filter((user) => user.id !== socket.id)
              .map((userItem, i) => <li key={i}>{userItem.name}</li>)}
        </ul>
      </aside>
      <main className="massenger_body" ref={messageWrapperRef}>
        {messages.length > 0 &&
          messages.map((singleMessage, i) => (
            <div
              key={i}
              className="message_wrapper"
              style={{
                background:
                  singleMessage.user === userName
                    ? "#3f7dd8"
                    : singleMessage.user === "Owner :" && " rgb(9, 44, 77)",
                color:
                  singleMessage.user === userName
                    ? "#ffffff"
                    : singleMessage.user === userName
                    ? "#000"
                    : singleMessage.user === "Owner :" && "#ffffff",
                alignSelf:
                  singleMessage.user === userName ||
                  singleMessage.user === "Owner :"
                    ? "flex-start"
                    :"flex-end",
                   
              }}
            >
              <div className="author_info">
                <strong>{singleMessage.user}</strong>
                <span
                  className="message_time"
                  style={{
                    color:
                      (singleMessage.user === userName ||
                        singleMessage.user === "Owner :") &&
                      "#ffffff",
                  }}
                >
                  {new Date(singleMessage.time).toLocaleString("en", {
                    minute: "numeric",
                    hour: "numeric",
                  })}
                </span>
              </div>
              <p className="message_content">
                {ReactEmoji.emojify(singleMessage.message)}
              </p>
            </div>
          ))}
        <form className="message_form_wrapper" onSubmit={sendMessageHandler}>
          <div className="message_input_wrapper">
            <input
              type="text"
              placeholder="Message"
              className="message_input"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) =>
                e.key === "Enter" ? sendMessageHandler : null
              }
            />
          </div>

          <div className="send_message_btn_wrapper">
            <input className="send_message_btn" type="submit" value="Send" />
          </div>
        </form>
      </main>
    </section>
  );
};

export default Massenger;
