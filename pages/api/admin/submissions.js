import { admin_supabase } from "./supabase";
import { jwtDecode } from "jwt-decode";

export default async function handler(req, res) {
  const { accessToken } = req.body;
  if (req.method === "POST") {
    if (!accessToken) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const uid = jwtDecode(accessToken).sub;

    if (uid != "92b35ba5-b90d-44b3-b6af-c7afa521e304") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const { data, error } = await admin_supabase
      .from("products")
      .select("*")
      .eq("approved", false);

    let produse = data;

    for (let i = 0; i < data.length; i++) {
      const { data } = admin_supabase.storage
        .from("products")
        .getPublicUrl(`${produse[i].id}.${produse[i].image_format}`);

      produse[i].image = `${data.publicUrl}`;
    }

    if (error) {
      return res.status(500).json({ message: "Internal Server Error" });
    }

    return res.status(200).json(produse);
  } else {
    return res.status(405).json({ message: "Method Not Allowed" });
  }
}
