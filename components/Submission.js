import React, { useEffect, useState } from 'react';
import styles from './styles/Submission.module.css';
import { supabase } from '@/pages/index.js';

const Submission = () => {
    const [modalOpen, setModalOpen] = useState(false);

    const [file, setFile] = useState([]);
    const [barcode, setBarcode] = useState('');
    const [brand, setBrand] = useState('');
    const [product_name, setProduct_name] = useState('');
    const [ingredients, setIngredients] = useState('');
    const [allergens, setAllergens] = useState('');
    const [kcal, setKcal] = useState('');

    const handleButtonClick = () => {
            let user = localStorage.getItem('access_token');
            if (user === null) {
                window.location.href = '/login';
            } else {
                setModalOpen(true);
            }
    };

    const handleModalClose = () => {
        setModalOpen(false);
    };

    const handleFileSelected = (event) => {
        setFile(event.target.files[0]);
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        switch (name) {
            case 'barcode':
                setBarcode(value);
                break;
            case 'brand':
                setBrand(value);
                break;
            case 'product_name':
                setProduct_name(value);
                break;
            case 'ingredients':
                setIngredients(value);
                break;
            case 'allergens':
                setAllergens(value);
                break;
            case 'kcal':
                setKcal(value);
                break;
            default:
                break;
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const { data, error } = await supabase
            .storage
            .from('products')
            .upload(barcode + "." + file.type.replace(/(.*)\//g, ''), file, {
                cacheControl: '3600',
                upsert: false,
            });

        const { data: productData, error: productError } = await supabase
            .from('products')
            .insert([
                {
                    barcode: barcode,
                    brand: brand,
                    product_name: product_name,
                    ingredients: ingredients,
                    allergens: allergens,
                    kcal: kcal,
                    image_format: file.type.replace(/(.*)\//g, '')
                },
            ]);

        if (error || productError) {
            console.error(error || productError);
            return;
        }

        handleModalClose();
    }

    return (
        <div>
            {!modalOpen && (
                <button
                    className={styles.openModal}
                    onClick={handleButtonClick}
                    >
                    Add Product
                </button>
            )}
            
            {modalOpen && (
                <form className={styles.modal} onSubmit={handleSubmit}>
                    <input className={styles.input} type="file" name="image" onChange={handleFileSelected} required/>
                    <input className={styles.input} type="text" name="barcode" placeholder="Barcode" value={barcode} onChange={handleInputChange} required/>
                    <input className={styles.input} type="text" name="brand" placeholder="Brand" value={brand} onChange={handleInputChange} required/>
                    <input className={styles.input} type="text" name="product_name" placeholder="Product Name" value={product_name} onChange={handleInputChange} required/>
                    <input className={styles.input} type="text" name="ingredients" placeholder="Ingredients" value={ingredients} onChange={handleInputChange} required/>
                    <input className={styles.input} type="text" name="allergens" placeholder="Allergens" value={allergens} onChange={handleInputChange} required/>
                    <input className={styles.input} type="text" name="kcal" placeholder="Calories" value={kcal} onChange={handleInputChange} required/>
                    <div>
                        <button className={styles.submit} type="submit">Submit</button>
                        <button className={styles.cancel} onClick={handleModalClose}>Cancel</button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default Submission;
