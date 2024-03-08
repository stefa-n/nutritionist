import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

export default function Profile() {
  const [user, setUser] = useState({});
  useEffect(() => {
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
