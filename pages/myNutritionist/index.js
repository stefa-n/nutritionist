import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { FaPlus } from "react-icons/fa6";
import { FiArrowUp, FiArrowDown } from "react-icons/fi";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import { jwtDecode } from "jwt-decode";
import ReactMarkdown from "react-markdown";

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
  const [user, setUser] = useState({});

  const fetchPosts = async (query = "") => {
    try {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .ilike("title", `%${query}%`)
        // .ilike("description", `%${query}%`) // TODO: temporary disable description search otherwise search is broken
        .order("created_at", { ascending: false });
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
    fetchPosts();
    setOpen(false);
  };

  const handleUpvote = async (postId) => {
    try {
      const { data: post, error } = await supabase
        .from("posts")
        .select("votes")
        .eq("id", postId)
        .single();

      if (error) {
        throw error;
      }

      const updatedVotes = post.votes + 1;
      const { error: updateError } = await supabase
        .from("posts")
        .update({ votes: updatedVotes })
        .eq("id", postId);

      if (updateError) {
        throw updateError;
      }
    } catch (error) {
      console.error("Error upvoting post:", error.message);
    }
    fetchPosts();
  };

  const handleDownvote = async (postId) => {
    try {
      const { data: post, error } = await supabase
        .from("posts")
        .select("votes")
        .eq("id", postId)
        .single();

      if (error) {
        throw error;
      }

      const updatedVotes = Math.max(0, post.votes - 1);
      const { error: updateError } = await supabase
        .from("posts")
        .update({ votes: updatedVotes })
        .eq("id", postId);

      if (updateError) {
        throw updateError;
      }
    } catch (error) {
      console.error("Error downvoting post:", error.message);
    }
    fetchPosts();
  };

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      router.push("/login");
      return;
    }
    const decodedToken = jwtDecode(token);
    setUser(decodedToken);
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
              <CreatePostForm user={user} submit={handleClose} />
            </DialogContent>
          </Dialog>
        </div>
        {posts.map((post) => (
          <div key={post.id} className={styles.post}>
            <div className={styles.voteContainer}>
              <button
                onClick={() => handleUpvote(post.id)}
                className={styles.voteButton}
              >
                <FiArrowUp size={42} />
              </button>
              <span className={styles.voteCount}>{post.votes}</span>
              <button
                onClick={() => handleDownvote(post.id)}
                className={styles.voteButton}
              >
                <FiArrowDown size={42} />
              </button>
            </div>
            <div
              className={styles.postContent}
              onClick={() => router.push(`/myNutritionist/${post.id}`)}
            >
              <h2>{post.title}</h2>
              <p className={styles.tag}>{post.tag}</p>
              <ReactMarkdown
                className={styles.markdownPreview}
                children={truncateDescription(post.description, 50)}
              />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
