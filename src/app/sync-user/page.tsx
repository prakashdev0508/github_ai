import { db } from "@/server/db";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { notFound, redirect } from "next/navigation";
import React from "react";

const page = async () => {
  const { userId } = await auth();

  if (!userId) {
    return <div>Not logged in</div>;
  }

  const client = await clerkClient();
  const user = await client.users.getUser(userId);

  if (!user) {
    return notFound();
  }

  await db.user.upsert({
    where: {
      emailAddress: user?.emailAddresses?.[0]?.emailAddress,
    },
    create: {
      id: userId,
      emailAddress: user?.emailAddresses?.[0]?.emailAddress ?? "",
      firstName: user.firstName,
      lastName: user.lastName,
      imageUrl: user.imageUrl,
    },
    update: {
      imageUrl: user.imageUrl,
      lastName: user.lastName,
      firstName: user.firstName,
    },
  });

  return redirect("/dashboard");
};

export default page;
