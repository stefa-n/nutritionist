import React, { useEffect, useState } from "react";
import styles from "./styles/Submission.module.css";
import { supabase } from "@/pages/index.js";
import { jwtDecode } from "jwt-decode";

const Submission = () => {
  const [modalOpen, setModalOpen] = useState(false);

  const [file, setFile] = useState([]);
  const [barcode, setBarcode] = useState("");
  const [brand, setBrand] = useState("");
  const [product_name, setProduct_name] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [allergens, setAllergens] = useState("");
  const [kcal, setKcal] = useState("");
  const [email, setEmail] = useState("");

  const handleButtonClick = () => {
    let user = localStorage.getItem("access_token");
    if (user === null) {
      window.location.href = "/login";
    } else {
      setModalOpen(true);
      setEmail(jwtDecode(user).email);
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
      case "barcode":
        setBarcode(value);
        break;
      case "brand":
        setBrand(value);
        break;
      case "product_name":
        setProduct_name(value);
        break;
      case "ingredients":
        setIngredients(value);
        break;
      case "allergens":
        setAllergens(value);
        break;
      case "kcal":
        setKcal(value);
        break;
      default:
        break;
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    let approved = false;

    let { data: productData, error: productError } = await supabase
      .from("products")
      .select()
      .eq("barcode", barcode)
      .eq("ingredients", ingredients)
      .eq("allergens", allergens)
      .eq("kcal", kcal);

    if (productData && productData.length > 0) {
      approved = true;
    }

    let { data, error } = await supabase
      .from("products")
      .insert([
        {
          barcode: barcode,
          brand: brand,
          product_name: product_name,
          ingredients: ingredients,
          allergens: allergens,
          kcal: kcal,
          image_format: file.type.replace(/(.*)\//g, ""),
          approved: approved,
          owned_by_email: email,
        },
      ])
      .select();

    if (error) {
      console.error(error);
      return;
    }

    let { error: imageError } = await supabase.storage
      .from("products")
      .upload(data[0].id + "." + file.type.replace(/(.*)\//g, ""), file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (imageError) {
      console.error(error || productError);
      return;
    }

    handleModalClose();
  };

  return (
    <div>
      {!modalOpen && (
        <button className={styles.openModal} onClick={handleButtonClick}>
          Add Product
        </button>
      )}

      {modalOpen && (
        <form className={styles.modal} onSubmit={handleSubmit}>
          <input
            className={styles.input}
            type="file"
            name="image"
            onChange={handleFileSelected}
            required
          />
          <input
            className={styles.input}
            type="number"
            name="barcode"
            placeholder="Barcode"
            value={barcode}
            onChange={handleInputChange}
            required
          />
          <input
            className={styles.input}
            type="text"
            name="brand"
            placeholder="Brand"
            value={brand}
            onChange={handleInputChange}
            required
          />
          <input
            className={styles.input}
            type="text"
            name="product_name"
            placeholder="Product Name"
            value={product_name}
            onChange={handleInputChange}
            required
          />
          <input
            className={styles.input}
            type="text"
            name="ingredients"
            placeholder="Ingredients, separated by a comma"
            value={ingredients}
            onChange={handleInputChange}
            required
          />
          <input
            className={styles.input}
            type="text"
            name="allergens"
            placeholder="Allergens, separated by a comma"
            value={allergens}
            onChange={handleInputChange}
          />
          <input
            className={styles.input}
            type="number"
            name="kcal"
            placeholder="Calories / 100g"
            value={kcal}
            onChange={handleInputChange}
            required
          />
          <div>
            <button className={styles.submit} type="submit">
              Submit
            </button>
            <button className={styles.cancel} onClick={handleModalClose}>
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default Submission;
