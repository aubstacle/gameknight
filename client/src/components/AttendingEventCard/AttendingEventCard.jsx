import { useState } from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import axios from "axios";
import moment from "moment";
import ProfileCardModal from "../../components/ProfileCardModal/ProfileCardModal";

const AttendingEventCard = (props) => {
  const [showModal, setShowModal] = useState(false);
  const [user, setUser] = useState({});
  const handleWithdraw = (id) => {
    axios
      .put(`/api/attend/remove/${id}`)
      .then((results) => {
        console.log(results);
        props.getAttendingEvents();
        props.getHostedEvents();
      })
      .catch((err) => console.log(err));
  };
  const toggleModal = function () {
    setShowModal(!showModal);
  };

  return (
    <>
      <Card className="mx-4 bg-secondary knight-font">
        <Card.Header as="h5" className="text-center header">
          <u>{props.eventName}</u>
        </Card.Header>
        <Card.Text>{props.isVirtual}</Card.Text>
        <Card.Body className="text-center text-white">
          <Card.Text>
            <b>Date:</b> {moment(props.date).format("LL")}
          </Card.Text>
          <Card.Text>
            <b>Time:</b> {moment(props.gameTime).format("LT")}
          </Card.Text>
          <Card.Text>
            <b>Event Host:</b>{" "}
            <Button
              variant="link"
              onClick={(e) => {
                setUser(props.hostID);
                toggleModal();
              }}
            >
              {props.hostID.userName}
            </Button>
          </Card.Text>
          <Card.Text>
            <b>Category:</b> {props.gameCategory}
          </Card.Text>
          <Card.Text>
            <b>Game:</b> {props.gameName}
          </Card.Text>
          <Card.Text>
            <b>City:</b> {props.city}
          </Card.Text>
          <Card.Text>
            <b>State:</b> {props.state}
          </Card.Text>
          <Card.Text>
            <b>Users Attending:</b>
            {props.attendees.map((user, index) => (
              <Button
                key={index}
                variant="link"
                onClick={(e) => {
                  setUser(user);
                  toggleModal();
                }}
              >
                {user.userName}
              </Button>
            ))}
          </Card.Text>
          <Card.Text>
            <b>Spots Left:</b> {props.maxAttendees - props.attendees.length}
          </Card.Text>
          <Card.Text>
            <b>Description:</b> {props.description}
          </Card.Text>
          <Card.Text>
            <b>Event Link:</b> <a href={props.eventLink}>{props.eventLink}</a>
          </Card.Text>
          <Button variant="warning" onClick={(e) => handleWithdraw(props._id)}>
            Withdraw
          </Button>
        </Card.Body>
      </Card>
      <ProfileCardModal
        user={user}
        showModal={showModal}
        toggleModal={toggleModal}
      />
    </>
  );
};

export default AttendingEventCard;
