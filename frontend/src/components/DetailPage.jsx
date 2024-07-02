import { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { uiActions } from "./store/ui-slice";
import Card from "./UI/Card";
import UserProgressContext from "./store/ModalContext";

function DetailPage() {
  const { id } = useParams();
  const [person, setPerson] = useState(null);
  const [connectionInfo, setConnectionInfo] = useState([]);
  const isCardVisible = useSelector((state) => state.ui.isCardVisible);
  const dispatch = useDispatch();
  const modalCtx = useContext(UserProgressContext);

  const toggleCardHandler = () => {
    dispatch(uiActions.toggle(person.id));
  };

  useEffect(() => {
    const fetchPersonDetails = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch person details");
        }
        const data = await response.json();
        setPerson(data);

        const connections = await Promise.all(
          data.connections.map(async (conn) => {
            const personResponse = await fetch(
              `http://127.0.0.1:8000/api/${conn.connected_person}`
            );
            if (!personResponse.ok) {
              throw new Error("Failed to fetch connected person details");
            }
            const personData = await personResponse.json();
            return {
              ...conn,
              connected_person_data: personData,
            };
          })
        );

        setConnectionInfo(connections);
      } catch (error) {
        console.error("Error fetching person details:", error);
      }
    };

    fetchPersonDetails();
  }, [id]);

  if (!person) {
    return <div>Loading...</div>;
  }

  const addPersonHandler = () => {
    toggleCardHandler();
  };

  const handleSave = (newConnectionData) => {
    setConnectionInfo((prevConnections) => [
      ...prevConnections,
      ...newConnectionData.persons.map((person) => ({
        person: person.id,
        connected_person: person.id,
        connection_type: newConnectionData.connectionType,
        connected_person_data: person,
      })),
    ]);

    window.location.reload();
  };

  const handleDelete = async (connectionId) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/delete_person_connection/${connectionId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to delete connection: ${errorText}`);
      }

      setConnectionInfo((prevConnections) =>
        prevConnections.filter((conn) => conn.id !== connectionId)
      );
    } catch (error) {
      console.error("Error deleting connection:", error);
    }
  };

  const groupedConnections = connectionInfo.reduce((acc, conn) => {
    if (!acc[conn.connection_type]) {
      acc[conn.connection_type] = [];
    }
    acc[conn.connection_type].push(conn.connected_person_data);
    return acc;
  }, {});

  return (
    <div className="detail-container">
      <div className="detail-con">
        <div className="img-div">
          <img
            src={`http://127.0.0.1:8000${person.photo}`}
            className="personal-photo-two"
          />
        </div>
        <div className="title">
          <h3>
            {person.first_name} {person.last_name}
          </h3>
        </div>
        <li className="person-info">
          <h5>Personal Id: </h5>
          <h5>{person.personal_number}</h5>
        </li>
        <li className="person-info">
          <h5>Phone Number: </h5>
          <h5>{person.phone}</h5>
        </li>
        <li className="person-info">
          <h5>Phone Type: </h5>
          <h5>{person.phone_type}</h5>
        </li>

        <li className="person-info">
          <h5>City: </h5>
          <h5>{person.city}</h5>
        </li>
        <li className="person-info">
          <h5>Gender: </h5>
          <h5>{person.gender}</h5>
        </li>
        <li className="person-info">
          <h5>Birth Date: </h5>
          <h5>{person.personal_birthdate}</h5>
        </li>
        <div>
          {Object.keys(groupedConnections).length > 0 && (
            <div className="connection-info">
              <h5>Person is connected as:</h5>
              {Object.entries(groupedConnections).map(
                ([type, persons], index) => (
                  <div key={index}>
                    <h5>{type} with:</h5>
                    <ul>
                      {persons.map((person) => (
                        <li key={person.id}>
                          {person.first_name} {person.last_name}
                          <button
                            className="btn delete-btn"
                            onClick={() =>
                              handleDelete(
                                connectionInfo.find(
                                  (conn) =>
                                    conn.connection_type === type &&
                                    conn.connected_person === person.id
                                ).id
                              )
                            }
                          >
                            X
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )
              )}
            </div>
          )}
        </div>
        <button className="btn btn-secondary mt-3" onClick={addPersonHandler}>
          Add Persons
        </button>
        <Link to="/api" className="btn btn-secondary mt-3">
          Back
        </Link>
      </div>
      {isCardVisible[person.id] && (
        <Card currentPersonId={person.id} onSave={handleSave} />
      )}
    </div>
  );
}

export default DetailPage;
