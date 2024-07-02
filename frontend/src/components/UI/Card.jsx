import { useRef, useContext } from "react";
import Dropdown from "./DropDown";
import UserProgressContext from "../store/ModalContext";

function Card({ currentPersonId, onSave }) {
  const connectionTypeRef = useRef();
  const modalCtx = useContext(UserProgressContext);

  const submitHandler = async (e) => {
    e.preventDefault();
    const selectedPersons = modalCtx.selectedPersons.map((person) => person.id);
    const connectionType = connectionTypeRef.current.value;

    const payload = {
      person: currentPersonId,
      connected_persons: selectedPersons,
      connection_type: connectionType,
    };

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/create_person_connection/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to save data");
      }

      const result = await response.json();

      modalCtx.setSelectedPersons([]);

      onSave({
        connectionType,
        persons: result.map((conn) => ({
          id: conn.connected_person,
          first_name: modalCtx.personInfo.find(
            (p) => p.id === conn.connected_person
          ).first_name,
          last_name: modalCtx.personInfo.find(
            (p) => p.id === conn.connected_person
          ).last_name,
        })),
      });
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  return (
    <div className="card-con">
      <form onSubmit={submitHandler}>
        <Dropdown currentPersonId={currentPersonId} />
        <div className="mb-3">
          <label htmlFor="connectiontype" className="form-label">
            Connection Type
          </label>
          <select
            className="form-control"
            required
            name="connectiontype"
            ref={connectionTypeRef}
          >
            <option value="Other">Other</option>
            <option value="Relative">Relative</option>
            <option value="Colleague">Colleague</option>
          </select>
        </div>
        <div className="btn-save">
          <button className="btn btn-secondary">Save</button>
        </div>
      </form>
    </div>
  );
}

export default Card;
