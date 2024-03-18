import React, { useState, useEffect } from "react";
import styles from "../styles/AddDietaryPreferences.module.css";

export default function AddDietaryPreferences() {
  const [dietaryPreferences, setDietaryPreferences] = useState({});

  useEffect(() => {
    const storedPreferences = localStorage.getItem("dietaryPreferences");
    if (storedPreferences) {
      setDietaryPreferences(JSON.parse(storedPreferences));
    }
  }, []);

  const togglePreference = (preference) => {
    const updatedPreferences = { ...dietaryPreferences };
    updatedPreferences[preference] = !updatedPreferences[preference];
    setDietaryPreferences(updatedPreferences);

    localStorage.setItem(
      "dietaryPreferences",
      JSON.stringify(updatedPreferences)
    );
  };

  return (
    <div>
      <p>Dietary Preferences</p>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "10px",
          width: "110%",
        }}
      >
        <div
          className={`${styles.ingredient} ${
            dietaryPreferences["Vegan"] ? styles.nuhuh : styles.innit
          }`}
          onClick={() => togglePreference("Vegan")}
        >
          Vegan
        </div>
        <div
          className={`${styles.ingredient} ${
            dietaryPreferences["Vegetarian"] ? styles.nuhuh : styles.innit
          }`}
          onClick={() => togglePreference("Vegetarian")}
        >
          Vegetarian
        </div>
        <div
          className={`${styles.ingredient} ${
            dietaryPreferences["Palm-oil free"] ? styles.nuhuh : styles.innit
          }`}
          onClick={() => togglePreference("Palm-oil free")}
        >
          No Paim Oil
        </div>
      </div>
    </div>
  );
}
