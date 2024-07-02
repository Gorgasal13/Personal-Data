import { useCallback, useContext } from "react";
import Modal from "./Modal";
import UserProgressContext from "../store/ModalContext";

function Cart() {
  const progressCtx = useContext(UserProgressContext);

  function closeCart() {
    progressCtx.hideCart();
  }

  const deletePerson = useCallback(async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/${progressCtx.personId}/`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete person information");
      }

      progressCtx.setPersonInfo((prevPersonInfo) =>
        prevPersonInfo.filter((person) => person.id !== progressCtx.personId)
      );

      closeCart();
    } catch (error) {
      console.error("Error deleting person:", error);
    }
  }, [progressCtx]);

  return (
    <Modal
      open={progressCtx.progress === "cart"}
      onClose={progressCtx.progress === "cart" ? closeCart : null}
    >
      <h2>Are you sure you want to delete this data?</h2>
      <div className="btn-con-one">
        <button onClick={deletePerson} className="btn btn-warning">
          Yes
        </button>
        <button onClick={closeCart} className="btn btn-info">
          No
        </button>
      </div>
    </Modal>
  );
}

export default Cart;
