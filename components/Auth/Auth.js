import Router from "next/router";
import { supabase } from "@/pages/index";

export async function checkValid(token, redirect = true) {
  if (!token) {
    if (redirect) Router.push("login");
    return false;
  }
  const response = await fetch("/api/auth/checkvalid", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ token: token }),
  });
  if (!response.ok) {
    signOut(redirect);
    return true;
  }
}

export async function signOut(redirect) {
  console.log("sign out");
  const { error } = await supabase.auth.signOut();
  localStorage.removeItem("access_token");
  if (redirect) Router.push("login");
}
