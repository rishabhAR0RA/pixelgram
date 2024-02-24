"use client";

import ActionIcon from "@/components/ActionIcon";
import { Link, Send } from "lucide-react";
import { toast } from "sonner";

const ShareButton = ({ postId }) => {
    return (
        <ActionIcon
            onClick={() => {
                navigator.clipboard.writeText(
                    `${window.location.origin}/dashboard/post/${postId}`
                );
                toast("Link copied to clipboard", {
                    icon: <Link className={"h-5 w-5"} />,
                });
            }}
        >
            <Send className={"h-6 w-6"} />
        </ActionIcon>
    );
}

export default ShareButton;