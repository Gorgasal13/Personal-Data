import { createContext, useState } from "react";

const UserProgressContext = createContext({
  progress: "",
  personId: null,
  personInfo: [],
  selectedPersonId: null,
  selectedPersons: [],
  connectionType: "",
  setPersonInfo: () => {},
  showCart: (id) => {},
  hideCart: () => {},
  setSelectedPersonId: (id) => {},
  setSelectedPersons: (persons) => {},
  setConnectionType: (type) => {},
});

export function UserProgressContextProvider({ children }) {
  const [userProgress, setUserProgress] = useState("");
  const [personId, setPersonId] = useState(null);
  const [personInfo, setPersonInfo] = useState([]);
  const [selectedPersonId, setSelectedPersonId] = useState(null);
  const [selectedPersons, setSelectedPersons] = useState([]);
  const [connectionType, setConnectionType] = useState("");

  function showCart(id) {
    setPersonId(id);
    setUserProgress("cart");
  }

  function hideCart() {
    setPersonId(null);
    setUserProgress("");
  }

  const userProgressCtx = {
    progress: userProgress,
    personId,
    personInfo,
    selectedPersonId,
    selectedPersons,
    connectionType,
    setPersonInfo,
    showCart,
    hideCart,
    setSelectedPersonId,
    setSelectedPersons,
    setConnectionType,
  };

  return (
    <UserProgressContext.Provider value={userProgressCtx}>
      {children}
    </UserProgressContext.Provider>
  );
}

export default UserProgressContext;
