import Editor from "@/components/Editor";
import { Button } from "@/components/ui/Button";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import React from "react";

interface SubmitPageProps {
  params: {
    slug: string;
  };
}

const SubmitPage = async ({ params }: SubmitPageProps) => {
  const { slug } = params;
  const subreddit = await db.subreddit.findFirst({
    where: {
      name: slug,
    },
  });
  if (!subreddit) notFound();

  return (
    <div className="flex flex-col items-start gap-6">
      {/* heading */}
      <div className="border-b border-gray-200 pb-5">
        <div className="-ml-2 -mt-2 flex flex-wrap items-baseline">
          <h3 className="ml-2 mt-2 text-base font-semibold leading-6 text-gray-900">
            Create Post
          </h3>
          <p className="ml-2 mt-1 truncate text-sm text-gray-500">
            in r/{params.slug}
          </p>
        </div>
      </div>

      {/* form */}
      <Editor subredditId={subreddit.id} />

      <div className="w-full flex justify-end">
        <Button type="submit" className="w-full" form="subreddit-post-form">
          Post
        </Button>
      </div>
    </div>
  );
};

export default SubmitPage;
