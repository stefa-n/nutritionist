import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { formatDistanceToNow } from "date-fns";
import { FiArrowUp, FiArrowDown } from "react-icons/fi";
import { jwtDecode } from "jwt-decode";
import Topbar from "@/components/Topbar";

import styles from "@/styles/myNutritionist.module.css";

let supabase;

const PostDetailPage = () => {
  const router = useRouter();
  const { postID } = router.query;
  let token;
  const [user, setUser] = useState({});
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState(null);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    token = localStorage.getItem("access_token");
    if (!token) {
      router.push("/login");
      return;
    }

    supabase = createClient(
      "https://devjuheafwjammjnxthd.supabase.co",
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRldmp1aGVhZndqYW1tam54dGhkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDgyODE4OTIsImV4cCI6MjAyMzg1Nzg5Mn0.nb5Hx-GEORyNSyoBcVfFC3ktfS5x7vCqBtsD3kJR25M",
      {
        global: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      }
    );

    const decodedToken = jwtDecode(token);
    setUser(decodedToken);

    if (postID) {
      fetchPost();
      fetchComments();
    }
  }, [postID]);

  const fetchPost = async () => {
    try {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("id", postID)
        .single();

      setPost(data);
    } catch (error) {
      console.error("Error fetching post:", error);
    }
  };

  const fetchComments = async () => {
    try {
      const { data, error } = await supabase
        .from("post_comments")
        .select("*")
        .eq("post_id", postID)
        .order("created_at", { ascending: false });
      setComments(data);
    } catch (error) {
      console.error("Error fetching post:", error);
    }
  };

  const handleUpload = async () => {
    try {
      const { data, error } = await supabase.from("post_comments").insert([
        {
          text: newComment,
          post_id: postID,
          user_id: user.sub,
          username: user.email,
        },
      ]);

      if (error) {
        throw error;
      }

      console.log("Post created successfully:", data);
    } catch (error) {
      console.error("Error creating post:", error.message);
    }
    setNewComment("");
    fetchComments();
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
    fetchPost();
  };

  if (!post || !comments) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Topbar search={false} />
      <div className={styles.postList}>
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
              <span className={styles.commentUser}>
                {post.username.substring(0, post.username.lastIndexOf("@"))}
              </span>
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
              children={post.description}
            />
          </div>
        </div>
        <div className={styles.commentBox}>
          <textarea
            className={styles.commentInput}
            id="newComment"
            placeholder="Type your comment here..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            required
          />
          <button className={styles.uploadButton} onClick={handleUpload}>
            Upload
          </button>
        </div>
        {comments.map((comment) => (
          <div className={styles.comment} key={comment.id}>
            <div className={styles.commentDetails}>
              <span className={styles.commentUser}>
                {comment.username.substring(
                  0,
                  comment.username.lastIndexOf("@")
                )}
              </span>
              <span className={styles.commentDate}>
                {formatDistanceToNow(new Date(comment.created_at), {
                  addSuffix: true,
                })}
              </span>
            </div>
            <div className={styles.commentText}>{comment.text}</div>
          </div>
        ))}
      </div>
    </>
  );
};

export default PostDetailPage;
