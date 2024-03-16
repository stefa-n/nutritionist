import { supabase } from "@/pages/index.js";
import { jwtDecode } from "jwt-decode";

export default async function handler(req, res) {
  const { accessToken } = req.body;
  if (req.method === "POST") {
    if (!accessToken) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const uid = jwtDecode(accessToken).sub;

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("owned_by_uid", uid);

    let produse = data;

    for (let i = 0; i < data.length; i++) {
      const { data } = supabase.storage
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
