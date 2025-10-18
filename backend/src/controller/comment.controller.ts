import { RequestHandler } from "express";

//------------------------------------------------------------------------------------------------------------------------
//                                        Add Comment Logic
//------------------------------------------------------------------------------------------------------------------------

// 1. Check if post exists or not with this post_id
// 2. If it's a reply, validate the parent comment
// 3. Check post_id of parent_comment_id, is same as post_id sent by user
// 4. Create comment

//------------------------------------------------------------------------------------------------------------------------
export const addComment: RequestHandler = async (req, res) => {
  const { comment_text, status, post_id, parent_comment_id } = req.body;
  const user_id = (req as any).user.user_id;

  if (!comment_text || !post_id)
    return res.status(400).json({ message: "Missing required fields" });

  const postExists = await prisma?.post.findUnique({
    where: { post_id },
  });

  if (!postExists) return res.send("Post not found");

  let parentId: number | null = null;
  if (parent_comment_id) {
    const parent = await prisma?.comment.findUnique({
      where: { comment_id: Number(parent_comment_id) },
    });

    if (!parent)
      return res.status(404).json({
        message:
          "Parent comment not found, you've entered wrong parent_comment id",
      });

    if (parent?.post_id != post_id)
      return res.status(400).send("You are replying to wrong post");

    parentId = Number(parent_comment_id);
  }

  const newComment = await prisma?.comment.create({
    data: {
      comment_text,
      post_id: Number(post_id),
      user_id: Number(user_id),
      parent_comment_id: parentId,
    },
    include: {
      user: { select: { user_id: true, username: true } },
    },
  });

  return res.status(201).json(newComment);
};

//------------------------------------------------------------------------------------------------------------------------
//                                        Get Comment Logic
//------------------------------------------------------------------------------------------------------------------------

// 1. Check if post exists or not with this post_id
// 2. Find all comments -> Flat data followed

//------------------------------------------------------------------------------------------------------------------------
export const getPostComments: RequestHandler = async (req, res) => {
  const { postId } = req.params;
  const { limit = 5, page = 1 } = req.query;

  let start = Number(limit) * (Number(page) - 1);

  const postExists = await prisma?.post.findUnique({
    where: { post_id: Number(postId) },
  });

  if (!postExists) {
    return res.status(404).json({ message: "Post not found" });
  }

  const comments = await prisma?.comment.findMany({
    skip: start,
    take: Number(limit),
    orderBy: { created_at: "desc" },
    where: { post_id: Number(postId) },
    include: {
      user: {
        select: { user_id: true, username: true },
      },
    },
  });
  return res
    .status(200)
    .json({ comments, page: Number(page), limit: Number(limit) });
};

//------------------------------------------------------------------------------------------------------------------------
//                                        Update Comment Logic
//------------------------------------------------------------------------------------------------------------------------

// 1. Check if comment exists + authors want to change
// 2. Update comment

//------------------------------------------------------------------------------------------------------------------------
export const updateComment: RequestHandler = async (req, res) => {
  const { id: comment_id } = req.params;
  const { comment_text } = req.body;

  const comment = await prisma?.comment.findUnique({
    where: { comment_id: Number(comment_id) },
  });

  if (!comment) {
    return res.send("Comment doesn't exists");
  }

  if (comment.user_id != (req as any).user.user_id)
    return res.send("Author can only change it's comment");

  const updatedComment = await prisma?.comment.update({
    where: { comment_id: Number(comment_id) },
    data: {
      comment_text: String(comment_text),
    },
    include: {
      user: {
        select: {
          user_id: true,
        },
      },
    },
  });

  return res.status(200).json({ updatedComment });
};

export const deleteComment: RequestHandler = async (req, res) => {
  const { id: comment_id } = req.params;
  const comment = await prisma?.comment.findUnique({
    where: { comment_id: Number(comment_id) },
  });

  if (!comment) return res.status(404).send("This comment doesn't exists");

  if (comment.user_id != (req as any).user.user_id)
    return res
      .status(403)
      .json({ message: "Only the author can delete this comment." });

  const deletedComment = await prisma?.comment.delete({
    where: { comment_id: Number(comment_id) },
  });

  return res
    .status(200)
    .json({ message: "Comment deleted successfully", deletedComment });
};
