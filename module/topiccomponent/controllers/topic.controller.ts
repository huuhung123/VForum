import { Request, Response } from "express";
import { TopicService } from "../services/topic.service";
import { ITopicCreateForm, ITopicUpdateForm } from "../models/topic.model";
import {
  serializeCreateTopic,
  serializeUpdateTopic,
} from "../serializers/topic.serializer";

import { Topic } from "../../../common/model/topic.model";
import { Group } from "../../../common/model/group.model";
import { StatusCode } from "../../../common/model/common.model";
import { RoleCode } from "../../../common/model/user.model";
import { count } from "console";

export class TopicController {
  public topicService: TopicService = new TopicService(Topic);

  getAllTopic = async (req: Request, res: Response) => {
    try {
      const result = await Topic.find({ status: StatusCode.Active }).populate(
        "posts"
      );
      return res.json({ data: result });
    } catch (error) {
      return res.json({ Message: error });
    }
  };

  getTopic = async (req: Request, res: Response) => {
    try {
      const { topic_id } = req.params;
      const result = await Topic.find({
        _id: topic_id,
        status: StatusCode.Active,
      }).populate("posts");
      return res.json({ data: result });
    } catch (error) {
      return res.json({ Message: error });
    }
  };

  createTopic = async (req: Request, res: Response) => {
    try {
      const { userId, role } = res.locals.user;
      if (role === RoleCode.Member) {
        return res.json({ Error: "You cannot create topic" });
      }
      const { group_id } = req.params;
      const formTopic: ITopicCreateForm = req.body;
      const check = await Topic.find({ name: formTopic.name });

      if (check.length > 0) {
        return res.json({ Error: "Name is exist. Please enter again" });
      }

      formTopic.createdBy = userId;
      const topic = await this.topicService.create(formTopic);

      await Group.findByIdAndUpdate(group_id, {
        $push: { topics: topic },
      });

      return res.json(serializeCreateTopic(topic));
    } catch (error) {
      return res.json({ Message: error });
    }
  };

  updateTopic = async (req: Request, res: Response) => {
    try {
      const { userId, role } = res.locals.user;
      if (role === RoleCode.Member) {
        return res.json({ Error: "You cannot create topic" });
      }

      const { group_id, topic_id } = req.params;

      const check: any = await Topic.find({
        _id: topic_id,
        status: StatusCode.Active,
      });
      if (check.length === 0) {
        return res.json({
          Error: "Topic has been deleted. You can not update",
        });
      }

      if (userId !== check.createdAt) {
        return res.json({ Error: "You cannot update topic" });
      }

      const formTopic: ITopicUpdateForm = req.body;
      if (check.name === formTopic.name) {
        return res.json({ Error: "Sorry!. Please enter name again" });
      }

      const newTopic: any = await Topic.findByIdAndUpdate(
        topic_id,
        {
          $set: {
            name: formTopic.name,
            description: formTopic.description,
            updatedBy: userId,
          },
        },
        {
          new: true,
          useFindAndModify: false,
        }
      );

      await Group.updateOne(
        { _id: group_id, "topics._id": topic_id },
        {
          $set: {
            "topics.$": newTopic,
          },
        }
      );

      return res.json(serializeUpdateTopic(newTopic));
    } catch (error) {
      return res.json(error);
    }
  };

  deleteTopic = async (req: Request, res: Response) => {
    try {
      const { _id, role } = res.locals.user;
      const { group_id, topic_id } = req.params;

      const check: any = await Topic.find({
        _id: topic_id,
        status: StatusCode.Active,
      });
      if (check.length === 0) {
        return res.json({
          Error: "Topic has been deleted. You can not delete",
        });
      }

      if (
        role === RoleCode.Admin ||
        role === RoleCode.Moderator ||
        _id === check.createdAt
      ) {
        const check = await Topic.aggregate()
          .match({ _id: topic_id })
          .project({ posts: 1 })
          .unwind("$posts")
          .group({ _id: "$status", count: { $sum: 1 } });

        check.sort((d1, d2) => d1._id - d2._id);

        if (check[0] !== 0) {
          return res.json({ Error: "You can deleted all post in topic" });
        }

        const newTopic = await Topic.findByIdAndUpdate(topic_id, {
          $set: {
            status: StatusCode.Deactive,
          },
        });

        await Group.updateOne(
          { _id: group_id, "topics._id": topic_id },
          {
            $set: {
              "topics.$": newTopic,
            },
          }
        );

        return res.json({ Message: "Deleted successfully" });
      }
      return res.json({ Message: "You cannot deleted topic" });
    } catch (error) {
      return res.json({ Message: error });
    }
  };
}
