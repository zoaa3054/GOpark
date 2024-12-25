import React, { useState } from "react";
import Modal from "react-modal";

const CustomPrompt = ({ message, onConfirm, onCancel }) => {
  const [inputValue, setInputValue] = useState("");
  const styles = {
    overlay: {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    promptBox: {
      backgroundColor: "white",
      padding: "20px",
      borderRadius: "8px",
      width: "300px",
      textAlign: "center",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
    },
    input: {
      width: "100%",
      padding: "8px",
      margin: "10px 0",
      borderRadius: "4px",
      border: "1px solid #ccc",
    },
    buttons: {
      display: "flex",
      justifyContent: "space-between",
      marginTop: "10px",
    },
    button: {
      padding: "8px 12px",
      borderRadius: "4px",
      border: "none",
      backgroundColor: "#007BFF",
      color: "white",
      cursor: "pointer",
    },
  };
  return (
    <Modal style={styles.overlay}>
      <div style={styles.promptBox}>
        <p>{message}</p>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          style={styles.input}
        />
        <div style={styles.buttons}>
          <button onClick={() => onConfirm(inputValue)} style={styles.button}>
            OK
          </button>
          <button onClick={onCancel} style={styles.button}>
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default CustomPrompt;