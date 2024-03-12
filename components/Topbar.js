import { useState, useEffect } from "react";
import { useRouter } from "next/router";

import styles from "./styles/Topbar.module.css";

export default function Topbar({ value }) {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [Value, setValue] = useState(value);
  const [filter, setFilter] = useState({
    calories: "",
    nutriScore: "",
    novaScore: "",
  });

  const handleFilterChange = (event, filterType) => {
    setFilter({ ...filter, [filterType]: event.target.value });
  };

  function valueChanged(e) {
    let value = e.target.value;
    setValue(value);
  }

  async function signOut() {
    localStorage.removeItem("access_token");
    router.push("login");
  }

  useEffect(() => {
    if (localStorage.getItem("access_token") !== null) setIsLoggedIn(true);
    if (value == Value) return;
    if (router.pathname === "/" && Value === "") return;
    if (Value === "") {
      router.push("/");
      console.log("Pushing to /");
    } else if (router.query.query != Value) {
      console.log(router.query.query, Value);
      console.log("Pushing to /routes/search?query=" + Value);
      router.push("/routes/search?query=" + Value);
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
      />
      <div className={styles.filters}>
        <select
          value={filter.calories}
          onChange={(e) => handleFilterChange(e, "calories")}
          className={styles.select}
        >
          <option value="">Calories</option>
          <option value="500">500</option>
          <option value="100">100</option>
          <option value="1500">1500</option>
          <option value="2000">2000</option>
        </select>
        <select
          value={filter.nutriScore}
          onChange={(e) => handleFilterChange(e, "nutriScore")}
          className={styles.select}
        >
          <option value="">Nutri-Score</option>
          <option value="A">A</option>
          <option value="B">B</option>
          <option value="C">C</option>
          <option value="D">D</option>
          <option value="E">E</option>
        </select>
        <select
          value={filter.novaScore}
          onChange={(e) => handleFilterChange(e, "novaScore")}
          className={styles.select}
        >
          <option value="">NOVA Score</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
        </select>
      </div>
      <div className={styles.userActions}>
        {isLoggedIn ? (
          <>
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
