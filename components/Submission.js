import React, { useEffect, useState } from "react";
import styles from "./styles/Submission.module.css";
import { jwtDecode } from "jwt-decode";
import { checkValid } from "@/components/Auth/Auth";

const Submission = () => {
  const [modalOpen, setModalOpen] = useState(false);

  const [file, setFile] = useState([]);
  const [barcode, setBarcode] = useState("");
  const [brand, setBrand] = useState("");
  const [product_name, setProduct_name] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [allergens, setAllergens] = useState("");
  const [kcal, setKcal] = useState("");
  const [weight, setWeight] = useState("");
  const [uid, setuid] = useState("");

  const importFromOpenFoodFacts = () => {
    if (barcode === "") {
      return;
    }
    fetch("https://world.openfoodfacts.org/api/v0/product/" + barcode + ".json")
      .then((response) => response.json())
      .then((data) => {
        setBrand(data.product.brands);
        setProduct_name(data.product.product_name);
        setIngredients(data.product.ingredients_text_en);
        setKcal(data.product.nutriments["energy-kcal_100g"]);
        setWeight(parseInt(data.product.quantity_imported, 10));
        let allergens = data.product.allergens_tags.map((allergen) =>
          allergen.replace("en:", "")
        );
        setAllergens(allergens);
        console.log(data);
      });
  };

  const handleButtonClick = () => {
    let user = localStorage.getItem("access_token");
    if (user === null) {
      window.location.href = "/login";
    } else {
      setModalOpen(true);
      setuid(jwtDecode(user).sub);

      checkValid(user);
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
      case "weight":
        setWeight(value);
        break;
      default:
        break;
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const [supabase, setSupabase] = useState();
    setSupabase(createClient(
      "https://devjuheafwjammjnxthd.supabase.co",
      uid
    ));

    let approved = false;

    let { data: productData, error: productError } = await supabase
      .from("products")
      .select()
      .eq("barcode", barcode)
      .eq("ingredients", ingredients)
      .eq("allergens", allergens)
      .eq("kcal", kcal)
      .eq("weight", weight);

    if (productData && productData.length > 0) {
      approved = true;
    }

    let { data, error } = await supabase
      .from("products")
      .insert([
        {
          barcode,
          brand,
          product_name,
          ingredients,
          allergens,
          kcal,
          weight,
          image_format: file.type.replace(/(.*)\//g, ""),
          approved,
          owned_by_uid: uid,
          health_score: 0,
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
          <input
            className={styles.input}
            type="number"
            name="weight"
            placeholder="Quantity (g / ml)"
            value={weight}
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
          <div className={styles.off} onClick={importFromOpenFoodFacts}>
            Import from OpenFoodFacts
          </div>
        </form>
      )}
    </div>
  );
};

export default Submission;
