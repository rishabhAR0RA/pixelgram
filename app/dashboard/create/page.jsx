"use client"

// import Error from "@/components/Error";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import useMount from "@/hooks/useMount";
import { CreatePost } from "@/lib/schema";
// import { createPost } from "@/lib/actions";
// import { CreatePost } from "@/lib/schemas";
// import { UploadButton } from "@/lib/uploadthing";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
// import { toast } from "sonner";
import { z } from "zod";


const Page = () => {
    const pathname = usePathname();
    const isCreatePage = pathname === "/dashboard/create";
    const router = useRouter();
    const mount = useMount();
    const form = useForm({
        resolver: zodResolver(CreatePost),
        defaultValues: {
            caption: "",
            fileUrl: undefined,
        },
    });

    const fileUrl = form.watch("fileUrl");

    if (!mount) return null;

    return (
        <div>
            <Dialog
                open={isCreatePage}
                onOpenChange={(open) => !open && router.back()}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            Create new post
                        </DialogTitle>
                    </DialogHeader>

                    <Form
                        {...form}
                    >
                        <form className="space-y-4">
                            {
                                !!fileUrl ? (
                                    <div className="h-96 md:h-[450px] overflow-hidden rounded-md">
                                        <AspectRatio ratio={1 / 1} className="relative h-full">
                                            <Image
                                                src={fileUrl}
                                                alt="Image preview"
                                                fill
                                                className="rounded-md object-cover"
                                            />
                                        </AspectRatio>
                                    </div>
                                ) : (
                                    <FormField
                                        control={form.control}
                                        name="fileUrl"
                                        render={({ field, fieldState }) => (
                                            <FormItem>
                                                <FormLabel htmlFor="picture">Picture</FormLabel>
                                                <FormControl>
                                                    {/* <UploadButton
                                                        endpoint="imageUploader"
                                                        onClientUploadComplete={(res) => {
                                                            form.setValue("fileUrl", res[0].url);
                                                            toast.success("Upload complete");
                                                        }}
                                                        onUploadError={(error: Error) => {
                                                            console.error(error);
                                                            toast.error("Upload failed");
                                                        }}
                                                    /> */}
                                                </FormControl>
                                                <FormDescription>
                                                    Upload a picture to post.
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                )
                            }
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default Page;