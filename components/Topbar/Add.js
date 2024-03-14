import styles from "@/styles/Add.module.css";
import { useState } from "react";

export default function Add({ show }) {
    const [brand, setBrand] = useState("");
    const [name, setName] = useState("");
    const [calories, setCalories] = useState("");
    const [ingredients, setIngredients] = useState("");
    const [allergens, setAllergens] = useState("");

    const handleBrandChange = (event) => {
        setBrand(event.target.value);
    };

    const handleNameChange = (event) => {
        setName(event.target.value);
    };

    const handleCaloriesChange = (event) => {
        setCalories(event.target.value);
    };

    const handleIngredientsChange = (event) => {
        setIngredients(event.target.value);
    };

    const handleAllergensChange = (event) => {
        setAllergens(event.target.value);
    };

    const handleSubmit = () => {
        const product = {
            brand,
            name,
            calories,
            ingredients,
            allergens,
        };


    };

    return (
        <div className={styles.modal}>
            <div className={styles.modalContent}>
                <h2>Add Product</h2>
                <label className={styles.label} htmlFor="brand">Brand:</label>
                <input className={styles.input} type="text" id="brand" value={brand} onChange={handleBrandChange} />
                <label className={styles.label} htmlFor="name">Name:</label>
                <input className={styles.input} type="text" id="name" value={name} onChange={handleNameChange} />
                <label className={styles.label} htmlFor="calories">Calories:</label>
                <input className={styles.input} type="number" id="calories" value={calories} onChange={handleCaloriesChange} />
                <label className={styles.label} htmlFor="ingredients">Ingredients:</label>
                <textarea className={styles.input} id="ingredients" value={ingredients} onChange={handleIngredientsChange} />
                <label className={styles.label} htmlFor="allergens">Allergens:</label>
                <input className={styles.input} type="text" id="allergens" value={allergens} onChange={handleAllergensChange} />
                <button onClick={handleSubmit}>Submit</button>
            </div>
        </div>
    )
}
