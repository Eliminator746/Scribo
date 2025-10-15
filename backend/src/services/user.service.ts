import prisma from "../db/index";

async function safeDeleteUser(userId: number) {
  const anonymousUserId = process.env.ANONYMOUS_USER_ID;

  await prisma.post.updateMany({
    where: { user_id: userId },
    data: { user_id: Number(process.env.ANONYMOUS_USER_ID) },
  });

  // Delete the user
  await prisma.user.delete({ where: { user_id: userId } });
  return { success: true };
}

export { safeDeleteUser };
