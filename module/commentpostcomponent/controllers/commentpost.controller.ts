import { Request, Response } from "express";
import { CommentPostService } from "../services/commentpost.service";
import {
  ICommentPostCreateForm,
  ICommentPostUpdateForm,
} from "../models/commentpost.model";
import {
  serialCreateCommentPost,
  serialUpdateCommentPost,
} from "../serializers/commentpost.serializer";

import { CommentPost } from "../../../common/model/commentpost.model";
import { Post } from "../../../common/model/post.model";
import { RoleCode } from "../../../common/model/user.model";
import { StatusCode } from "../../../common/model/common.model";
import { Like } from "../../../common/model/like.model";

import { LikeType } from "../../../common/model/like.model";
import { success, error } from "../../../common/service/response.service";

export class CommentPostController {
  public commentPostService: CommentPostService = new CommentPostService(
    CommentPost
  );

  getAllCommentPost = async (req: Request, res: Response) => {
    try {
      const { post_id } = req.params;
      const result = await CommentPost.find({
        status: StatusCode.Active,
        postId: post_id,
      }).sort({ updatedAt: -1 });
      return success(res, result);
    } catch (err) {
      return error(res, err, 200);
    }
  };

  getCommentPost = async (req: Request, res: Response) => {
    try {
      const { comment_id, post_id } = req.params;
      const result = await CommentPost.find({
        _id: comment_id,
        status: StatusCode.Active,
        postId: post_id,
      });
      return success(res, result);
    } catch (err) {
      return error(res, err, 200);
    }
  };

  createCommentPost = async (req: Request, res: Response) => {
    try {
      const { _id, display_name } = req.authorized_user;
      const { post_id } = req.params;
      const formComment: ICommentPostCreateForm = req.body;

      const check = await CommentPost.find({
        description: formComment.description,
        status: StatusCode.Active,
      });
      if (check.length > 0) {
        const messageError =
          "CommentPost has been existed. Please enter commentpost again";
        return error(res, messageError, 200);
      }

      formComment.createdBy = display_name;
      formComment.postId = post_id;

      const commentpost = await this.commentPostService.create(formComment);

      await Post.findByIdAndUpdate(post_id, {
        $push: { commentsPost: commentpost },
        $inc: { countCommentPost: 1 },
      });

      const newLike = new Like({
        likeType: LikeType.CommentPost,
        likeReferenceId: commentpost._id,
      });
      await newLike.save();

      const messageSuccess = "You have been created commentpost successfully";
      return success(res, serialCreateCommentPost(commentpost), messageSuccess);
    } catch (err) {
      return error(res, err, 200);
    }
  };

  updateCommentPost = async (req: Request, res: Response) => {
    try {
      const { _id, display_name } = req.authorized_user;
      const { post_id, comment_id } = req.params;

      const check: any = await CommentPost.find({
        _id: comment_id,
        status: StatusCode.Active,
      });
      if (check.length === 0) {
        const messageError = "CommentPost has been deleted. You can not update";
        return error(res, messageError, 200);
      }
      if (display_name !== check[0].createdBy) {
        const messageError = "You cannot update commentpost";
        return error(res, messageError, 200);
      }

      const form: ICommentPostUpdateForm = req.body;
      if (check[0].description === form.description) {
        const messageError = "Sorry!. Please enter description again";
        return error(res, messageError, 200);
      }

      const newCommentPost: any = await CommentPost.findByIdAndUpdate(
        comment_id,
        {
          $set: {
            description: req.body.description,
            isUpdated: true,
          },
        },
        {
          new: true,
          useFindAndModify: false,
        }
      );

      const messageSuccess = "Comment post have updated successfully";
      return success(
        res,
        serialUpdateCommentPost(newCommentPost),
        messageSuccess
      );
    } catch (err) {
      return error(res, err, 200);
    }
  };

  addLike = async (req: Request, res: Response) => {
    try {
      const { post_id, comment_id } = req.params;

      const check: any = await CommentPost.find({
        _id: comment_id,
        status: StatusCode.Active,
      });

      if (check.length === 0) {
        const messageError =
          "CommentPost has been deleted. You can not add like";
        return error(res, messageError, 200);
      }

      await CommentPost.updateOne(
        { _id: comment_id },
        {
          $inc: { countLike: 1 },
        }
      );

      const result = await CommentPost.find({
        _id: comment_id,
      });
      return success(res, result);
    } catch (err) {
      return error(res, err, 200);
    }
  };

  minusLike = async (req: Request, res: Response) => {
    try {
      const { post_id, comment_id } = req.params;

      const check: any = await CommentPost.find({
        _id: comment_id,
        status: StatusCode.Active,
      });

      if (check.length === 0) {
        const messageError =
          "CommentPost has been deleted. You can not minus like";
        return error(res, messageError, 200);
      }

      await CommentPost.updateOne(
        { _id: comment_id },
        {
          $inc: { countLike: -1 },
        }
      );

      const result = await CommentPost.find({
        _id: comment_id,
      });
      return success(res, result);
    } catch (err) {
      return error(res, err, 200);
    }
  };

  deleteCommentPost = async (req: Request, res: Response) => {
    try {
      const { _id, role } = req.authorized_user;
      const { post_id, comment_id } = req.params;

      const check: any = await CommentPost.find({
        _id: comment_id,
        status: StatusCode.Active,
      });
      if (check.length === 0) {
        const messageError = "CommentPost has been deleted. You can not delete";
        return error(res, messageError, 200);
      }
      if (
        role === RoleCode.Admin ||
        _id === check._id ||
        role === RoleCode.Moderator
      ) {
        const newCommentPost = await CommentPost.findByIdAndUpdate(comment_id, {
          $set: {
            status: StatusCode.Deactive,
          },
        });

        await Post.updateOne(
          { _id: post_id },
          {
            $inc: { countCommentPost: -1 },
          }
        );

        const messageSuccess = "Deleted successfully";
        return success(res, null, messageSuccess);
      }
      const messageError = "You cannot deleted commentpost";
      return error(res, messageError, 200);
    } catch (err) {
      return error(res, err, 200);
    }
  };
}
