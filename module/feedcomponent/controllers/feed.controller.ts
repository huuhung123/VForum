import { Request, Response } from "express";
import { FeedService } from "../services/feed.service";
import { IFeedCreateForm } from "../models/feed.model";
import { serializeFeed } from "../serializers/feed.serializer";
import { Feed } from "../../../common/model/common.model";

export class FeedController {
  public feedService: FeedService = new FeedService(Feed);

  getAllFeed = async (req: Request, res: Response) => {
    try {
      const result = await Feed.find({})
        .populate("commentsPost")
        .populate("likesPost");
      return res.json({ Message: result });
    } catch (error) {
      return res.json({ Message: error });
    }
  };

  getFeed = async (req: Request, res: Response) => {
    try {
      const { post_id } = req.params;
      const result = await Feed.find({ _id: post_id })
        .populate("commentsPost")
        .populate("likesPost");
      return res.json({ Message: result });
    } catch (error) {
      return res.json({ Message: error });
    }
  };

  createFeed = async (req: Request, res: Response) => {
    try {
      const { user_id, topic_id } = req.params;

      const form: IFeedCreateForm = req.body;

      form.createdAt = new Date().toJSON().slice(0, 10).replace(/-/g, "/");
      form.accountId = user_id;
      const post = await this.feedService.create(form);

      // await Topic.findByIdAndUpdate(
      //   topic._id,
      //   {$push: {groups: req.params.group_id }},
      //   {new: true, useFindAndModify: false }
      // )

      await Feed.findByIdAndUpdate(
        topic_id,
        { $push: { posts: post._id } },
      );

      return res.json(serializeFeed(post));
    } catch (error) {
      return res.json({ Error: error });
    }
  };

  deleteFeed = async (req: Request, res: Response) => {};
}
