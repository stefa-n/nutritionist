import { FormEvent, useEffect } from "react";
import { useRouter } from "next/router";
import { jwtDecode } from "jwt-decode";

export default function Auth() {
  const router = useRouter();
  useEffect(() => {
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

    const response = await fetch(`/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      const resolvedPromise = await response.json();
      localStorage.setItem(
        "access_token",
        resolvedPromise.data.session.access_token
      );
      router.push("/profile");
    } else {
      // Handle errors
    }
  }

  async function handleSignup(event) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");

    const response = await fetch(`/api/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      router.push("/profile");
    } else {
      // Handle errors
    }
  }
  return (
    <>
      <div>
        <form onSubmit={handleLogin}>
          <input name="email" placeholder="Email" />
          <input type="password" name="password" placeholder="Password" />
          <button type="submit">Login</button>
        </form>

        <form onSubmit={handleSignup}>
          <input name="email" placeholder="Email" />
          <input type="password" name="password" placeholder="Password" />
          <button type="submit">Sign up</button>
        </form>
      </div>
    </>
  );
}
