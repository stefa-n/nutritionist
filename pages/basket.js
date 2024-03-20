import { useEffect, useState } from "react";
import { supabase } from "@/pages/index.js";
import Card from "@/components/Card";
import Produs from "@/components/Produs";
import Topbar from "@/components/Topbar";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import styles from "@/styles/Basket.module.css";

export default function Basket() {
  const [basket, setBasket] = useState([]);
  const [products, setProducts] = useState([]);
  const [nutritionalInfo, setNutritionalInfo] = useState({});
  const [nutriments, setNutriments] = useState({});
  const [nutrimentsSum, setNutrimentsSum] = useState({
    carbohydrates: 0,
    fat: 0,
    proteins: 0,
    fiber: 0,
    salt: 0,
    sodium: 0,
    sugars: 0,
  });
  const handleNutri = (props) => {
    if (!(props.id in nutriments)) {
      const auxSum = {};
      auxSum.carbohydrates = props.carbohydrates + nutrimentsSum.carbohydrates;
      auxSum.fat = props.fat + nutrimentsSum.carbohydrates;
      auxSum.proteins = props.proteins + nutrimentsSum.carbohydrates;
      auxSum.fiber = props.fiber + nutrimentsSum.carbohydrates;
      auxSum.salt = props.salt + nutrimentsSum.carbohydrates;
      auxSum.sodium = props.sodium + nutrimentsSum.carbohydrates;
      auxSum.sugars = props.sugars + nutrimentsSum.carbohydrates;
      setNutrimentsSum(auxSum);
    }
    nutriments[props.id] = props;
  };
  const fetchBasketFromLocalStorage = async () => {
    const basketString = localStorage.getItem("basket");
    if (basketString) {
      const basketArray = JSON.parse(basketString);
      setBasket(basketArray);
    }
  };

  const fetchProductsByIds = async () => {
    try {
      const { data: produse, error } = await supabase
        .from("products")
        .select("*")
        .in("id", basket);

      if (error) {
        throw error;
      }

      for (let i = 0; i < produse.length; i++) {
        const { data } = supabase.storage
          .from("products")
          .getPublicUrl(`${produse[i].id}.${produse[i].image_format}`);

        produse[i].image = `${data.publicUrl}`;
      }

      setProducts(produse);
      let auxNutritionalInfo = {
        calories: 0,
        protein: 0,
        fat: 0,
        carbohydrates: 0,
        allergens: [],
        healthScore: 0,
      };
      produse.forEach((produs) => {
        auxNutritionalInfo.calories += produs.kcal;
        auxNutritionalInfo.allergens = auxNutritionalInfo.allergens.concat(
          produs.allergens.split(",").map((item) => item.trim())
        );
        auxNutritionalInfo.healthScore += produs.health_score / produse.length;
      });
      if (produse) {
        auxNutritionalInfo.allergens = [
          ...new Set(auxNutritionalInfo.allergens),
        ];
      }
      setNutritionalInfo(auxNutritionalInfo);
    } catch (error) {
      console.error("Error fetching products:", error.message);
    }
  };

  useEffect(() => {
    fetchBasketFromLocalStorage();
  }, []);

  useEffect(() => {
    if (basket.length > 0) {
      fetchProductsByIds();
    }
  }, [basket]);
  return (
    <>
      <Topbar search={false} />
      <div className={styles.container}>
        <div className={styles.column} style={{ flex: "0 0 60%" }}>
          <h1>Your basket</h1>
          <div className={styles.grid}>
            {products &&
              products.map((product) => (
                <div key={product.id}>
                  <Card
                    barcode={product.barcode}
                    key={product.id}
                    brand={product.brand}
                    name={product.product_name}
                    image={product.image}
                    calories={product.kcal}
                    healthScore={product.health_score}
                    id={product.id}
                    remove={true}
                    onRemove={fetchBasketFromLocalStorage}
                    onClick={() => {
                      document.getElementsByClassName(
                        "product." + product.id
                      )[0].style.display = "flex";
                    }}
                  />
                  <div
                    className={"product." + product.id}
                    style={{
                      display: "none",
                      position: "absolute",
                      zIndex: "100",
                      top: "0",
                      left: "0",
                      width: "100%",
                      height: "100%",
                    }}
                  >
                    <Produs
                      produs={product}
                      onVote={fetchProductsByIds}
                      onNutriFetch={handleNutri}
                    />
                  </div>
                </div>
              ))}
          </div>
        </div>
        <div className={styles.column} style={{ flex: "0 0 40%" }}>
          {nutritionalInfo && "allergens" in nutritionalInfo && (
            <div style={styles.nutritionalInfo}>
              <h2>Basket Nutritional Information</h2>
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Nutrition facts</TableCell>
                      <TableCell>As sold for 100 g / 100 ml</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        Fat
                      </TableCell>
                      <TableCell>{nutrimentsSum.fat}g</TableCell>
                    </TableRow>
                    <TableRow
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        Carbohydrates
                      </TableCell>
                      <TableCell>{nutrimentsSum.carbohydrates}g</TableCell>
                    </TableRow>
                    <TableRow
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        Fiber
                      </TableCell>
                      <TableCell>{nutrimentsSum.fiber}g</TableCell>
                    </TableRow>
                    <TableRow
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        Proteins
                      </TableCell>
                      <TableCell>{nutrimentsSum.proteins}g</TableCell>
                    </TableRow>
                    <TableRow
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        Salt
                      </TableCell>
                      <TableCell>{nutrimentsSum.salt}g</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
              <h2>Allergens/Dietary Preferences</h2>
              <ul>
                {nutritionalInfo.allergens.map((allergen, index) => (
                  <li key={index}>{allergen}</li>
                ))}
              </ul>
              <h2>Health Score</h2>
              <p>Score: {nutritionalInfo.healthScore}</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
