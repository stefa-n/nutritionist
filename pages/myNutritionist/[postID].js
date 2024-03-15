import { useRouter } from "next/router";
import { supabase } from "@/pages/index";
import { useEffect, useState } from "react";

const PostDetailPage = () => {
  const router = useRouter();
  const { postID } = router.query;
  const [post, setPost] = useState(null);

  useEffect(() => {
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

    if (postID) {
      fetchPost();
    }
  }, [postID]);

  if (!post) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{post.title}</h1>
      <p>{post.description}</p>
      <p>Tag: {post.tag}</p>
      <p>Pinned: {post.pinned ? "Yes" : "No"}</p>
    </div>
  );
};

export default PostDetailPage;
