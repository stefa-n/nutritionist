import { useRouter } from "next/router";
import { supabase } from "@/pages/index";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { FiArrowUp, FiArrowDown } from "react-icons/fi";
import { jwtDecode } from "jwt-decode";

import styles from "@/styles/myNutritionist.module.css";

const PostDetailPage = () => {
  const router = useRouter();
  const { postID } = router.query;
  const [user, setUser] = useState({});
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState(null);
  const [newComment, setNewComment] = useState("");

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
        .eq("post_id", postID);

      setComments(data);
    } catch (error) {
      console.error("Error fetching post:", error);
    }
  };

  const handleUpload = async () => {
    try {
      const { data, error } = await supabase
        .from("post_comments")
        .insert([{ text: newComment, post_id: postID, user_id: user.sub }]);

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
    fetchPost();
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
    fetchPost();
  };
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      router.push("/login");
      return;
    }
    const decodedToken = jwtDecode(token);
    setUser(decodedToken);
    if (postID) {
      fetchPost();
      fetchComments();
    }
  }, [postID]);

  if (!post || !comments) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.postList}>
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
        <div key={comment.id}>{comment.text}</div>
      ))}
    </div>
  );
};

export default PostDetailPage;
