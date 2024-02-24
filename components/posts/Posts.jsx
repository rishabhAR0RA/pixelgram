import { fetchPosts } from "@/lib/data";
import Post from "./Post";

const Posts = async () => {
    const posts = await fetchPosts();

    return (
        <>
            {posts.map((post) => (
                <Post key={post.id} post={post} />
            ))}
        </>
    );
}

export default Posts;  