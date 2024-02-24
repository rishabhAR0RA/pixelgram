"use client";

import { bookmarkPost } from "@/lib/actions";
import { cn } from "@/lib/utils";
import ActionIcon from "@/components/ActionIcon";
import { SavedPost } from "@prisma/client";
import { Bookmark } from "lucide-react";
import { useOptimistic } from "react";

function BookmarkButton({ post, userId }) {
    const predicate = (bookmark) =>
        bookmark.userId === userId && bookmark.postId === post.id;
    const [optimisticBookmarks, addOptimisticBookmark] = useOptimistic(
        post.savedBy,
        (state, newBookmark) =>
            state.find(predicate)
                ? //   here we check if the bookmark already exists, if it does, we remove it, if it doesn't, we add it
                state.filter((bookmark) => bookmark.userId !== userId)
                : [...state, newBookmark]
    );

    return (
        <form
            action={async (formData) => {
                const postId = formData.get("postId");
                addOptimisticBookmark({ postId, userId });
                await bookmarkPost(postId);
            }}
            className="ml-auto"
        >
            <input type="hidden" name="postId" value={post.id} />

            <ActionIcon>
                <Bookmark
                    className={cn("h-6 w-6", {
                        "dark:fill-white fill-black": optimisticBookmarks.some(predicate),
                    })}
                />
            </ActionIcon>
        </form>
    );
}

export default BookmarkButton;