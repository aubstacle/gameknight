import React, { useContext, useState } from "react";
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

  const handleJoin = (id) => {
    if (!jwt) {
      history.push("/login");
    } else {
      axios
        .put(`/api/attend/add/${id}`)
        .then((results) => {
          toggleModal();
        })
        .catch((err) => console.log(err));
    }
  };

  const toggleModal = function () {
    setShowModal(!showModal);
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
            eventKey={props.eventkey}
          >
            Learn More!
          </Accordion.Toggle>
        </Card.Header>
        <Accordion.Collapse eventKey={props.eventkey}>
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
              variant="warning"
              onClick={(e) => handleJoin(props.eventkey)}
            >
              Join
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
        title="Success!"
        body="You've been added to the event!"
      />
    
    </div>

      </>
  );
}

export default EventListing;
