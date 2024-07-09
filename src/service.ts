import BadRequestException from "./common/exception/BadRequestException";
import Comment, { IComment } from "./databases/model/Comment";
import Like, { ILike } from "./databases/model/Like";
import Post, { IPost } from "./databases/model/Post";
class Service {
  async getPosts(page: number, limit: number) {
    const skip = (page - 1) * limit;
    const posts = await Post.find()
      .skip(skip)
      .limit(limit)
      .populate({ path: "comments", model: Comment })
      .populate({ path: "likes", model: Like })
      .exec();
    const total = await Post.countDocuments();
    return { posts, total, page, limit };
  }
  async getPostById(postId: string) {
    const post = await Post.findById(postId)
      .populate({ path: "comments", model: Comment })
      .populate({ path: "likes", model: Like })
      .exec();
    return post;
  }
  async createPost({ content, fileUrl, author, topic }: Partial<IPost>) {
    const post = new Post({
      content,
      fileUrl,
      author,
      topic,
    });
    return await post.save();
  }
  async editPost(id: string, userId: string, updateData: Partial<IPost>) {
    return await Post.findOneAndUpdate(
      { _id: id, author: userId },
      updateData,
      {
        new: true,
      }
    );
  }
  async deletePost(id: string, userId: string) {
    return await Post.findOneAndDelete({ _id: id, author: userId });
  }

  async addComment(postId: string, commentData: Partial<IComment>) {
    const comment = new Comment({ postId, ...commentData });
    await comment.save();

    await Post.findByIdAndUpdate(postId, {
      $push: { comments: comment._id },
    });

    return comment;
  }

  async addLike(postId: string, userId: string) {
    const likeExist = await Like.findOne({ postId, userId });
    if (!likeExist) {
      const like = new Like({ postId, userId });
      const newLike = await like.save();

      await Post.findByIdAndUpdate(postId, {
        $push: { likes: like._id },
      });
      return newLike;
    }
    await likeExist.deleteOne();
    await Post.findByIdAndUpdate(postId, {
      $pull: { likes: likeExist._id },
    });
  }

  async editComment(
    commentId: string,
    userId: string,
    updateData: Partial<IComment>
  ) {
    return await Comment.findOneAndUpdate(
      { _id: commentId, author: userId },
      updateData,
      {
        new: true,
      }
    );
  }

  async deleteComment(commentId: string, userId: string) {
    console.log(commentId + " " + userId);
    const comment = await Comment.findOne({ _id: commentId, author: userId });

    if (!comment) {
      throw new BadRequestException({
        errorCode: "NotFound",
        errorMessage: "Comment not found",
      });
    }
    await Post.findOneAndUpdate(
      { _id: comment.postId, author: userId },
      {
        $pull: { comments: commentId },
      }
    );
    return await comment.deleteOne();
  }
}
export default new Service();
