"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { CreateSubredditPayload } from "@/lib/validators/subreddit";
import { toast } from "@/hooks/use-toast";
import { useCustomToast } from "@/hooks/use-custom-toast";
const Page = ({}) => {
  const [input, setInput] = useState("");
  const router = useRouter();
  const { loginToast } = useCustomToast();

  const { mutate: createCommunity, isLoading } = useMutation({
    mutationFn: async () => {
      const payload: CreateSubredditPayload = {
        name: input,
      };
      const { data } = await axios.post("/api/subreddit", payload);
      return data as string;
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 409) {
          return toast({
            title: "Subreddit already exists",
            description: "Please choose a different name",
            variant: "destructive",
          });
        }
        if (err.response?.status === 422) {
          return toast({
            title: "Invalid Subreddit Name",
            description: "Please choose a name between 3 and 21 characters",
            variant: "destructive",
          });
        }
        if (err.response?.status === 401) {
          return loginToast();
        }
      }
      toast({
        title: "Something went wrong",
        description: "Please try again later",
      });
    },
    onSuccess: (data) => {
      router.push(`/r/${data}`);
      toast({
        title: "Community created",
        description: "You can now post to your community",
      });
    },
  });

  return (
    <div className=" container flex items-center h-full max-w-3xl mx-auto">
      <div className=" relative p-4   bg-white w-full h-fit rounded-lg space-y-6 ">
        <div className=" flex justify-between items-center ">
          <h1 className=" text-xl font-semibold">Create a community</h1>
        </div>
        <hr className=" bg-zinc-500 h-px" />
        <div>
          <p className=" text-lg font-medium ">name</p>
          <p>Community names including capitalization cannot be changes</p>
          <div className=" mt-3 relative ">
            <p className=" absolute text-sm left-0 w-8 inset-y-0 grid place-items-center ">
              r/
            </p>
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className=" pl-6"
            />
          </div>
        </div>

        <div className=" flex justify-end gap-4 ">
          <Button onClick={() => router.back()} variant="subtle">
            Cancel
          </Button>
          <Button
            isLoading={isLoading}
            disabled={input.length === 0}
            onClick={() => createCommunity()}
          >
            Create Community
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Page;
