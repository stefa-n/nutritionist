import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { jwtDecode } from "jwt-decode";
import ReactMarkdown from "react-markdown";
import Link from "next/link";

import styles from "@/styles/Login.module.css";

export default function Login() {
  const [subtitle, setSubtitle] = useState(
    "Create an account to access multiple features & MyNutritionist"
  );
  const router = useRouter();
  useEffect(() => {
    if (localStorage.getItem("access_token") === null) return;

    const user = jwtDecode(localStorage.getItem("access_token"));
    if (user.aud) {
      router.push("/");
    }
  });

  async function handleSignup(event) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");

    if (email === "" || password === "") return;
    var regex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (regex.test(email) === false) return setSubtitle("Invalid E-mail.");

    const response = await fetch(`/api/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      router.push("/login");
    }
  }
  return (
    <>
      <div className={styles.container}>
        <p className={styles.title}>Welcome to Nutritionist!</p>
        <p className={styles.subtitle}>{subtitle}</p>

        <form onSubmit={handleSignup} className={styles.form}>
          <p style={{ margin: 0 }}>Email</p>
          <input name="email" placeholder="Enter your e-mail address" />
          <br />
          <p style={{ margin: 0 }}>Password</p>
          <input
            type="password"
            name="password"
            placeholder="Enter a password for your account"
          />
          <p className={styles.subtitle} style={{ marginBottom: 0 }}>
            By creating an account, you agree to the{" "}
            <Link
              target="_blank"
              href="/guidelines"
              style={{ color: "blue", textDecoration: "none" }}
            >
              community guidelines
            </Link>
          </p>
          <button type="submit">Continue</button>
        </form>

        <p className={styles.subtitle} style={{ marginBottom: 0 }}>
          Already have an account?{" "}
          <Link href="/login" style={{ color: "blue", textDecoration: "none" }}>
            Log in
          </Link>
        </p>
      </div>
    </>
  );
}
