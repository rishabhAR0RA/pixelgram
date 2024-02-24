"use client";

import { deletePost } from "@/lib/actions";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import SubmitButton from "@/components/SubmitButton";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useState } from "react";

const PostOptions = ({ post, userId, className }) => {
    const [open, setOpen] = useState(false);
    const isPostMine = post.userId === userId;

    return (
        <Dialog open={open} onOpenChange={setOpen} >
            <DialogTrigger asChild>
                <MoreHorizontal
                    className={cn(
                        "h-5 w-5 cursor-pointer dark:text-neutral-400",
                        className
                    )}
                />
            </DialogTrigger>
            <DialogContent className="dialogContent">
                {isPostMine && (
                    <form
                        action={async (formData) => {
                            const { message } = await deletePost(formData);
                            toast(message);
                            setOpen(false);
                        }}
                        className="postOption"
                    >
                        <input type="hidden" name="id" value={post.id} />
                        <SubmitButton className="text-red-500 font-bold disabled:cursor-not-allowed w-full p-3">
                            Delete post
                        </SubmitButton>
                    </form>
                )}

                {isPostMine && (
                    <Link
                        scroll={false}
                        href={`/dashboard/post/${post.id}/edit`}
                        className="postOption p-3"
                    >
                        Edit
                    </Link>
                )}

                <form action="" className="postOption border-0">
                    <button className="w-full p-3">Hide like count</button>
                </form>
            </DialogContent>
        </Dialog>
    );
}

export default PostOptions;