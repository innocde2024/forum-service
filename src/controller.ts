import "express-async-errors";
import { NextFunction, Request, Response } from "express";
import { HttpStatusCode } from "./common/constants";
import service from "./service";
import { RequestCustom } from "./common/types/express";
import App from "@/app";
import Comment from "./databases/model/Comment";
import BadRequestException from "./common/exception/BadRequestException";
import { detectSafeSearch } from "./common/utils/dectectImage";
class Controller {
  async getPosts(request: Request, response: Response, next: NextFunction) {
    const { page = 1, limit = 10, topic } = request.query;
    try {
      const data = await service.getPosts(
        Number(page),
        Number(limit),
        topic as string
      );
      return response.status(HttpStatusCode.OK).json({
        httpStatusCode: HttpStatusCode.OK,
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  async getPostById(request: Request, response: Response, next: NextFunction) {
    const { id } = request.params;
    try {
      const data = await service.getPostById(id);
      if (!data) {
        return response.status(HttpStatusCode.NOT_FOUND).json({
          httpStatusCode: HttpStatusCode.NOT_FOUND,
          message: "Post not found",
        });
      }
      return response.status(HttpStatusCode.OK).json({
        httpStatusCode: HttpStatusCode.OK,
        data,
      });
    } catch (error) {
      next(error);
    }
  }
  async createPost(
    request: RequestCustom,
    response: Response,
    next: NextFunction
  ) {
    const { content, fileUrl, topic } = request.body;
    if (fileUrl) {
      const detections = await detectSafeSearch(fileUrl);
      const detectionMap = {
        adult: "Adult",
        spoof: "Spoof",
        medical: "Medical",
        violence: "Violence",
        racy: "Racy",
      };
      Object.keys(detectionMap).forEach((key, index) => {
        if (
          detections?.[key] === "LIKELY" ||
          detections?.[key] === "VERY_LIKELY"
        ) {
          throw new BadRequestException({
            errorCode: detectionMap[key],
            errorMessage: `Image contains ${detectionMap[key]} content.`,
          });
        }
      });
    }

    const { id } = request.userInfo;
    try {
      const post = await service.createPost({
        content,
        fileUrl,
        author: id,
        topic,
      });
      return response.status(HttpStatusCode.OK).json({
        httpStatusCode: HttpStatusCode.OK,
        data: { post },
      });
    } catch (error) {
      next(error);
    }
  }

  async editPost(
    request: RequestCustom,
    response: Response,
    next: NextFunction
  ) {
    const { id } = request.params;
    const { id: userId } = request.userInfo;
    const { content, fileUrl, topic } = request.body;
    if (fileUrl) {
      const detections = detectSafeSearch(fileUrl);
      const detectionMap = {
        adult: "Adult",
        spoof: "Spoof",
        medical: "Medical",
        violence: "Violence",
        racy: "Racy",
      };
      Object.keys(detectionMap).forEach((key, index) => {
        if (
          detections?.[key] === "LIKELY" ||
          detections?.[key] === "VERY_LIKELY"
        ) {
          throw new BadRequestException({
            errorCode: detectionMap[key],
            errorMessage: `Image contains ${detectionMap[key]} content.`,
          });
        }
      });
    }
    try {
      const updatedPost = await service.editPost(id, userId, {
        content,
        fileUrl,
        topic,
      });
      if (!updatedPost) {
        return response.status(HttpStatusCode.NOT_FOUND).json({
          httpStatusCode: HttpStatusCode.NOT_FOUND,
          message: "Post not found",
        });
      }
      return response.status(HttpStatusCode.OK).json({
        httpStatusCode: HttpStatusCode.OK,
        data: { updatedPost },
      });
    } catch (error) {
      next(error);
    }
  }

  async deletePost(
    request: RequestCustom,
    response: Response,
    next: NextFunction
  ) {
    const { id } = request.params;
    const { id: userId } = request.userInfo;
    try {
      const deletedPost = await service.deletePost(id, userId);
      if (!deletedPost) {
        return response.status(HttpStatusCode.NOT_FOUND).json({
          httpStatusCode: HttpStatusCode.NOT_FOUND,
          message: "Post not found",
        });
      }
      return response.status(HttpStatusCode.OK).json({
        httpStatusCode: HttpStatusCode.OK,
        message: "Post deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  async addComment(
    request: RequestCustom,
    response: Response,
    next: NextFunction
  ) {
    const { postId } = request.params;
    const { content, fileUrl } = request.body;
    if (fileUrl) {
      const detections = await detectSafeSearch(fileUrl);
      const detectionMap = {
        adult: "Adult",
        spoof: "Spoof",
        medical: "Medical",
        violence: "Violence",
        racy: "Racy",
      };
      Object.keys(detectionMap).forEach((key, index) => {
        if (
          detections?.[key] === "LIKELY" ||
          detections?.[key] === "VERY_LIKELY"
        ) {
          throw new BadRequestException({
            errorCode: detectionMap[key],
            errorMessage: `Image contains ${detectionMap[key]} content.`,
          });
        }
      });
    }
    const { id: userId } = request.userInfo;
    try {
      const comment = await service.addComment(postId, {
        content,
        author: userId,
        fileUrl,
      });
      App.io.emit("commentAdded", comment);
      return response.status(HttpStatusCode.OK).json({
        httpStatusCode: HttpStatusCode.OK,
        data: { comment },
      });
    } catch (error) {
      next(error);
    }
  }
  async editComment(
    request: RequestCustom,
    response: Response,
    next: NextFunction
  ) {
    const { id } = request.params;
    const { content, fileUrl } = request.body;
    if (fileUrl) {
      const detections = await detectSafeSearch(fileUrl);
      const detectionMap = {
        adult: "Adult",
        spoof: "Spoof",
        medical: "Medical",
        violence: "Violence",
        racy: "Racy",
      };
      Object.keys(detectionMap).forEach((key, index) => {
        if (
          detections?.[key] === "LIKELY" ||
          detections?.[key] === "VERY_LIKELY"
        ) {
          throw new BadRequestException({
            errorCode: detectionMap[key],
            errorMessage: `Image contains ${detectionMap[key]} content.`,
          });
        }
      });
    }
    const { id: userId } = request.userInfo;
    try {
      const updatedComment = await service.editComment(id, userId, {
        content,
        author: userId,
        fileUrl,
      });
      if (!updatedComment) {
        return response.status(HttpStatusCode.NOT_FOUND).json({
          httpStatusCode: HttpStatusCode.NOT_FOUND,
          message: "Comment not found",
        });
      }
      App.io.emit("commentUpdated", updatedComment);
      return response.status(HttpStatusCode.OK).json({
        httpStatusCode: HttpStatusCode.OK,
        data: { updatedComment },
      });
    } catch (error) {
      next(error);
    }
  }
  // async deleteComment(
  //   request: RequestCustom,
  //   response: Response,
  //   next: NextFunction
  // ) {
  //   const { id } = request.params;
  //   const { id: userId } = request.userInfo;
  //   try {
  //     const comment = await Comment.findOne({ _id: id, author: userId });
  //     if (!comment) {
  //       throw new BadRequestException({
  //         errorCode: "NotFound",
  //         errorMessage: "Comment not found",
  //       });
  //     }
  //     const deletedComment = await service.deleteComment(id, userId);
  //     if (!deletedComment) {
  //       return response.status(HttpStatusCode.NOT_FOUND).json({
  //         httpStatusCode: HttpStatusCode.NOT_FOUND,
  //         message: "Comment not found",
  //       });
  //     }
  //     App.io.emit("commentDeleted", { postId: comment.postId });
  //     return response.status(HttpStatusCode.OK).json({
  //       httpStatusCode: HttpStatusCode.OK,
  //       message: "Comment deleted successfully",
  //     });
  //   } catch (error) {
  //     next(error);
  //   }
  // }
  async addLike(
    request: RequestCustom,
    response: Response,
    next: NextFunction
  ) {
    const { postId } = request.params;
    const { id: userId } = request.userInfo;
    try {
      const like = await service.addLike(postId, userId);
      return response.status(HttpStatusCode.OK).json({
        httpStatusCode: HttpStatusCode.OK,
        data: { like },
      });
    } catch (error) {
      next(error);
    }
  }
}
export default new Controller();
