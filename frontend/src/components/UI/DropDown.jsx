import { useState, useEffect, useContext, useCallback } from "react";
import UserProgressContext from "../store/ModalContext";

function Dropdown({ currentPersonId }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const modalCtx = useContext(UserProgressContext);

  const fetchPersonData = useCallback(
    async (searchTerm = "") => {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/api/?search=${searchTerm}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        modalCtx.setPersonInfo(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    },
    [modalCtx]
  );

  useEffect(() => {
    fetchPersonData();
  }, [fetchPersonData]);

  const handleCheckboxChange = (person) => {
    if (modalCtx.selectedPersons.find((p) => p.id === person.id)) {
      modalCtx.setSelectedPersons(
        modalCtx.selectedPersons.filter((p) => p.id !== person.id)
      );
    } else {
      modalCtx.setSelectedPersons([...modalCtx.selectedPersons, person]);
    }
  };

  return (
    <fieldset>
      <button
        className="form-control"
        onClick={() => {
          setShowDropdown((prev) => !prev);
        }}
      >
        -- Select Persons --
      </button>
      {showDropdown && (
        <div className="pannel">
          {modalCtx.personInfo
            .filter((person) => person.id !== currentPersonId)
            .map((item) => (
              <div key={item.id} className="dropdown-con">
                <label htmlFor={`person-${item.id}`}>
                  {item.first_name} {item.last_name}
                </label>
                <input
                  type="checkbox"
                  id={`person-${item.id}`}
                  checked={
                    !!modalCtx.selectedPersons.find((p) => p.id === item.id)
                  }
                  onChange={() => handleCheckboxChange(item)}
                />
              </div>
            ))}
        </div>
      )}
    </fieldset>
  );
}

export default Dropdown;
