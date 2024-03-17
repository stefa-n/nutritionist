import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/router";
import { supabase } from "@/pages/index";
import md5 from "md5"; // Import md5 for generating the Gravatar hash

import styles from "@/styles/Profile.module.css";
import ProfileData from "@/components/Profile/ProfileData";
import AddAlergens from "@/components/Profile/AddAlergens";
import Submissions from "@/components/Profile/Submissions";
import Topbar from "@/components/Topbar";

export default function Profile() {
  const router = useRouter();

  const [user, setUser] = useState({ email: "" });
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      router.push("/login");
      return;
    }
    const decodedToken = jwtDecode(token);
    setUser(decodedToken);
  }, []);

  async function signOut() {
    console.log("sign out");
    const { error } = await supabase.auth.signOut();
    localStorage.removeItem("access_token");
    router.push("login");
  }

  return (
    <>
      <Topbar profile={true} />
      <div className={styles.main}>
        <div className={styles.profile}>
          <img
            src={`https://www.gravatar.com/avatar/${md5(
              user.email.toLowerCase()
            )}?s=200&d=identicon`}
            alt="Profile Picture (Gravatar)"
            className={styles.avatar}
          />
          <div>
            <div>{user.email}</div>
          </div>
        </div>
        <ProfileData />
        <AddAlergens />
        <Submissions />
      </div>
    </>
  );
}
