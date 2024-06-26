import { admin_supabase } from "./supabase";
import { jwtDecode } from "jwt-decode";

export default async function handler(req, res) {
  const { accessToken, id } = req.body;
  if (req.method === "POST") {
    if (!accessToken) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const email = jwtDecode(accessToken).email;

    if (email != "filimonstefanmihai@gmail.com") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const { data, error } = await admin_supabase
      .from("products")
      .update({ approved: true })
      .eq("id", id);

    if (error) {
      return res.status(500).json({ message: "Internal Server Error" });
    }

    return res.status(200).json({ message: "Product approved" });
  } else {
    return res.status(405).json({ message: "Method Not Allowed" });
  }
}
