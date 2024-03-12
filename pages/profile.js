import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/router";
import { supabase } from "@/pages/index";

export default function Profile() {
  const router = useRouter();

  const [user, setUser] = useState({});
  useEffect(() => {
    if (localStorage.getItem("access_token") === null)
      return () => router.push("/login");
    setUser(jwtDecode(localStorage.getItem("access_token")));
  }, []);

  async function signOut() {
    console.log("sign out");
    const { error } = await supabase.auth.signOut();
    localStorage.removeItem("access_token");
    setUser({});
    router.push("login");
    console.log(error);
  }
  return (
    <>
      <div>
        <h1>Profile</h1>
        <div>{user.email}</div>
        <button onClick={signOut}>Sign out</button>
      </div>
    </>
  );
}
