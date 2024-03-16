import { supabase } from "@/pages/index.js";
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

    if (!id) {
      return res.status(400).json({ message: "Bad Request" });
    }

    let { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", id);

    let produse = data;

    let { data: imageData, error: imageError } = supabase.storage
      .from("products")
      .getPublicUrl(`${produse[0].id}.${produse[0].image_format}`);

    produse[0].image = `${imageData.publicUrl}`;

    if (error || imageError) {
      return res.status(500).json({ message: "Internal Server Error" });
    }

    return res.status(200).json(produse[0]);
  } else {
    return res.status(405).json({ message: "Method Not Allowed" });
  }
}
