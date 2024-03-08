import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/router";

export default function Profile() {
  const router = useRouter();

  const [user, setUser] = useState({});
  useEffect(() => {
    if(localStorage.getItem("access_token") === null) return () => router.push("/auth");
    setUser(jwtDecode(localStorage.getItem("access_token")));
  }, []);
  return (
    <>
      <div>
        <h1>Profile</h1>
        {user.email}
      </div>
    </>
  );
}
