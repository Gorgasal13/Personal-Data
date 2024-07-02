import React, { useEffect, useContext, useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "./UI/SearchBar";
import UserProgressContext from "./store/ModalContext";

function Persons() {
  const navigate = useNavigate();
  const modalCtx = useContext(UserProgressContext);
  const [filteredPersons, setFilteredPersons] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchPersonData = useCallback(async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/?search=${searchTerm}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await response.json();
      modalCtx.setPersonInfo(data);
      setFilteredPersons(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, [modalCtx, searchTerm]);

  useEffect(() => {
    fetchPersonData();
  }, [fetchPersonData]);

  const updateHandler = useCallback(
    (person) => {
      modalCtx.setSelectedPersonId(person.id);
      navigate(`/update/${person.id}`);
    },
    [navigate, modalCtx]
  );

  const viewDetailsHandler = (personId) => {
    modalCtx.setSelectedPersonId(personId);
    navigate(`/details/${personId}`);
  };

  const handleSearch = useCallback(async (searchTerm) => {
    setSearchTerm(searchTerm);
  }, []);

  useEffect(() => {
    const filteredData = modalCtx.personInfo.filter(
      (person) =>
        person.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        person.last_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPersons(filteredData);
  }, [searchTerm, modalCtx.personInfo]);

  return (
    <div className="container-md">
      <SearchBar onSearch={handleSearch} />
      {filteredPersons.length > 0 ? (
        <ul className="list-group list-group-flush">
          {filteredPersons.map((item) => (
            <li key={item.id} className="list-group-item">
              <div className="info-container">
                <img
                  src={`http://127.0.0.1:8000${item.photo}`}
                  className="personal-photo"
                  alt={`Photo of ${item.first_name} ${item.last_name}`}
                />
                <h5>
                  {item.first_name} {item.last_name}
                </h5>

                <div className="btn-con">
                  <button
                    className="btn btn-primary"
                    onClick={() => viewDetailsHandler(item.id)}
                  >
                    View Details
                  </button>

                  <button
                    className="btn btn-danger"
                    onClick={() => modalCtx.showCart(item.id)}
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
