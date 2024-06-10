import { useRef, useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Form from "./UI/Form";

function AddPerson() {
  const { id } = useParams();
  const navigate = useNavigate();
  const firstNameRef = useRef();
  const lastNameRef = useRef();
  const phoneRef = useRef();
  const genderRef = useRef();
  const connectionRef = useRef();
  const personsRef = useRef();
  const personIdRef = useRef();
  const birthDateRef = useRef();
  const cityRef = useRef();

  const [personInfo, setPersonInfo] = useState([]);

  const [firstNameError, setFirstNameError] = useState(false);
  const [lastNameError, setLastNameError] = useState(false);
  const [phoneError, setPhoneError] = useState(false);
  const [personalNumberError, setPersonalNumberError] = useState(false);
  const [personalNumberLengthError, setPersonalNumberLengthError] =
    useState(false);
  const [birthDateError, setBirthDateError] = useState("");
  const [person, setPerson] = useState(null);
  const [photo, setPhoto] = useState(null);

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

  const fetchPerson = useCallback(async () => {
    if (id) {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch person");
        }
        const data = await response.json();
        setPerson(data);
      } catch (error) {
        console.error("Error fetching person:", error);
      }
    }
  }, [id]);

  useEffect(() => {
    fetchPerson();
  }, [fetchPerson]);

  useEffect(() => {
    if (person) {
      firstNameRef.current.value = person.first_name;
      lastNameRef.current.value = person.last_name;
      phoneRef.current.value = person.phone;
      personIdRef.current.value = person.personal_number;
      cityRef.current.value = person.city;
      genderRef.current.value = person.gender;
      birthDateRef.current.value = person.personal_birthdate;
      connectionRef.current.value = person.connection;
      //personsRef.current.value = person.persons;
      if (person.persons) {
        personsRef.current.value = person.persons.value;
      }
    }
  }, [person]);

  const resetForm = useCallback(() => {
    firstNameRef.current.value = "";
    lastNameRef.current.value = "";
    phoneRef.current.value = "";
    genderRef.current.value = "O";
    personIdRef.current.value = "";
    birthDateRef.current.value = "";
    cityRef.current.value = "";
    connectionRef.current.value = "Other";
    personsRef.current.value = "";
    setPhoto(null);
    setFirstNameError(false);
    setLastNameError(false);
    setPersonalNumberError(false);
    setPhoneError(false);
    setPersonalNumberLengthError(false);
    setBirthDateError("");
  }, []);

  const createPerson = useCallback(
    async (personInfo) => {
      try {
        const formData = new FormData();
        for (const key in personInfo) {
          formData.append(key, personInfo[key]);
        }
        if (photo) {
          formData.append("photo", photo);
        }

        const response = await fetch("http://127.0.0.1:8000/api/create/", {
          method: "POST",
          body: formData,
        });
        if (!response.ok) {
          const errorData = await response.json();
          if (errorData.personal_number) {
            setPersonalNumberError(true);
          } else if (errorData.personal_birthdate) {
            setBirthDateError(errorData.personal_birthdate);
          } else {
            throw new Error("Failed to create person");
          }
        } else {
          alert("Successfully created person");
          resetForm();
          navigate("/api");
        }
      } catch (error) {
        console.error("Error creating person:", error);
      }
    },
    [photo, navigate, resetForm]
  );

  const updatePerson = useCallback(
    async (personInfo, personId) => {
      try {
        const formData = new FormData();
        for (const key in personInfo) {
          formData.append(key, personInfo[key]);
        }
        if (photo) {
          formData.append("photo", photo);
        }

        const response = await fetch(
          `http://127.0.0.1:8000/api/update/${personId}/`,
          {
            method: "PUT",
            body: formData,
          }
        );
        if (!response.ok) {
          const errorData = await response.json();
          if (errorData.personal_birthdate) {
            setBirthDateError(errorData.personal_birthdate);
          } else {
            throw new Error("Failed to update person");
          }
        } else {
          alert("Successfully updated person");
          resetForm();
          navigate("/api");
        }
      } catch (error) {
        console.error("Error updating person:", error);
      }
    },
    [photo, navigate, resetForm]
  );

  const submitHandler = useCallback(
    (e) => {
      e.preventDefault();
      const personInfo = {
        first_name: firstNameRef.current.value,
        last_name: lastNameRef.current.value,
        phone: phoneRef.current.value,
        gender: genderRef.current.value,
        personal_number: personIdRef.current.value,
        city: cityRef.current.value,
        personal_birthdate: birthDateRef.current.value,
        connection: connectionRef.current.value,
        persons: personsRef.current.value,
      };

      if (personInfo.phone.length < 10 || personInfo.phone.length > 15) {
        setPhoneError(true);
        return;
      } else {
        setPhoneError(false);
      }

      if (person) {
        updatePerson(personInfo, person.id);
      } else {
        createPerson(personInfo);
      }
    },
    [person, updatePerson, createPerson]
  );

  const handleFileChange = useCallback((e) => {
    setPhoto(e.target.files[0]);
  }, []);

  const validateName = useCallback((name) => {
    const georgianRegex = /^[\u10D0-\u10FF\s]*$/;
    const englishRegex = /^[a-zA-Z\s]*$/;
    const containsGeorgian = georgianRegex.test(name);
    const containsEnglish = englishRegex.test(name);
    return containsGeorgian !== containsEnglish;
  }, []);

  const firstNameChangeHandler = useCallback(() => {
    setFirstNameError(!validateName(firstNameRef.current.value));
  }, [validateName]);

  const lastNameChangeHandler = useCallback(() => {
    setLastNameError(!validateName(lastNameRef.current.value));
  }, [validateName]);

  return (
    <div className="con">
      <form onSubmit={submitHandler} className="form">
        <Form
          label="First Name"
          htmlFor="firstname"
          className={`form-control ${firstNameError ? "is-invalid" : ""}`}
          required
          type="text"
          name="firstname"
          ref={firstNameRef}
          onChange={firstNameChangeHandler}
        >
          {firstNameError && (
            <div className="invalid-feedback">
              Name must contain either Georgian or English alphabet, but not
              both.
            </div>
          )}
        </Form>

        <Form
          label="Last Name"
          htmlFor="lastname"
          className={`form-control ${lastNameError ? "is-invalid" : ""}`}
          required
          type="text"
          name="lastname"
          ref={lastNameRef}
          onChange={lastNameChangeHandler}
        >
          {lastNameError && (
            <div className="invalid-feedback">
              Name must contain either Georgian or English alphabet, but not
              both.
            </div>
          )}
        </Form>

        <Form
          label="Personal Number"
          htmlFor="personal_number"
          className={`form-control ${
            personalNumberError || personalNumberLengthError ? "is-invalid" : ""
          }`}
          required
          type="text"
          name="personal_number"
          ref={personIdRef}
        >
          {personalNumberError && (
            <div className="invalid-feedback">
              Personal number already exists.
            </div>
          )}
          {personalNumberLengthError && (
            <div className="invalid-feedback">
              Personal number must be exactly 11 characters long.
            </div>
          )}
        </Form>

        <Form
          className={`form-control ${phoneError ? "is-invalid" : ""}`}
          label="Phone"
          htmlFor="Phone"
          required
          name="phone"
          type="number"
          ref={phoneRef}
        >
          {phoneError && (
            <div className="invalid-feedback">
              Phone number must be between 10 and 15 digits.
            </div>
          )}
        </Form>

        <Form
          label="City"
          htmlFor="City"
          className="form-control"
          required
          name="city"
          type="text"
          ref={cityRef}
        ></Form>

        <Form
          label="Birth Date"
          htmlFor="birthdate"
          className={`form-control ${birthDateError ? "is-invalid" : ""}`}
          required
          type="date"
          name="birthdate"
          ref={birthDateRef}
        >
          {birthDateError && (
            <div className="invalid-feedback">{birthDateError}</div>
          )}
        </Form>

        <Form
          htmlFor="photo"
          label="Photo"
          className="form-control"
          type="file"
          name="personal-photo"
          onChange={handleFileChange}
        ></Form>

        <div className="mb-3">
          <label htmlFor="gender" className="form-label">
            Gender
          </label>
          <select
            className="form-control"
            required
            name="gender"
            ref={genderRef}
          >
            <option value="O">Other</option>
            <option value="M">Male</option>
            <option value="F">Female</option>
          </select>
        </div>

        <div className="mb-3">
          <label htmlFor="connection" className="form-label">
            Connection Type
          </label>
          <select
            className="form-control"
            required
            name="connection"
            ref={connectionRef}
          >
            <option value="Other">Other</option>
            <option value="Relative">Relative</option>
            <option value="Colleague">Colleague</option>
            <option value="Familiar">Familiar</option>
          </select>
        </div>

        <div className="mb-3">
          <label htmlFor="connectionwith" className="form-label">
            Connection With
          </label>
          <select
            className="form-control"
            required
            name="connectionwith"
            ref={personsRef}
          >
            <option value="None">None</option>
            {personInfo.map((item) => (
              <option key={item.id} value="Persons">
                {item.first_name} {item.last_name}
              </option>
            ))}
          </select>
        </div>

        <div className="d-grid gap-2 d-md-block">
          <button type="submit" className="btn btn-primary">
            {person ? "Update" : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddPerson;
