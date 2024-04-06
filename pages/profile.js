import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/router";
import md5 from "md5";

import styles from "@/styles/Profile.module.css";
import DailyChallenges from "@/components/Profile/DailyChallanges";
import ProfileData from "@/components/Profile/ProfileData";
import AddDietaryPreferences from "@/components/Profile/AddDietaryPreferences";
import AddAlergens from "@/components/Profile/AddAlergens";
import Submissions from "@/components/Profile/Submissions";
import Stats from "@/components/Profile/Stats";
import Topbar from "@/components/Topbar";
import { checkValid } from "@/components/Auth/Auth";
import CommunityChallenge from "@/components/Profile/CommunityChallenges";

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

    checkValid(token);
  }, []);

  return (
    <>
      <Topbar profile={true} search={false} />
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
        <DailyChallenges />
        <CommunityChallenge />
        <Stats />
        <ProfileData />
        <AddDietaryPreferences />
        <AddAlergens />
        <Submissions />
      </div>
    </>
  );
}
