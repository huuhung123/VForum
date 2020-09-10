import { Request, Response } from "express";
import { FeedService } from "../services/feed.service";
import { IFeedCreateForm } from "../models/feed.model";
import {
  serializeCreateFeed,
  serializeUpdateFeed,
} from "../serializers/feed.serializer";

import { Feed } from "../../../common/model/feed.model";
import { User } from "../../../common/model/user.model";

export class FeedController {
  public feedService: FeedService = new FeedService(Feed);

  getAllFeed = async (req: Request, res: Response) => {
    try {
      const result = await Feed.find({});
      return res.json({ data: result });
    } catch (error) {
      return res.json({ error: error });
    }
  };

  getFeed = async (req: Request, res: Response) => {
    try {
      const { post_id } = req.params;
      const result = await Feed.findById(post_id);
      return res.json({ data: result });
    } catch (error) {
      return res.json({ error: error });
    }
  };

  createFeed = async (req: Request, res: Response) => {
    try {
      // const { role, _id } = req!.session!.user;
      // if (role === "admin" || role === "moderator") {
      //   const form: IFeedCreateForm = req.body;
      //   const check = await Feed.find({ title: form.title });
      //   if (check.length > 0) {
      //     return res.json({ Error: "Title is exist. Please enter again" });
      //   }
      //   // form.createdBy = _id;
      //   const newFeed = await this.feedService.create(form);
      //   User.findByIdAndUpdate(
      //     _id,
      //     {
      //       $push: {
      //         feeds: newFeed,
      //       },
      //     },
      //     {
      //       new: true,
      //       useFindAndModify: false,
      //     }
      //   );
      //   return res.json(serializeCreateFeed(newFeed));
      // }
      // return res.json({ Message: "You cannot create feed" });

      const form: IFeedCreateForm = req.body;
      const check = await Feed.find({ title: form.title });
      if (check.length > 0) {
        return res.json({ Error: "Name is exist. Please enter again" });
      }
      const newFeed = await this.feedService.create(form);
      await User.findByIdAndUpdate(
        "5f54a0fd94273a271497a1d",
        {
          $push: {
            feeds: newFeed,
          },
        },
        {
          new: true,
        }
      );

      return res.json(serializeCreateFeed(newFeed));
    } catch (error) {
      return res.json({ Error: error });
    }
  };

  updateFeed = async (req: Request, res: Response) => {};

  deleteFeed = async (req: Request, res: Response) => {};
}
