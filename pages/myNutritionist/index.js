import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { FaPlus } from "react-icons/fa6";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";

import { supabase } from "@/pages/index";
import styles from "@/styles/myNutritionist.module.css";
import CreatePostForm from "@/components/CreatePostForm";

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
  const [open, setOpen] = useState(false);
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

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

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
          <button className={styles.postBtn} onClick={handleClickOpen}>
            <FaPlus style={{ marginRight: "0.5em" }} />
            Create a post
          </button>
          <Dialog
            open={open}
            onClose={handleClose}
            fullWidth={true}
            maxWidth="lg"
          >
            <DialogTitle>Create a new post</DialogTitle>
            <DialogContent>
              <CreatePostForm />
            </DialogContent>
          </Dialog>
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
