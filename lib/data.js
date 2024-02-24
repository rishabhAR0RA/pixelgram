import { unstable_noStore as noStore } from "next/cache";
import { db } from "./db";

export async function fetchPosts() {
    noStore();

    try {
        const data = await db.post.findMany({
            include: {
                comments: {
                    include: {
                        user: true,
                    },
                    orderBy: {
                        createdAt: "desc",
                    },
                },
                likes: {
                    include: {
                        user: true,
                    },
                },
                savedBy: true,
                user: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        return data;
    } catch (error) {
        console.log("Database Error:", error);
        throw new Error("Failed to fetch posts");
    }
}