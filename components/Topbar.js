import { useState, useEffect } from "react";
import { useRouter } from "next/router";

import { signOut } from "@/components/Auth/Auth";

import styles from "./styles/Topbar.module.css";

export default function Topbar({ value, profile, onSearch }) {
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
      />
      <div>
        <button
          onClick={() => router.push("/myNutritionist")}
          className={styles.forumBtn}
        >
          My Nutritionist
        </button>
      </div>
      <div className={styles.userActions}>
        {isLoggedIn ? (
          <>
            {profile ? (
              <button
                onClick={() => router.push("/")}
                className={styles.accountBtn}
              >
                Home
              </button>
            ) : (
              <button
                onClick={() => router.push("/profile")}
                className={styles.accountBtn}
              >
                Account
              </button>
            )}
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
