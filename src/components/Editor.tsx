"use client";
import React, { useCallback, useEffect, useRef } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PostCreationRequest, PostValidator } from "@/lib/validators/posts";
import type EditorJS from "@editorjs/editorjs";
import { uploadFiles } from "@/lib/uploadthing";
import { type } from "os";
import { toast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import path from "path";
import { usePathname, useRouter } from "next/navigation";
interface EditorProps {
  subredditId: string;
}
function Editor({ subredditId }: EditorProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PostCreationRequest>({
    resolver: zodResolver(PostValidator),
    defaultValues: {
      subredditId,
      title: "",
      content: null,
    },
  });

  const ref = useRef<EditorJS>();
  const [isMounted, setIsMounted] = React.useState(false);
  const _titleRef = useRef<HTMLTextAreaElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  const initializeEditor = useCallback(async () => {
    const EditorJS = (await import("@editorjs/editorjs")).default;
    const Header = (await import("@editorjs/header")).default;
    const List = (await import("@editorjs/list")).default;
    const Embed = (await import("@editorjs/embed")).default;
    const Table = (await import("@editorjs/table")).default;
    const ImageTool = (await import("@editorjs/image")).default;
    const Code = (await import("@editorjs/code")).default;
    const LinkTool = (await import("@editorjs/link")).default;
    const InlineCode = (await import("@editorjs/inline-code")).default;
    // @ts-ignore
    // @ts-expect-error
    const CheckList = (await import("@editorjs/checklist")).default;

    if (!ref.current) {
      const editor = new EditorJS({
        holder: "editor",
        onReady() {
          ref.current = editor;
        },
        placeholder: "Type here to start writing...",
        inlineToolbar: true,
        data: {
          blocks: [],
        },
        tools: {
          header: Header,
          linkTool: {
            class: LinkTool,
            config: {
              endpoint: "/api/link",
            },
          },
          image: {
            class: ImageTool,
            config: {
              uploader: {
                async uploadByFile(file: File) {
                  const [res] = await uploadFiles([file], "imageUploader");
                  return {
                    success: 1,
                    file: {
                      url: res.fileUrl,
                    },
                  };
                },
              },
            },
          },
          list: List,
          code: Code,
          inlineCode: InlineCode,
          embed: Embed,
          table: Table,
          checklist: {
            class: CheckList,
            inlineToolbar: true,
          },
        },
      });
    }
  }, []);
  useEffect(() => {
    if (typeof window !== "undefined") setIsMounted(true);
  }, []);

  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      for (const [key, value] of Object.entries(errors)) {
        toast({
          title: "Something went wrong",
          description: (value as { message: string }).message,
          variant: "destructive",
        });
      }
    }
  }, [errors]);

  useEffect(() => {
    const init = async () => {
      await initializeEditor();
      setTimeout(() => {
        _titleRef.current?.focus();
      }, 0);
    };

    if (isMounted) init();

    return () => {
      ref.current?.destroy();
      ref.current = undefined;
    };
  }, [isMounted, initializeEditor]);

  const { mutate: createPost } = useMutation({
    mutationFn: async ({
      title,
      content,
      subredditId,
    }: PostCreationRequest) => {
      const payload: PostCreationRequest = {
        title,
        content,
        subredditId,
      };
      const { data } = await axios.post("/api/subreddit/post/create", payload);
      return data;
    },
    onError: (err) => {
      return toast({
        title: "Something went wrong",
        description: "Post was not published, please try again later",
        variant: "destructive",
      });
    },

    onSuccess: (data) => {
      // r/myCommunity

      const newPathname = pathname.split("/").slice(0, -1).join("/");
      router.push(newPathname);
      router.refresh();
      return toast({
        description: "Your post was published successfully",
      });
    },
  });

  async function onSubmit(data: PostCreationRequest) {
    const blocks = await ref.current?.save();
    const payload: PostCreationRequest = {
      title: data.title,
      content: blocks,
      subredditId,
    };
    createPost(payload);
  }

  if (!isMounted) return null;

  const { ref: titleRef, ...rest } = register("title");
  return (
    <div className=" w-full p-4 bg-zinc-50 rounded-lg border border-zinc-200 ">
      <form
        onSubmit={handleSubmit(onSubmit)}
        id="subreddit-post-form"
        className=" w-fit "
      >
        <div className=" prose prose-stone dark:prose-invert ">
          <TextareaAutosize
            ref={(e) => {
              titleRef(e);
              // @ts-ignore
              _titleRef.current = e;
            }}
            {...rest}
            placeholder=" title"
            className=" w-full resize-none appearance-none overflow-hidden bg-transparent text-5xl font-bold focus:outline-none"
          />

          <div id="editor" className="min-h-[500px]" />
        </div>
      </form>
    </div>
  );
}

export default Editor;
