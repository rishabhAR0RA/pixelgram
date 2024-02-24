"use client";

import { cn } from "@/lib/utils";
import { Like } from "@prisma/client";
import { Heart } from "lucide-react";
import { useOptimistic } from "react";
import { likePost } from "@/lib/actions";
import ActionIcon from "../Actionicon";

const LikeButton = ({ post, userId }) => {
    const predicate = (like) =>
        like.userId === userId && like.postId === post.id;

    const [optimisticLikes, addOptimisticLike] = useOptimistic(
        post.likes,
        (state, newLike) =>
            // here we check if the like already exists, if it does, we remove it, if it doesn't, we add it
            state.some(predicate)
                ? state.filter((like) => like.userId !== userId)
                : [...state, newLike]
    );

    return (
        <div className="flex flex-col">
            <form
                action={async (formData) => {
                    const postId = formData.get("postId");
                    addOptimisticLike({ postId, userId });

                    await likePost(postId);
                }}
            >
                <input type="hidden" name="postId" value={post.id} />

                <ActionIcon>
                    <Heart
                        className={cn("h-6 w-6", {
                            "text-red-500 fill-red-500": optimisticLikes.some(predicate),
                        })}
                    />
                </ActionIcon>
            </form>
            {optimisticLikes.length > 0 && (
                <p className="text-sm font-bold dark:text-white">
                    {optimisticLikes.length}{" "}
                    {optimisticLikes.length === 1 ? "like" : "likes"}
                </p>
            )}
        </div>
    );
}

export default LikeButton;