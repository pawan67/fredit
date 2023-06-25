import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { PostValidator } from "@/lib/validators/posts";
import { SubredditSubscriptionValidator } from "@/lib/validators/subreddit";
import { z } from "zod";

export async function DELETE(req: Request) {
  try {
    const session = await getAuthSession();
    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }
    const body = await req.json();

    const { postId } = body;

    const post = await db.post.findUnique({
      where: {
        id: postId,
      },
    });

    if (!post) {
      return new Response("Post not found", { status: 404 });
    }

    if (post.authorId !== session.user.id) {
      return new Response("Unauthorized", { status: 401 });
    }

    await db.post.delete({
      where: {
        id: postId,
      },
    });

    return new Response("OK");
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response("Invalid Post request data", { status: 422 });
    }

    return new Response("Could not delete post", { status: 500 });
  }
}
