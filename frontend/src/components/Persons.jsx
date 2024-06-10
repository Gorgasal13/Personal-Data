import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "./UI/SearchBar";

function Persons() {
  const [personInfo, setPersonInfo] = useState([]);
  const navigate = useNavigate();

  const fetchPersonData = useCallback(async (searchTerm = "") => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/?search=${searchTerm}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await response.json();
      setPersonInfo(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, []);

  useEffect(() => {
    fetchPersonData();
  }, [fetchPersonData]);

  const deletePerson = useCallback(async (personId) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/${personId}/`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete person information");
      }

      setPersonInfo((prevPersonInfo) =>
        prevPersonInfo.filter((person) => person.id !== personId)
      );
    } catch (error) {
      console.error("Error deleting person:", error);
    }
  }, []);

  const handleSave = useCallback(() => {
    fetchPersonData();
  }, [fetchPersonData]);

  const deleteHandler = useCallback(
    (personId) => {
      deletePerson(personId);
    },
    [deletePerson]
  );

  const updateHandler = useCallback(
    (person) => {
      navigate(`/update/${person.id}`);
    },
    [navigate]
  );

  const searchHandler = useCallback(
    (searchTerm) => {
      fetchPersonData(searchTerm);
    },
    [fetchPersonData]
  );

  return (
    <div className="container-md">
      <SearchBar onSearch={searchHandler} />
      {personInfo.length > 0 ? (
        <ul className="list-group list-group-flush">
          {personInfo.map((item) => (
            <li key={item.id} className="list-group-item">
              <div>
                <h5>
                  {item.first_name} {item.last_name}
                </h5>
                <img
                  src={`http://127.0.0.1:8000${item.photo}`}
                  className="personal-photo"
                />
                <p>Phone: {item.phone}</p>
                <p>Personal Number: {item.personal_number}</p>
                <p>City: {item.city}</p>
                <p>Gender: {item.gender}</p>
                <p>Birth Date: {item.personal_birthdate}</p>
                <p>Connection Type: {item.connection}</p>
                <p>Connected With This Persons: {item.persons}</p>
                <button
                  className="btn btn-danger"
                  onClick={() => deleteHandler(item.id)}
                >
                  Delete
                </button>
                <button
                  className="btn btn-warning"
                  onClick={() => updateHandler(item)}
                >
                  Update
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="empty">
          <h1>There is no Personal information</h1>
        </div>
      )}
    </div>
  );
}

export default Persons;
