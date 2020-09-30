import { Request, Response } from "express";
import { FeedService } from "../services/feed.service";
import { IFeedCreateForm, IFeedUpdateForm } from "../models/feed.model";
import {
  serializeCreateFeed,
  serializeUpdateFeed,
} from "../serializers/feed.serializer";

import { Feed } from "../../../common/model/feed.model";

import { success, error } from "../../../common/service/response.service";
import { StatusCode } from "../../../common/model/common.model";
import { RoleCode } from "../../../common/model/user.model";
import { LikeType, Like } from "../../../common/model/like.model";
import { CommentFeed } from "../../../common/model/commentfeed.model";

import { Types } from "mongoose";

export class FeedController {
  public feedService: FeedService = new FeedService(Feed);

  getAllFeed = async (req: Request, res: Response) => {
    try {
      const { _id } = req.params;
      console.log(_id);
      const result = await Feed.find(
        { status: StatusCode.Active },
        "description countLike flags countCommentFeed commentsFeed createdBy createdAt userId attachments gender avatar"
      ).sort({
        updatedAt: -1,
      });
      return success(res, result);
    } catch (err) {
      return error(res, err, 200);
    }
  };

  getFeed = async (req: Request, res: Response) => {
    try {
      const { feed_id } = req.params;
      const result = await Feed.find(
        {
          _id: feed_id,
          status: StatusCode.Active,
        },
        "description countLike flags countCommentFeed commentsFeed createdBy createdAt userId attachments gender avatar"
      );
      return success(res, result);
    } catch (err) {
      return error(res, err, 200);
    }
  };

  createFeed = async (req: Request, res: Response) => {
    try {
      const { _id, display_name, avatar, gender } = req.authorized_user;
      const formFeed: IFeedCreateForm = req.body;
      const check = await Feed.find({
        description: formFeed.description,
        status: StatusCode.Active,
      });
      if (check.length > 0) {
        const messageError =
          "Description has been existed. Please enter description again";
        return error(res, messageError, 200);
      }

      formFeed.createdBy = display_name;
      formFeed.userId = _id;
      formFeed.avatar = avatar;
      formFeed.gender = gender;

      const feed = await this.feedService.create(formFeed);

      const newLike = new Like({
        likeType: LikeType.Feed,
        likeReferenceId: feed._id,
      });
      await newLike.save();

      const messageSuccess = "You have been created feed successfully";
      return success(res, serializeCreateFeed(feed), messageSuccess);
    } catch (err) {
      return error(res, err, 200);
    }
  };

  updateFeed = async (req: Request, res: Response) => {
    try {
      const { display_name } = req.authorized_user;
      const { feed_id } = req.params;

      const check: any = await Feed.find({
        _id: feed_id,
        status: StatusCode.Active,
      });

      if (check.length === 0) {
        const messageError = "Feed has been deleted. You can not Feed";
        return error(res, messageError, 200);
      }

      if (check[0].createdBy !== display_name) {
        const messageError = "You cannot update feed, you aren't owner of feed";
        return error(res, messageError, 200);
      }

      const formFeed: IFeedUpdateForm = req.body;
      const arr = await Feed.find({
        description: formFeed.description,
      });

      if (check[0].description === formFeed.description || arr.length > 0) {
        const messageError = "Sorry!. Please enter description again";
        return error(res, messageError, 200);
      }

      const newFeed: any = await Feed.findByIdAndUpdate(
        feed_id,
        {
          $set: {
            description: formFeed.description,
            // updatedBy: display_name,
            attachments: formFeed.attachments,
            isUpdated: true,
          },
        },
        {
          new: true,
          useFindAndModify: false,
        }
      );
      const messageSuccess = "Feed have updated successfully";
      return success(res, serializeUpdateFeed(newFeed), messageSuccess);
    } catch (err) {
      return error(res, err, 200);
    }
  };

  addLike = async (req: Request, res: Response) => {
    try {
      const { feed_id } = req.params;
      const { _id } = req.authorized_user;

      const check: any = await Feed.find({
        _id: feed_id,
        status: StatusCode.Active,
      });

      if (check.length === 0) {
        const messageError = "Feed has been deleted. You can not add like";
        return error(res, messageError, 200);
      }

      await Feed.updateOne(
        { _id: feed_id },
        {
          $inc: { countLike: 1 },
        }
      );

      await Feed.updateOne(
        { _id: feed_id },
        {
          $addToSet: {
            flags: _id,
          },
        }
      );

      const result = await Feed.find(
        {
          _id: feed_id,
        },
        "description countLike countCommentFeed commentsFeed createdBy createdAt"
      );
      return success(res, result);
    } catch (err) {
      return error(res, "Error", 200);
    }
  };

  minusLike = async (req: Request, res: Response) => {
    try {
      const { feed_id } = req.params;
      const { _id } = req.authorized_user;

      const check: any = await Feed.find({
        _id: feed_id,
        status: StatusCode.Active,
      });

      if (check.length === 0) {
        const messageError = "Feed has been deleted. You can not minus like";
        return error(res, messageError, 200);
      }

      await Feed.updateOne(
        { _id: feed_id },
        {
          $inc: { countLike: -1 },
        }
      );

      await Feed.updateOne(
        { _id: feed_id },
        {
          $pull: {
            flags: Types.ObjectId(_id),
          },
        }
      );

      const result = await Feed.find(
        {
          _id: feed_id,
        },
        "description countLike countCommentFeed commentsFeed createdBy createdAt"
      );
      return success(res, result);
    } catch (err) {
      return error(res, "Error", 200);
    }
  };

  deleteFeed = async (req: Request, res: Response) => {
    try {
      const { display_name, role } = req.authorized_user;
      const { feed_id } = req.params;

      const check: any = await Feed.find({
        _id: feed_id,
        status: StatusCode.Active,
      });
      if (check.length === 0) {
        const messageError = "Feed has been deleted. You can not delete";
        return error(res, messageError, 200);
      }
      if (
        role === RoleCode.Admin ||
        check[0].createdBy === display_name ||
        role === RoleCode.Moderator
      ) {
        await Feed.findByIdAndUpdate(feed_id, {
          $set: {
            status: StatusCode.Deactive,
          },
        });

        await this.feedService.callbackDeleteCommentPost(feed_id);

        const arr: any = await CommentFeed.find({ feedId: feed_id });

        await Feed.updateOne(
          { _id: feed_id },
          {
            $set: {
              commentsFeed: arr,
            },
          }
        );
        const messageSuccess = "You deleted feed successfully";
        return success(res, null, messageSuccess);
      }
      const messageError = "You cannot deleted feed";
      return error(res, messageError, 200);
    } catch (err) {
      return error(res, err, 200);
    }
  };
}
