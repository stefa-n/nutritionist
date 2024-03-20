import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { jwtDecode } from "jwt-decode";
import Link from "next/link";

import styles from "@/styles/Login.module.css";

export default function Login() {
  const router = useRouter();
  useEffect(() => {
    if (localStorage.getItem("access_token") === null) return;

    const user = jwtDecode(localStorage.getItem("access_token"));
    if (user.aud) {
      router.push("/");
    }
  });

  async function handleLogin(event) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");

    if (email === "" || password === "") return;
    var regex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (regex.test(email) === false) return setSubtitle("Invalid Email.");

    const response = await fetch(`/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      const resolvedPromise = await response.json();
      if (resolvedPromise.data.user == null)
        return setSubtitle("Wrong email or password.");
      if (resolvedPromise.data.session == null) return;
      localStorage.setItem(
        "access_token",
        resolvedPromise.data.session.access_token
      );
      router.push("/profile");
    }
  }

  const [subtitle, setSubtitle] = useState(
    "Log in to access multiple features & MyNutritionist"
  );

  return (
    <>
      <div className={styles.container}>
        <p className={styles.title}>Welcome to Nutritionist!</p>
        <p className={styles.subtitle}>{subtitle}</p>

        <form onSubmit={handleLogin} className={styles.form}>
          <p style={{ margin: 0 }}>Email</p>
          <input name="email" placeholder="Enter your e-mail address" />
          <br />
          <p style={{ margin: 0 }}>Password</p>
          <input
            type="password"
            name="password"
            placeholder="Enter your account's password"
          />
          <button type="submit">Continue</button>
        </form>

        <p className={styles.subtitle} style={{ marginBottom: 0 }}>
          Don't have an account?{" "}
          <Link
            href="/signup"
            style={{ color: "blue", textDecoration: "none" }}
          >
            Sign Up
          </Link>
        </p>
      </div>
    </>
  );
}
