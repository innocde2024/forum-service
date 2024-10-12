import { authMiddleware } from "@/common/middlewares/auth.middleware";
import controller from "@/controller";
import { Router } from "express";
const router = Router();
router.get("/forum/posts", controller.getPosts);
router.get("/forum/posts/:id", controller.getPostById);
router.post("/forum/post", authMiddleware, controller.createPost);
router.delete("/forum/post/:id", authMiddleware, controller.deletePost);
router.put("/forum/post/:id", authMiddleware, controller.editPost);
router.post(
  "/forum/post/comment/:postId",
  authMiddleware,
  controller.addComment
);
router.put("/forum/post/comment/:id", authMiddleware, controller.editComment);
// router.delete(
//   "/forum/post/comment/:postId",
//   authMiddleware,
//   controller.deleteComment
// );
router.post("/forum/post/like/:postId", authMiddleware, controller.addLike);
export default router;
