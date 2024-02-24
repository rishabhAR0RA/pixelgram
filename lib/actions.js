"use server"

import { db } from "./db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getUserId } from "./utils";
import { CreatePost, DeletePost, LikeSchema } from "./schema";

export async function createPost(values) {
    const userId = await getUserId();
    const validatedFields = CreatePost.safeParse(values);

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Missing Fields. Failed to create post.",
        }
    }

    const { fileUrl, caption, location } = validatedFields.data;

    try {
        await db.post.create({
            data: {
                caption,
                fileUrl,
                location,
                user: {
                    connect: {
                        id: userId,
                    }
                }
            },
        });
    } catch (error) {
        return {
            message: "Database Error: Failed to create post.",
        }
    }

    revalidatePath("/dashboard");
    redirect("/dashboard");
}

export async function deletePost(formData) {
    const userId = await getUserId();

    const { id } = DeletePost.parse({
        id: formData.get("id"),
    });

    const post = await prisma.post.findUnique({
        where: {
            id,
            userId,
        },
    });

    if (!post) {
        throw new Error("Post not found");
    }

    try {
        await prisma.post.delete({
            where: {
                id,
            },
        });
        revalidatePath("/dashboard");
        return { message: "Post deleted successfully" };
    } catch (error) {
        return { message: "Database Error: Failed to Delete Post." };
    }
}

export async function likePost(value) {
    const userId = await getUserId();
    const validatedFields = LikeSchema.safeParse({ postId: value });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Missing Fields. Failed to like post.",
        }
    }

    const { postId } = validatedFields.data;
    const post = await prisma.post.findUnique({
        where: {
            id: postId,
        },
    });

    const like = await db.like.findUnique({
        where: {
            postId_userId: {
                postId,
                userId,
            },
        },
    });

    if (like) {
        try {
            await db.like.delete({
                where: {
                    postId_userId: {
                        postId,
                        userId,
                    },
                },
            });

            revalidatePath("/dashboard");
        } catch (error) {
            return {
                message: "Database Error: Failed to unlike post.",
            }
        }
    }

    try {
        await db.like.create({
            data: {
                postId,
                userId,
            }
        });
        revalidatePath("/dashboard");
        return { message: "Post liked" };
    } catch (error) {
        return {
            message: "Database Error: Failed to like post.",
        }
    }
}