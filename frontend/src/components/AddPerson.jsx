import { useRef, useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Form from "./UI/Form";

function AddPerson() {
  const { id } = useParams();
  const navigate = useNavigate();
  const firstNameRef = useRef();
  const lastNameRef = useRef();
  const phoneTypeRef = useRef();
  const phoneRef = useRef();
  const genderRef = useRef();
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
      phoneTypeRef.current.value = person.phone_type;
      phoneRef.current.value = person.phone;
      personIdRef.current.value = person.personal_number;
      cityRef.current.value = person.city;
      genderRef.current.value = person.gender;
      birthDateRef.current.value = person.personal_birthdate;
    }
  }, [person]);

  const resetForm = useCallback(() => {
    firstNameRef.current.value = "";
    lastNameRef.current.value = "";
    phoneTypeRef.current.value = "";
    phoneRef.current.value = "";
    genderRef.current.value = "Other";
    personIdRef.current.value = "";
    birthDateRef.current.value = "";
    cityRef.current.value = "Other";
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
        phone_type: phoneTypeRef.current.value,
        phone: phoneRef.current.value,
        gender: genderRef.current.value,
        personal_number: personIdRef.current.value,
        city: cityRef.current.value,
        personal_birthdate: birthDateRef.current.value,
      };

      if (personInfo.phone.length < 10 || personInfo.phone.length > 15) {
        setPhoneError(true);
        return;
      } else {
        setPhoneError(false);
      }

      if (personInfo.personal_number.length !== 11) {
        setPersonalNumberLengthError(true);
        return;
      } else {
        setPersonalNumberLengthError(false);
      }

      const birthDate = new Date(personInfo.personal_birthdate);
      const age = new Date().getFullYear() - birthDate.getFullYear();
      if (age < 18) {
        setBirthDateError("You are very young");
        return;
      } else {
        setBirthDateError("");
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

  const handlePhoneTypeChange = useCallback(() => {
    const selectedPhoneType = phoneTypeRef.current.value;
    const disablePhone = selectedPhoneType === "";

    phoneRef.current.disabled = disablePhone;
  }, []);

  useEffect(() => {
    handlePhoneTypeChange();
  }, [handlePhoneTypeChange]);

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

        <div className="mb-3">
          <label htmlFor="phone_type" className="form-label">
            Phone Type:
          </label>
          <select
            ref={phoneTypeRef}
            name="phone_type"
            required
            className="form-control"
            onChange={handlePhoneTypeChange}
          >
            <option value="">Select Phone Type</option>
            <option value="Mobile_Phone">Mobile Phone</option>
            <option value="Home_Phone">Home Phone</option>
            <option value="Office_Phone">Office Phone</option>
          </select>
        </div>

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
              Phone number must be between 10 and 15 characters.
            </div>
          )}
        </Form>

        <div className="mb-3">
          <label htmlFor="gender" className="form-label">
            Gender:
          </label>
          <select
            ref={genderRef}
            className="form-control"
            id="gender"
            required
            name="gender"
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <Form
          label="Date of Birth"
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

        <div className="mb-3">
          <label htmlFor="city" className="form-label">
            City:
          </label>
          <select
            ref={cityRef}
            className="form-control"
            id="city"
            required
            name="city"
          >
            <option value="Other">Other</option>
            <option value="Gori">Gori</option>
            <option value="Tbilisi">Tbilisi</option>
            <option value="Batumi">Batumi</option>
            <option value="Zugdidi">Zugdidi</option>
            <option value="Telavi">Telavi</option>
            <option value="Poti">Poti</option>
            <option value="Kobuleti">Kobuleti</option>
          </select>
        </div>

        <Form
          label="Photo"
          htmlFor="photo"
          className="form-control"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
        />

        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            {person ? "Update Person" : "Create Person"}
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={resetForm}
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddPerson;
