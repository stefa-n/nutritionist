import Image from "next/image";
import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { jwtDecode } from "jwt-decode";
import { FiArrowUp, FiArrowDown } from "react-icons/fi";

import styles from "@/components/styles/Produs.module.css";

import Tooltip from "./produs/Tooltip";

import { supabase } from "@/pages/index";

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

export default function Produs({ produs, onVote }) {
  const [nutriscore, setNutriscore] = useState("");
  const [novascore, setNovascore] = useState("");
  const [user, setUser] = useState({});
  const [comments, setComments] = useState([]);
  const [dietaryPreferences, setDietaryPreferences] = useState(["None"]);
  const [productDietaryPreferences, setProductDietaryPreferences] = useState(
    []
  );
  const [newComment, setNewComment] = useState("");

  const fetchComments = async () => {
    try {
      const { data, error } = await supabase
        .from("product_comments")
        .select("*")
        .eq("product_id", produs.id)
        .order("created_at", { ascending: false });
      setComments(data);
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

      console.log("Post created successfully:", data);
    } catch (error) {
      console.error("Error creating post:", error.message);
    }
    setNewComment("");
    fetchComments();
  };

  const handleUpvote = async (postId) => {
    try {
      const { data: product, error } = await supabase
        .from("products")
        .select("votes")
        .eq("id", postId)
        .single();

      if (error) {
        throw error;
      }

      const updatedVotes = product.votes + 1;
      const { error: updateError } = await supabase
        .from("products")
        .update({
          votes: updatedVotes,
          health_score:
            (updatedVotes + nutri_dict[nutriscore] + nova_dict[novascore]) / 3,
        })
        .eq("id", produs.id);

      if (updateError) {
        throw updateError;
      }
    } catch (error) {
      console.error("Error upvoting product:", error.message);
    }
    onVote();
  };

  const handleDownvote = async (postId) => {
    try {
      const { data: product, error } = await supabase
        .from("products")
        .select("votes")
        .eq("id", postId)
        .single();

      if (error) {
        throw error;
      }

      const updatedVotes = product.votes - 1;
      const { error: updateError } = await supabase
        .from("products")
        .update({
          votes: updatedVotes,
          health_score:
            (updatedVotes + nutri_dict[nutriscore] + nova_dict[novascore]) / 3,
        })
        .eq("id", produs.id);

      if (updateError) {
        throw updateError;
      }
    } catch (error) {
      console.error("Error upvoting product:", error.message);
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
          else setProductDietaryPreferences(["None"]);

          console.log(string.slice(2).split(", "));
        }
      });
    const token = localStorage.getItem("access_token");
    if (token) {
      const decodedToken = jwtDecode(token);
      setUser(decodedToken);
    }
    fetchComments();
  }, []);

  const ingredients = produs.ingredients.split(", ");
  var allergens = [];

  if (produs.allergens != null) allergens = produs.allergens.split(", ");
  else allergens[0] = "Nu conține alergeni";

  const [storedAllergens, setStoredAllergens] = useState([]);

  useEffect(() => {
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
          <div className={styles.voteContainer}>
            <button
              onClick={() => handleUpvote(produs.id)}
              className={styles.voteButton}
            >
              <FiArrowUp size={42} />
            </button>
            <span className={styles.voteCount}>{produs.votes}</span>
            <button
              onClick={() => handleDownvote(produs.id)}
              className={styles.voteButton}
            >
              <FiArrowDown size={42} />
            </button>
          </div>
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
                color="#C3E8A6"
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
            {allergens.map((allergen) => (
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
            ))}
          </div>
          <p className={styles.infoTitle}>
            Dietary preferences:{" "}
            <span style={{ fontSize: "12px" }}>
              Dietary preferences set in your profile page are{" "}
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
            {productDietaryPreferences.map((preference) => (
              <span
                key={preference}
                className={`${styles.allergen} 
                  ${
                    dietaryPreferences[`${preference}`] === true
                      ? styles.inLocalStorage
                      : ""
                  }
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
