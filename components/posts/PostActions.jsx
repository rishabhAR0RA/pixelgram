import { cn } from "@/lib/utils";
import { MessageCircle } from "lucide-react";
import Link from "next/link";
import LikeButton from "./LikeButton";
import ActionIcon from "../ActionIcon";
import ShareButton from "./ShareButton";
import BookmarkButton from "./BookmarkButton";

const PostActions = ({ post, userId, className }) => {
    return (
        <div className={cn("relative flex items-start w-full gap-x-2", className)}>
            <LikeButton post={post} userId={userId} />
            <Link href={`/dashboard/post/${post.id}`}>
                <ActionIcon>
                    <MessageCircle className={"h-6 w-6"} />
                </ActionIcon>
            </Link>
            <ShareButton postId={post.id} />
            <BookmarkButton post={post} userId={userId} />
        </div>
    );
}

export default PostActions;