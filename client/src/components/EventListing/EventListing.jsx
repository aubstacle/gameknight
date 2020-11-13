import React, { useContext, useEffect, useState } from "react";
import Accordion from "react-bootstrap/Accordion";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import axios from "axios";
import AuthContext from "../../context/AuthContext";
import { useHistory } from "react-router-dom";
import Modal from "../../components/Modal/Modal";
import moment from "moment";
import virtualImg from "../../images/Virtual.png"
import inPersonImg from "../../images/In_Person.png"

function EventListing(props) {
  const { jwt } = useContext(AuthContext);
  const history = useHistory();
  const [showModal, setShowModal] = useState(false);
  const [buttonStatus, setButtonStatus] = useState({
    status: "",
    text: "Join",
  });
  const [modalMessage, setModalMessage] = useState({
    title: "",
    body: "",
  });

  useEffect(() => {
    checkOpenSpaces();
  }, []);

  const handleJoin = (id) => {
    if (!jwt) {
      history.push("/login");
    } else {
      axios
        .get(`/api/events/${id}`)
        .then((results) => {
          console.log(results.data.data);
          if (results.data.data.hostID === results.data.data.userId) {
            setModalMessage({
              title: "Whoops...",
              body: "You're hosting this event, no need to join!",
            })
            toggleModal();
          } else if (
            results.data.data.attendees.includes(results.data.data.userId)
          ) {
            setModalMessage({
              title: "Whoops...",
              body: "You're already attending this event!",
            })
            toggleModal();
          } else {
            axios
              .put(`/api/attend/add/${id}`)
              .then((results) => {
                setModalMessage({
                  title: "Success!",
                  body: "You've been added to the event!",
                })
                toggleModal();
                props.loadEvents();
              })
              .catch((err) => console.log(err));
          }
        })
        .catch((err) => console.log(err));
    }
  };

  const toggleModal = function () {
    setShowModal(!showModal);
    checkOpenSpaces();
  };

  const checkOpenSpaces = function () {
    if (props.maxAttendees - props.attendees.length === 0) {
      setButtonStatus({
        status: "disabled",
        text: "Event Full",
      });
    } else {
      setButtonStatus({
        status: "",
        text: "Join",
      });
    }
  };

  return (
    <>
    <div className="container">
    <Card className="bg-secondary knight-font">
      <div className="row">
        <div className="col-sm-8">
        
        <Card.Header className="text-white">
          <h2 className="eventName header">
            <u>{props.eventName}</u>
          </h2>
          <h4 className="gameName">
            <b>Game:</b> {props.gameName}
          </h4>
          <h6 className="date mb-3">
            {moment(props.date).format("LL")} at{" "}
            {moment(props.gameTime).format("LT")}
          </h6>
          <h6 className="date mb-3">{props.isVirtual}</h6>
          <Accordion.Toggle
            as={Button}
            variant="warning"
            eventKey={props.eventKey}
          >
            Learn More!
          </Accordion.Toggle>
        </Card.Header>
        <Accordion.Collapse eventKey={props.eventKey}>
          <Card.Body className="text-white">
            <p className="category">Category: {props.category}</p>
            <p className="description">Description: {props.description}</p>
            <p className="city">City: {props.city}</p>
            <p className="state">State: {props.state}</p>
            <p className="maxAttendees">Max Attendees: {props.maxAttendees}</p>
            <p className="spotsLeft">
              Spots Left: {props.maxAttendees - props.attendees.length}
            </p>
            <p className="isVirtual">Virtual or inPerson: {props.isVirtual}</p>
            <Button
              disabled={buttonStatus.status}
              variant="warning"
              onClick={(e) => handleJoin(props.eventKey)}
            >
              {buttonStatus.text}
            </Button>
          </Card.Body>
        </Accordion.Collapse>
      

        </div>
        <div className="col-sm-4">
        {(() => {
        switch (props.isVirtual) {
          case "Virtual":   return <img src={virtualImg} style={{height: "200px", float: "right"}} alt="Virtual event"/>;
          case "In Person": return <img style={{height: "200px", float: "right"}} src={inPersonImg} alt="In Person event"/>;
          default:      return <img src={virtualImg} style={{height: "200px", float: "right"}} alt="Virtual event"/>;
        }
      })()}

        </div>
      </div>
      </Card>
      <Modal
        showModal={showModal}
        toggleModal={toggleModal}
        title={modalMessage.title}
        body={modalMessage.body}
      />
    
    </div>

      </>
  );
}

export default EventListing;
