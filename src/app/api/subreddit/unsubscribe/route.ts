import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { SubredditSubscriptionValidator } from "@/lib/validators/subreddit";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();
    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }
    const body = await req.json();
    const { subredditId } = SubredditSubscriptionValidator.parse(body);
    const subscriptionExists = await db.subscription.findFirst({
      where: {
        userId: session.user.id,
        subredditId,
      },
    });
    if (!subscriptionExists) {
      return new Response("You are no subscribed to this subreddit", {
        status: 400,
      });
    }
    // check if user is creator of subreddit

    const subreddit = await db.subreddit.findFirst({
      where: {
        id: subredditId,
        creatorId: session.user.id,
      },
    });
    if (subreddit) {
      return new Response(
        "You cannot unsubscribe from a subreddit you created",
        { status: 400 }
      );
    }

    await db.subscription.delete({
      where: {
        userId_subredditId: {
          subredditId,
          userId: session.user.id,
        },
      },
    });
    return new Response(subredditId);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 422 });
    }

    return new Response("Could not unsubscribe", { status: 500 });
  }
}
