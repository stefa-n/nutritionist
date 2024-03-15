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

export default function myNutritionist({ posts }) {
  return (
    <>
      <div className={styles.postList}>
        <h1>Welcome to the MyNutritionist forum</h1>
        {posts.map((post) => (
          <div key={post.id} className={styles.post}>
            <h2>{post.title}</h2>
            <p>{truncateDescription(post.description, 50)}</p>
            <p>Tag: {post.tag}</p>
            <p>Pinned: {post.pinned ? "Yes" : "No"}</p>
          </div>
        ))}
      </div>
    </>
  );
}

export async function getServerSideProps() {
  const { data, error } = await supabase.from("posts").select("*");

  const posts = data;

  return {
    props: {
      posts,
    },
  };
}
