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
      });
      return success(res, result);
    } catch (err) {
      return error(res, err);
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
      return error(res, err);
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
        return error(res, messageError);
      }

      formComment.createdBy = display_name;
      formComment.postId = post_id;

      const commentpost = await this.commentPostService.create(formComment);

      await Post.findByIdAndUpdate(post_id, {
        $push: { commentsPost: commentpost },
      });

      const messageSuccess = "You have been created commentpost successfully";
      return success(res, serialCreateCommentPost(commentpost), messageSuccess);
    } catch (err) {
      return error(res, err);
    }
  };

  updateCommentPost = async (req: Request, res: Response) => {
    try {
      const { _id } = req.authorized_user;
      const { post_id, comment_id } = req.params;

      const check: any = await CommentPost.find({
        _id: comment_id,
        status: StatusCode.Active,
      });
      if (check.length === 0) {
        const messageError = "CommentPost has been deleted. You can not update";
        return error(res, messageError);
      }
      if (_id !== check.createdAt) {
        const messageError = "You cannot update commentpost";
        return error(res, messageError);
      }

      const form: ICommentPostUpdateForm = req.body;
      if (check.description === form.description) {
        const messageError = "Sorry!. Please enter description again";
        return error(res, messageError);
      }

      const newCommentPost: any = await CommentPost.findByIdAndUpdate(
        comment_id,
        {
          $set: {
            description: req.body.description,
            updatedBy: _id,
          },
        },
        {
          new: true,
          useFindAndModify: false,
        }
      );

      await Post.updateOne(
        { _id: post_id, "commentsPost._id": comment_id },
        {
          $set: {
            "commentsPost.$": newCommentPost,
          },
        }
      );
      const messageSuccess = "Comment post have updated successfully";
      return success(
        res,
        serialUpdateCommentPost(newCommentPost),
        messageSuccess
      );
    } catch (err) {
      return error(res, err);
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
        return error(res, messageError);
      }

      if (role === RoleCode.Admin || _id === check._id) {
        const newCommentPost = await CommentPost.findByIdAndUpdate(comment_id, {
          $set: {
            status: StatusCode.Deactive,
          },
        });

        await Post.updateOne(
          { _id: post_id, "commentsPost._id": comment_id },
          {
            $set: {
              "commentsPost.$": newCommentPost,
            },
          }
        );

        const messageSuccess = "Deleted successfully";
        return success(res, null, messageSuccess);
      }
      const messageError = "You cannot deleted commentpost";
      return error(res, messageError);
    } catch (err) {
      return error(res, err);
    }
  };
}
