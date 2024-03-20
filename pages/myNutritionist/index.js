import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { FaPlus } from "react-icons/fa6";
import { FiArrowUp, FiArrowDown } from "react-icons/fi";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import { jwtDecode } from "jwt-decode";
import { formatDistanceToNow } from "date-fns";
import Topbar from "@/components/Topbar";

import ReactMarkdown from "react-markdown";

import styles from "@/styles/myNutritionist.module.css";
import CreatePostForm from "@/components/CreatePostForm";

import { createClient } from "@supabase/supabase-js";
import { checkValid } from "@/components/Auth/Auth";

let supabase;

const truncateDescription = (description, maxWords) => {
  const words = description.split(" ");
  if (words.length > maxWords) {
    return words.slice(0, maxWords).join(" ") + "...";
  } else {
    return description;
  }
};

export default function MyNutritionist() {
  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");
    if (!accessToken || !checkValid(accessToken, false)) {
      supabase = createClient(
        "https://devjuheafwjammjnxthd.supabase.co",
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRldmp1aGVhZndqYW1tam54dGhkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDgyODE4OTIsImV4cCI6MjAyMzg1Nzg5Mn0.nb5Hx-GEORyNSyoBcVfFC3ktfS5x7vCqBtsD3kJR25M"
      );
      return;
    }
    supabase = createClient(
      "https://devjuheafwjammjnxthd.supabase.co",
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRldmp1aGVhZndqYW1tam54dGhkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDgyODE4OTIsImV4cCI6MjAyMzg1Nzg5Mn0.nb5Hx-GEORyNSyoBcVfFC3ktfS5x7vCqBtsD3kJR25M",
      {
        global: {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      }
    );
  }, []);

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
        .or(
          `title.ilike."%${query}%", description.ilike."%${query}%", tag.ilike."%${query}%"`
        )
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

  const handleVote = async (postId, vote) => {
    try {
      const { data: post, error } = await supabase
        .from("posts")
        .select("*")
        .eq("id", postId)
        .single();

      if (error) {
        throw error;
      }

      let { upvotes, downvotes } = post;
      upvotes = upvotes || [];
      downvotes = downvotes || [];

      if (vote === 1) {
        if (!upvotes.includes(user.sub)) {
          upvotes.push(user.sub);
        } else {
          const index = upvotes.indexOf(user.sub);
          if (index > -1) {
            upvotes.splice(index, 1);
          }
        }
        const index = downvotes.indexOf(user.sub);
        if (index > -1) {
          downvotes.splice(index, 1);
        }
      } else if (vote === -1) {
        if (!downvotes.includes(user.sub)) {
          downvotes.push(user.sub);
        } else {
          const index = downvotes.indexOf(user.sub);
          if (index > -1) {
            downvotes.splice(index, 1);
          }
        }
        const index = upvotes.indexOf(user.sub);
        if (index > -1) {
          upvotes.splice(index, 1);
        }
      }

      console.log(upvotes, downvotes);
      const { error: updateError } = await supabase
        .from("posts")
        .update({ upvotes, downvotes })
        .eq("id", postId);

      if (updateError) {
        throw updateError;
      }
    } catch (error) {
      console.error("Error upvoting post:", error.message);
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
      <Topbar search={false} />
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
                onClick={() => handleVote(post.id, 1)}
                className={styles.voteButton}
              >
                <FiArrowUp size={42} />
              </button>
              <span className={styles.voteCount}>
                {(post.upvotes ? post.upvotes.length : 0) -
                  (post.downvotes ? post.downvotes.length : 0)}
              </span>
              <button
                onClick={() => handleVote(post.id, -1)}
                className={styles.voteButton}
              >
                <FiArrowDown size={42} />
              </button>
            </div>
            <div
              className={styles.postContent}
              onClick={() => router.push(`/myNutritionist/${post.id}`)}
            >
              <div className={styles.commentDetails}>
                <span className={styles.commentUser}>{post.username}</span>
                <span className={styles.commentDate}>
                  {formatDistanceToNow(new Date(post.created_at), {
                    addSuffix: true,
                  })}
                </span>
              </div>
              <h2>{post.title}</h2>
              <p className={styles.tag}>{post.tag}</p>
              {
                // eslint-disable-next-line
              }
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
