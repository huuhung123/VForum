import { Request, Response } from "express";
import { CommentFeedService } from "../services/commentfeed.service";
import {
  ICommentFeedCreateForm,
  ICommentFeedUpdateForm,
} from "../models/commentfeed.model";
import {
  serializeCommentFeed,
  serialUpdateCommentFeed,
} from "../serializers/commentfeed.serializer";
import { CommentFeed } from "../../../common/model/commentfeed.model";
import { Feed } from "../../../common/model/feed.model";
import { RoleCode } from "../../../common/model/user.model";
import { StatusCode } from "../../../common/model/common.model";
import { Like } from "../../../common/model/like.model";

import { LikeType } from "../../../common/model/like.model";
import { success, error } from "../../../common/service/response.service";

import { Types } from "mongoose";
export class CommentFeedController {
  public commentfeedService: CommentFeedService = new CommentFeedService(
    CommentFeed
  );

  getAllCommentFeed = async (req: Request, res: Response) => {
    try {
      const { feed_id } = req.params;
      const result = await CommentFeed.find({
        feedId: feed_id,
        status: StatusCode.Active,
      }).sort({ updatedAt: -1 });
      return success(res, result);
    } catch (err) {
      return error(res, err, 200);
    }
  };

  getCommentFeed = async (req: Request, res: Response) => {
    try {
      const { comment_id } = req.params;
      const result = await CommentFeed.find({
        _id: comment_id,
        status: StatusCode.Active,
      });
      return success(res, result);
    } catch (err) {
      return error(res, err, 200);
    }
  };

  createCommentFeed = async (req: Request, res: Response) => {
    try {
      const { display_name, _id } = req.authorized_user;
      const { feed_id } = req.params;
      const formComment: ICommentFeedCreateForm = req.body;

      const check = await CommentFeed.find({
        description: formComment.description,
        status: StatusCode.Active,
      });
      if (check.length > 0) {
        const messageError =
          "CommentFeed has been existed. Please enter commentfeed again";
        return error(res, messageError, 200);
      }

      formComment.createdBy = display_name;
      formComment.feedId = feed_id;
      formComment.userId = _id;

      const commentfeed = await this.commentfeedService.create(formComment);

      await Feed.findByIdAndUpdate(feed_id, {
        $push: { commentsFeed: commentfeed },
        $inc: { countCommentFeed: 1 },
      });

      const newLike = new Like({
        likeType: LikeType.CommentFeed,
        likeReferenceId: commentfeed._id,
      });
      await newLike.save();

      const messageSuccess = "You have been created commentfeed successfully";
      return success(res, serializeCommentFeed(commentfeed), messageSuccess);
    } catch (err) {
      return error(res, err, 200);
    }
  };

  updateCommentFeed = async (req: Request, res: Response) => {
    try {
      const { display_name } = req.authorized_user;
      const { comment_id } = req.params;

      const check: any = await CommentFeed.find({
        _id: comment_id,
        status: StatusCode.Active,
      });
      if (check.length === 0) {
        const messageError = "Commentfeed has been deleted. You can not update";
        return error(res, messageError, 200);
      }
      if (display_name !== check[0].createdBy) {
        const messageError = "You cannot update commentfeed";
        return error(res, messageError, 200);
      }

      const form: ICommentFeedUpdateForm = req.body;
      if (check[0].description === form.description) {
        const messageError = "Sorry!. Please enter description again";
        return error(res, messageError, 200);
      }

      const newCommentFeed: any = await CommentFeed.findByIdAndUpdate(
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

      const messageSuccess = "Comment feed have updated successfully";
      return success(
        res,
        serialUpdateCommentFeed(newCommentFeed),
        messageSuccess
      );
    } catch (err) {
      return error(res, err, 200);
    }
  };

  addLike = async (req: Request, res: Response) => {
    try {
      const { comment_id } = req.params;
      const { _id } = req.authorized_user;

      const check: any = await CommentFeed.find({
        _id: comment_id,
        status: StatusCode.Active,
      });

      if (check.length === 0) {
        const messageError =
          "CommentFeed has been deleted. You can not add like";
        return error(res, messageError, 200);
      }

      await CommentFeed.updateOne(
        { _id: comment_id },
        {
          $inc: { countLike: 1 },
        }
      );

      await CommentFeed.updateOne(
        { _id: comment_id },
        {
          $addToSet: { flags: _id },
        }
      );

      const result = await CommentFeed.find({
        _id: comment_id,
      });
      return success(res, result);
    } catch (err) {
      return error(res, "Error", 200);
    }
  };

  minusLike = async (req: Request, res: Response) => {
    try {
      const { comment_id } = req.params;
      const { _id } = req.authorized_user;

      const check: any = await CommentFeed.find({
        _id: comment_id,
        status: StatusCode.Active,
      });

      if (check.length === 0) {
        const messageError =
          "CommentFeed has been deleted. You can not minus like";
        return error(res, messageError, 200);
      }

      await CommentFeed.updateOne(
        { _id: comment_id },
        {
          $inc: { countLike: -1 },
        }
      );

      await CommentFeed.updateOne(
        { _id: comment_id },
        {
          $pull: {
            flags: Types.ObjectId(_id),
          },
        }
      );

      const result = await CommentFeed.find({
        _id: comment_id,
      });
      return success(res, result);
    } catch (err) {
      return error(res, "Error", 200);
    }
  };

  deleteCommentFeed = async (req: Request, res: Response) => {
    try {
      const { _id, role } = req.authorized_user;
      const { feed_id, comment_id } = req.params;

      const check: any = await CommentFeed.find({
        _id: comment_id,
        status: StatusCode.Active,
      });
      if (check.length === 0) {
        const messageError = "CommentFeed has been deleted. You can not delete";
        return error(res, messageError, 200);
      }
      if (
        role === RoleCode.Admin ||
        _id === check._id ||
        role === RoleCode.Moderator
      ) {
        await Feed.updateOne(
          { _id: feed_id },
          {
            $inc: { countCommentFeed: -1 },
          }
        );

        const messageSuccess = "Deleted successfully";
        return success(res, null, messageSuccess);
      }
      const messageError = "You cannot deleted commentfeed";
      return error(res, messageError, 200);
    } catch (err) {
      return error(res, err, 200);
    }
  };
}
