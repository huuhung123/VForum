import { Request, Response } from "express";
import { CommentFeedService } from "../services/commentfeed.service";
import { ICommentFeedCreateForm } from "../models/commentfeed.model";
import { serializeCommentFeed } from "../serializers/commentfeed.serializer";
import { CommentFeed } from "../../../common/model/commentfeed.model"

export class CommentFeedController {
  public commentfeedService: CommentFeedService = new CommentFeedService(
    CommentFeedService
  );



  getAllCommentFeed = async (req: Request, res: Response) => {
    try {
      const result = await CommentFeed.find({}).populate("topics");
      return res.json({ Message: result });
    } catch (error) {
      return res.json({ Message: error });
    }
  };

  getCommentFeed = async (req: Request, res: Response) => {
    try {
      const { group_id } = req.params;
      const result = await CommentFeed.find({ _id: group_id }).populate(
        "topics"
      );
      return res.json({ Message: result });
    } catch (error) {
      return res.json({ Message: error });
    }
  };

  createCommentFeed = async (req: Request, res: Response) => {
    try {
      const formGroup: ICommentFeedCreateForm = req.body;

      formGroup.createdAt = new Date().toJSON().slice(0, 10).replace(/-/g, "/");
      const group = await this.commentfeedService.create(formGroup);

      return res.json(serializeCommentFeed(group));
    } catch (error) {
      return res.json({ Message: error });
    }
  };

  deleteCommentFeed = async (req: Request, res: Response) => {
    try {
      const { group_id } = req.params;
      await CommentFeed.findByIdAndUpdate(group_id, {
        $pull: { topics: {} },
      });
    } catch (error) {}
  };
}
