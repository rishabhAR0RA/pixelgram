import { z } from "zod";

export const PostSchema = z.object({
    id: z.string(),
    fileUrl: z.string({
        required_error: "Flie URL must be a valid URL",
    }).url(),
    caption: z.string().optional(),
    location: z.string().optional(),
});

export const CreatePost = PostSchema.omit({ id: true });
export const UpdatePost = PostSchema;
export const DeletePost = PostSchema.pick({ id: z.string() });

export const LikeSchema = z.object({
    postId: z.string(),
});

export const BookmarkSchema = z.object({
    postId: z.string(),
});