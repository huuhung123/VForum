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

export class CommentPostController {
  public commentPostService: CommentPostService = new CommentPostService(
    CommentPost
  );

  getAllCommentPost = async (req: Request, res: Response) => {
    try {
      const result = await CommentPost.find({ status: StatusCode.Active });
      return res.json({ data: result });
    } catch (error) {
      return res.json({ error: error });
    }
  };

  getCommentPost = async (req: Request, res: Response) => {
    try {
      const { comment_id } = req.params;
      const result = await CommentPost.find({
        _id: comment_id,
        status: StatusCode.Active,
      });
      return res.json({ data: result });
    } catch (error) {
      return res.json({ error: error });
    }
  };

  createCommentPost = async (req: Request, res: Response) => {
    try {
      const { _id } = req.authorized_user;
      const { post_id } = req.params;
      const formComment: ICommentPostCreateForm = req.body;

      formComment.createdBy = _id;
      formComment.postId = post_id;

      const commentpost = await this.commentPostService.create(formComment);

      await Post.findByIdAndUpdate(post_id, {
        $push: { commentsPost: commentpost },
      });

      return res.json({ message: "You have created commentpost successfully" });
      // return res.json(serialCreateCommentPost(commentpost));
    } catch (error) {
      return res.json({ error: error });
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
        return res.json({
          error: "CommentPost has been deleted. You can not update",
        });
      }
      if (_id !== check.createdAt) {
        return res.json({ error: "You cannot update commentpost" });
      }

      const form: ICommentPostUpdateForm = req.body;
      if (check.description === form.description) {
        return res.json({ error: "Sorry!. Please enter description again" });
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

      return res.json({
        message: "You have been updated commentpost successfully",
      });
      // return res.json(serialUpdateCommentPost(newCommentPost));
    } catch (error) {
      return res.json({ error: error });
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
        return res.json({
          error: "CommentPost has been deleted. You can not delete",
        });
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

        return res.json({ message: "Deleted successfully" });
      }
      return res.json({ error: "You cannot deleted commentpost" });
    } catch (error) {
      return res.json({ error: error });
    }
  };
}
