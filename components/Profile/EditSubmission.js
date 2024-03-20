import { useState } from "react";
import styles from "../styles/Submission.module.css";

const EditSubmission = ({ product, supabase }) => {
  const [barcode, setBarcode] = useState(product.barcode);
  const [brand, setBrand] = useState(product.brand);
  const [product_name, setProduct_name] = useState(product.product_name);
  const [ingredients, setIngredients] = useState(product.ingredients);
  const [allergens, setAllergens] = useState(product.allergens);
  const [kcal, setKcal] = useState(product.kcal);
  const [weight, setWeight] = useState(product.weight);
  const [uid, setuid] = useState("");

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

    let { data, error } = await supabase
      .from("products")
      .update({
        barcode,
        brand,
        product_name,
        ingredients,
        allergens,
        kcal,
        weight,
      })
      .eq("id", product.id)
      .select();

    if (error) {
      console.error(error);
      return;
    }

    window.location.reload(false);
  };

  const handleDelete = async () => {
    let { data, error } = await supabase
      .from("products")
      .delete()
      .eq("id", product.id)
      .select();

    if (error) {
      console.error(error);
      return;
    }

    window.location.reload(false);
  };

  return (
    <div id={"submission." + product.id} style={{ display: "none" }}>
      <form
        className={styles.modal}
        onSubmit={handleSubmit}
        style={{ zIndex: "9999999" }}
      >
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
          placeholder="Weight (g)"
          value={weight}
          onChange={handleInputChange}
          required
        />
        <div>
          <button className={styles.submit} type="submit">
            Submit
          </button>
          <button className={styles.cancel} onClick={() => handleDelete()}>
            Delete
          </button>
          <div
            className={styles.cancel}
            style={{ width: "90%", textAlign: "center" }}
            onClick={() =>
              (document.getElementById(
                "submission." + product.id
              ).style.display = "none")
            }
          >
            Cancel
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditSubmission;
