import React, { useState, useEffect } from 'react';
import styles from '../styles/AddAlergens.module.css';

const AddAlergens = () => {
    const [allergens, setAllergens] = useState([]);
    const [inputValue, setInputValue] = useState('');

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
        const newAllergen = e.target.value.trim();
        if (newAllergen.endsWith(',') && newAllergen.length > 1) {
            addAllergen(newAllergen.slice(0, -1));
        }
    };

    const addAllergen = (newAllergen) => {
        if (!allergens.includes(newAllergen)) {
            setAllergens([...allergens, newAllergen]);
            saveAllergensToLocalStorage([...allergens, newAllergen]);
        }
        setInputValue('');
    };

    const handleRemoveAllergen = (allergen) => {
        const updatedAllergens = allergens.filter((a) => a !== allergen);
        setAllergens(updatedAllergens);
        saveAllergensToLocalStorage(updatedAllergens);
    };

    const saveAllergensToLocalStorage = (allergens) => {
        localStorage.setItem('allergens', JSON.stringify(allergens));
    };

    const getAllergensFromLocalStorage = () => {
        const storedAllergens = localStorage.getItem('allergens');
        if (storedAllergens) {
            setAllergens(JSON.parse(storedAllergens));
        }
    };

    useEffect(() => {
        getAllergensFromLocalStorage();
    }, []);

    return (
        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', maxWidth: '700px'}}>
            <p style={{float: 'left', width: '100%', marginRight: '2rem'}}>Allergens <span style={{fontSize: '0.75rem', color: 'gray'}}>Click on an allergen to remove it</span></p>
            <input
                type="text"
                className={styles.input}
                value={inputValue}
                onChange={handleInputChange}
                placeholder="Type allergens separated by comma..."
            />
            <ul style={{display: 'flex', flexWrap: 'wrap', minWidth: '100%', maxWidth: '100%', flexDirection: 'row'}}>
                {allergens.map((allergen) => (
                    <span key={allergen} className={styles.ingredient} onClick={() => { handleRemoveAllergen(allergen); }}>{allergen}</span>
                ))}
            </ul>
        </div>
    );
};

export default AddAlergens;
