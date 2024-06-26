import Image from "next/image";
import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { jwtDecode } from "jwt-decode";
import { FiArrowUp, FiArrowDown } from "react-icons/fi";
import { createClient } from "@supabase/supabase-js";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import styles from "@/components/styles/Produs.module.css";

import Tooltip from "./produs/Tooltip";
import { checkValid } from "./Auth/Auth";

const nutri_dict = {
  A: 4,
  B: 3,
  C: 2,
  D: 1,
  E: 0,
  undefined: 0,
};

const nova_dict = {
  1: 4,
  2: 3,
  3: 2,
  4: 1,
  undefined: 1,
};

let supabase;

export default function Produs({ produs, onVote, onNutriFetch = () => {} }) {
  const [nutriscore, setNutriscore] = useState("");
  const [novascore, setNovascore] = useState("");
  const [user, setUser] = useState({});
  const [comments, setComments] = useState([]);
  const [dietaryPreferences, setDietaryPreferences] = useState(["None"]);
  const [productDietaryPreferences, setProductDietaryPreferences] = useState(
    []
  );
  const [newComment, setNewComment] = useState("");
  const [nutriments, setNutriments] = useState({});
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");
    if (!accessToken || !checkValid(accessToken, false)) {
      supabase = createClient(
        "https://devjuheafwjammjnxthd.supabase.co",
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRldmp1aGVhZndqYW1tam54dGhkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDgyODE4OTIsImV4cCI6MjAyMzg1Nzg5Mn0.nb5Hx-GEORyNSyoBcVfFC3ktfS5x7vCqBtsD3kJR25M"
      );
    } else {
      setLoggedIn(true);
      supabase = createClient(
        "https://devjuheafwjammjnxthd.supabase.co",
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRldmp1aGVhZndqYW1tam54dGhkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDgyODE4OTIsImV4cCI6MjAyMzg1Nzg5Mn0.nb5Hx-GEORyNSyoBcVfFC3ktfS5x7vCqBtsD3kJR25M",
        {
          global: {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        }
      );
    }
    fetchComments();
  }, []);

  const fetchComments = async () => {
    while (!supabase) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
    try {
      const { data, error } = await supabase
        .from("product_comments")
        .select("*")
        .eq("product_id", produs.id)
        .order("created_at", { ascending: false });

      if (error || data === null) {
        setComments([]);
      } else {
        setComments(data);
      }
    } catch (error) {
      console.error("Error fetching post:", error);
    }
  };

  const handleUpload = async () => {
    try {
      const { data, error } = await supabase.from("product_comments").insert([
        {
          text: newComment,
          product_id: produs.id,
          user_id: user.sub,
          username: user.email,
        },
      ]);

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error("Error creating post:", error.message);
    }
    setNewComment("");
    fetchComments();
  };

  const handleVote = async (productId, vote) => {
    try {
      const { data: product, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", productId)
        .single();

      if (error) {
        throw error;
      }

      let { upvotes, downvotes } = product;
      upvotes = upvotes || [];
      downvotes = downvotes || [];

      if (vote === 1) {
        if (!upvotes.includes(user.sub)) {
          upvotes.push(user.sub);
        } else {
          const index = upvotes.indexOf(user.sub);
          if (index > -1) {
            upvotes.splice(index, 1);
          }
        }
        const index = downvotes.indexOf(user.sub);
        if (index > -1) {
          downvotes.splice(index, 1);
        }
      } else if (vote === -1) {
        if (!downvotes.includes(user.sub)) {
          downvotes.push(user.sub);
        } else {
          const index = downvotes.indexOf(user.sub);
          if (index > -1) {
            downvotes.splice(index, 1);
          }
        }
        const index = upvotes.indexOf(user.sub);
        if (index > -1) {
          upvotes.splice(index, 1);
        }
      }

      const { error: updateError } = await supabase
        .from("products")
        .update({
          upvotes,
          downvotes,
          health_score:
            ((upvotes ? upvotes.length : 0) -
            (downvotes ? downvotes.length : 0) +
            nutriscore
              ? nutri_dict[nutriscore]
              : 2 + novascore
              ? nova_dict[novascore]
              : 2) / 3,
        })
        .eq("id", produs.id);

      if (updateError) {
        throw updateError;
      }
    } catch (error) {
      console.error("Error upvoting post:", error.message);
    }
    onVote();
  };
  useEffect(() => {
    fetch(
      `https://world.openfoodfacts.org/api/v0/product/${produs.barcode}.json`
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.product != null) {
          setNutriments({
            carbohydrates: data.product.nutriments.carbohydrates,
            carbohydrates_unit: data.product.nutriments.carbohydrates_unit,
            fat: data.product.nutriments.fat,
            fat_unit: data.product.nutriments.fat_unit,
            proteins: data.product.nutriments.proteins,
            proteins_unit: data.product.nutriments.proteins_unit,
            fiber: data.product.nutriments.fiber,
            fiber_unit: data.product.nutriments.fiber_unit,
            salt: data.product.nutriments.salt,
            salt_unit: data.product.nutriments.salt_unit,
            sodium: data.product.nutriments.sodium,
            sodium_unit: data.product.nutriments.sodium_unit,
            sugars: data.product.nutriments.sugars,
            sugars_unit: data.product.nutriments.sugars_unit,
          });
          onNutriFetch({
            id: produs.id,
            carbohydrates: data.product.nutriments.carbohydrates,
            carbohydrates_unit: data.product.nutriments.carbohydrates_unit,
            fat: data.product.nutriments.fat,
            fat_unit: data.product.nutriments.fat_unit,
            proteins: data.product.nutriments.proteins,
            proteins_unit: data.product.nutriments.proteins_unit,
            fiber: data.product.nutriments.fiber,
            fiber_unit: data.product.nutriments.fiber_unit,
            salt: data.product.nutriments.salt,
            salt_unit: data.product.nutriments.salt_unit,
            sodium: data.product.nutriments.sodium,
            sodium_unit: data.product.nutriments.sodium_unit,
            sugars: data.product.nutriments.sugars,
            sugars_unit: data.product.nutriments.sugars_unit,
          });
          setNutriscore(data.product.nutriscore_tags[0].toUpperCase());
          setNovascore(data.product.nova_group);

          let ingredients = data.product.ingredients_analysis_tags;

          let string = "";
          for (let value of ingredients) {
            if (value.includes("en:")) {
              if (value === "en:vegan") {
                string += ", Vegan";
              }
              if (value === "en:vegetarian") {
                string += ", Vegetarian";
              }
              if (value === "en:palm-oil-free") {
                string += ", Palm-oil free";
              }
            }
          }

          if (string != "")
            setProductDietaryPreferences(string.slice(2).split(", "));
          else setProductDietaryPreferences(["None met"]);
        }
      });
    const token = localStorage.getItem("access_token");
    if (token) {
      const decodedToken = jwtDecode(token);
      setUser(decodedToken);
    }
  }, []);

  const ingredients = produs.ingredients.split(", ");
  var allergens = [];
  try {
    allergens = JSON.parse(produs.allergens);
    if (allergens.length == 0) {
      allergens = "Nu conține alergeni";
    }
  } catch (err) {
    allergens = "Nu conține alergeni";
  }
  console.log(allergens);
  const [storedAllergens, setStoredAllergens] = useState([]);

  useEffect(() => {
    const a = localStorage.getItem("allergens");
    if (a) {
      const parsedPreferences = JSON.parse(a);
      setStoredAllergens(a);
    }

    const storedPreferences = localStorage.getItem("dietaryPreferences");
    if (storedPreferences) {
      const parsedPreferences = JSON.parse(storedPreferences);
      setDietaryPreferences(parsedPreferences);
    }
  }, []);

  const inapoi = () => {
    document.getElementsByClassName("product." + produs.id)[0].style.display =
      "none";
  };

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        inapoi();
      }
    };
    window.addEventListener("keydown", handleEscape);
  }, []);

  if (!novascore) setNovascore("N/A");
  if (!nutriscore) setNutriscore("N/A");

  return (
    <div>
      <div className={styles.card}>
        <div
          key={produs.id}
          className={styles.inapoi}
          onClick={() => {
            inapoi();
          }}
        >
          Inapoi
        </div>
        <div className={styles.wrapper}>
          {loggedIn && (
            <div className={styles.voteContainer}>
              <button
                onClick={() => handleVote(produs.id, 1)}
                className={styles.voteButton}
              >
                <FiArrowUp size={42} />
              </button>
              <span className={styles.voteCount}>
                {(produs.upvotes ? produs.upvotes.length : 0) -
                  (produs.downvotes ? produs.downvotes.length : 0)}
              </span>
              <button
                onClick={() => handleVote(produs.id, -1)}
                className={styles.voteButton}
              >
                <FiArrowDown size={42} />
              </button>
            </div>
          )}
          <div style={{ width: "200px" }}>
            <Image
              src={produs.image}
              width={200}
              height={200}
              className={styles.image}
              alt={produs.product_name}
            />
          </div>
          <div className={styles.titleInfo}>
            <p className={styles.title}>
              {produs.brand} - {produs.product_name}
            </p>
            <div className={styles.tooltipWrapper}>
              <Tooltip
                type="cals"
                text={produs.kcal + "kcal/100g"}
                color="#1fa152"
              />
              <Tooltip
                type="nutri"
                text={"NU: " + nutriscore}
                color="#D0576D"
              />
              <Tooltip type="nova" text={"NO: " + novascore} color="#F0FEFF" />
            </div>
          </div>
        </div>
        <div className={styles.info}>
          <p className={styles.infoTitle}>Weight: {produs.weight}g</p>
        </div>
        <div className={styles.info}>
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
                  <TableCell>
                    {nutriments.fat}
                    {nutriments.fat_unit}
                  </TableCell>
                </TableRow>
                <TableRow
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    Carbohydrates
                  </TableCell>
                  <TableCell>
                    {nutriments.carbohydrates}
                    {nutriments.carbohydrates_unit}
                  </TableCell>
                </TableRow>
                <TableRow
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    Fiber
                  </TableCell>
                  <TableCell>
                    {nutriments.fiber}
                    {nutriments.fiber_unit}
                  </TableCell>
                </TableRow>
                <TableRow
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    Proteins
                  </TableCell>
                  <TableCell>
                    {nutriments.proteins}
                    {nutriments.proteins_unit}
                  </TableCell>
                </TableRow>
                <TableRow
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    Salt
                  </TableCell>
                  <TableCell>
                    {nutriments.salt}
                    {nutriments.salt_unit}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </div>
        <div className={styles.info}>
          <p className={styles.infoTitle}>Ingredients:</p>
          <div className={styles.container}>
            {ingredients.map((ingredient) => (
              <span key={ingredient} className={styles.ingredient}>
                {ingredient}
              </span>
            ))}
          </div>
        </div>
        <div className={styles.info}>
          <p className={styles.infoTitle}>
            Allergens:{" "}
            <span style={{ fontSize: "12px" }}>
              Allergens set in your profile page are{" "}
              <span
                style={{
                  backgroundColor: "#D0576D",
                  paddingLeft: "5px",
                  paddingRight: "5px",
                  borderRadius: "5px",
                }}
              >
                colored in red
              </span>
            </span>{" "}
          </p>
          <div className={styles.container}>
            {Array.isArray(allergens) ? (
              allergens.map((allergen) => (
                <span
                  key={allergen}
                  className={`${styles.allergen} ${
                    storedAllergens.includes(allergen)
                      ? styles.inLocalStorage
                      : ""
                  }`}
                >
                  {allergen}
                </span>
              ))
            ) : (
              <div>No allergens</div>
            )}
          </div>
          <p className={styles.infoTitle}>
            Dietary preferences:{" "}
            <span style={{ fontSize: "12px" }}>
              Dietary preferences set in your profile page are{" "}
              <span
                style={{
                  backgroundColor: "#1fa152",
                  paddingLeft: "5px",
                  paddingRight: "5px",
                  borderRadius: "5px",
                  color: "black",
                }}
              >
                colored in green
              </span>
            </span>{" "}
          </p>
          <div className={styles.container}>
            {productDietaryPreferences.map((preference) => (
              <span
                key={preference}
                className={`${styles.allergen} 
                  ${
                    dietaryPreferences[`${preference}`] === true
                      ? ""
                      : styles.inLocalStorage
                  }
                  ${preference === "None met" ? styles.inLocalStorage : ""}
                `}
              >
                {preference}
              </span>
            ))}
          </div>
          <div>
            <p className={styles.infoTitle}>Comments:</p>
            {user && user.email && (
              <div className={styles.commentBox}>
                <textarea
                  className={styles.commentInput}
                  id="newComment"
                  placeholder="Type your comment here..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  required
                />
                <button className={styles.uploadButton} onClick={handleUpload}>
                  Upload
                </button>
              </div>
            )}
            {comments.map((comment) => (
              <div className={styles.comment} key={comment.id}>
                <div className={styles.commentDetails}>
                  <span className={styles.commentUser}>{comment.username}</span>
                  <span className={styles.commentDate}>
                    {formatDistanceToNow(new Date(comment.created_at), {
                      addSuffix: true,
                    })}
                  </span>
                </div>
                <div className={styles.commentText}>{comment.text}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  const { barcode } = context.query;

  if (!barcode) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  var { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id);

  if (error)
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };

  const produs = data;

  var { data } = supabase.storage
    .from("products")
    .getPublicUrl(`${produs[0].id}.${produs[0].image_format}`);

  produs[0].image = `${data.publicUrl}`;

  return {
    props: {
      produs: produs[0],
    },
  };
}
