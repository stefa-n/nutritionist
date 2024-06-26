import { useState, useEffect } from "react";
import { useRouter } from "next/router";

import { signOut } from "@/components/Auth/Auth";

import styles from "./styles/Topbar.module.css";

export default function Topbar({ value, profile, onSearch, search = true }) {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [Value, setValue] = useState(value);
  function valueChanged(e) {
    let value = e.target.value;
    setValue(value);
    onSearch(value);
  }

  useEffect(() => {
    if (localStorage.getItem("access_token") !== null) setIsLoggedIn(true);
    if (value == Value) return;
    if (router.pathname === "/" && Value === "") return;
    if (Value === "") {
      // router.push("/");
      // console.log("Pushing to /");
    } else if (router.query.query != Value) {
      // console.log(router.query.query, Value);
      // console.log("Pushing to /routes/search?query=" + Value);
      // router.push("/routes/search?query=" + Value);
    }
  });
  return (
    <div className={styles.topBar}>
      <input
        value={Value}
        onChange={(e) => valueChanged(e)}
        type="text"
        placeholder="Search..."
        className={styles.searchBar}
        id="searchBar"
        style={{
          visibility: search ? "visible" : "hidden",
        }}
      />
      <div className={styles.userActions}>
        <button onClick={() => router.push("/")} className={styles.accountBtn}>
          Home
        </button>
        <button
          onClick={() => router.push("/myNutritionist")}
          className={styles.forumBtn}
        >
          My Nutritionist
        </button>
        <button
          onClick={() => router.push("/basket")}
          className={styles.forumBtn}
        >
          Basket
        </button>
        {isLoggedIn ? (
          <>
            <button
              onClick={() => router.push("/leaderboard")}
              className={styles.forumBtn}
            >
              Leaderboard & Rewards
            </button>
            <button
              onClick={() => router.push("/profile")}
              className={styles.accountBtn}
            >
              Account
            </button>
            <button onClick={signOut} className={styles.signoutBtn}>
              Sign Out
            </button>
          </>
        ) : (
          <button
            onClick={() => router.push("/login")}
            className={styles.loginBtn}
          >
            Log In
          </button>
        )}
      </div>
    </div>
  );
}
