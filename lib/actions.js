"use server"

import { db } from "./db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getUserId } from "./utils";
import { CreatePost } from "./schema";

export async function createPost(values) {
    const userId = await getUserId();
    const validatedFields = CreatePost.safeParse(values);

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Missing Fields. Failed to create post.",
        }
    }

    const { fileUrl, caption } = validatedFields.data;

    try {
        await db.post.create({
            data: {
                caption,
                fileUrl,
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