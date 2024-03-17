import Router from "next/router";
import { supabase } from "@/pages/index";

export async function checkValid(token) {
  const response = await fetch("/api/auth/checkvalid", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ token: token }),
  });
  if (!response.ok) {
    signOut();
  }
}

export async function signOut() {
  console.log("sign out");
  const { error } = await supabase.auth.signOut();
  localStorage.removeItem("access_token");
  Router.push("login");
}
