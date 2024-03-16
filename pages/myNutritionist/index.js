import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { FaPlus } from "react-icons/fa6";

import { supabase } from "@/pages/index";
import styles from "@/styles/myNutritionist.module.css";

const truncateDescription = (description, maxWords) => {
  const words = description.split(" ");
  if (words.length > maxWords) {
    return words.slice(0, maxWords).join(" ") + "...";
  } else {
    return description;
  }
};

export default function myNutritionist() {
  const router = useRouter();
  const [Value, setValue] = useState("");
  const [posts, setPosts] = useState(null);

  const fetchPosts = async (query = "") => {
    try {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .ilike("title", `%${query}%`)
        .ilike("description", `%${query}%`);
      setPosts(data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  function valueChanged(e) {
    let value = e.target.value;
    setValue(value);
    fetchPosts(value);
  }

  useEffect(() => {
    fetchPosts();
  }, []);
  if (!posts) {
    return <div>Loading...</div>;
  }
  return (
    <>
      <div className={styles.postList}>
        <h1>Welcome to the MyNutritionist forum</h1>
        <div className={styles.barContainer}>
          <input
            value={Value}
            onChange={(e) => valueChanged(e)}
            type="text"
            placeholder="Search..."
            className={styles.searchBar}
          />
          <button className={styles.postBtn}>
            <FaPlus style={{ marginRight: "0.5em" }} />
            Create a post
          </button>
        </div>
        {posts.map((post) => (
          <div
            key={post.id}
            className={styles.post}
            onClick={() => router.push(`/myNutritionist/${post.id}`)}
          >
            <h2>{post.title}</h2>
            <p className={styles.tag}>{post.tag}</p>
            <p>{truncateDescription(post.description, 50)}</p>
          </div>
        ))}
      </div>
    </>
  );
}
