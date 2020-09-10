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

export class TopicController {
  public topicService: TopicService = new TopicService(Topic);

  getAllTopic = async (req: Request, res: Response) => {
    try {
      const result = await Topic.find({ status: StatusCode.Active });
      return res.json({ data: result });
    } catch (error) {
      return res.json({ error: error });
    }
  };

  getTopic = async (req: Request, res: Response) => {
    try {
      const { topic_id } = req.params;
      const result = await Topic.find({
        _id: topic_id,
        status: StatusCode.Active,
      });
      return res.json({ data: result });
    } catch (error) {
      return res.json({ error: error });
    }
  };

  createTopic = async (req: Request, res: Response) => {
    try {
      const { _id, role } = req.authorized_user;
      if (role === RoleCode.Member) {
        return res.json({ error: "You cannot create topic" });
      }
      const { group_id } = req.params;
      const formTopic: ITopicCreateForm = req.body;
      const check = await Topic.find({ name: formTopic.name });

      if (check.length > 0) {
        return res.json({
          error: "Name has been existed. Please enter name again",
        });
      }

      formTopic.createdBy = _id;
      formTopic.groupId = group_id;
      const topic = await this.topicService.create(formTopic);

      await Group.findByIdAndUpdate(group_id, {
        $push: { topics: topic },
      });

      return res.json({ message: "You have been created topic successfully" });
      //return res.json(serializeCreateTopic(topic));
    } catch (error) {
      return res.json({ error: error });
    }
  };

  updateTopic = async (req: Request, res: Response) => {
    try {
      const { _id, role } = req.authorized_user;
      if (role === RoleCode.Member) {
        return res.json({ error: "You cannot create topic" });
      }

      const { group_id, topic_id } = req.params;

      const check: any = await Topic.find({
        _id: topic_id,
        status: StatusCode.Active,
      });
      if (check.length === 0) {
        return res.json({
          error: "Topic has been deleted. You can not update",
        });
      }

      if (_id !== check.createdAt) {
        return res.json({ error: "You cannot update topic" });
      }

      const formTopic: ITopicUpdateForm = req.body;
      if (check.name === formTopic.name) {
        return res.json({ error: "Sorry!. Please enter name again" });
      }

      const newTopic: any = await Topic.findByIdAndUpdate(
        topic_id,
        {
          $set: {
            name: formTopic.name,
            description: formTopic.description,
            updatedBy: _id,
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

      return res.json({ message: "You have been updated topic successfully" });
      // return res.json(serializeUpdateTopic(newTopic));
    } catch (error) {
      return res.json({ error: error });
    }
  };

  deleteTopic = async (req: Request, res: Response) => {
    try {
      const { _id, role } = req.authorized_user;
      const { group_id, topic_id } = req.params;

      const check: any = await Topic.find({
        _id: topic_id,
        status: StatusCode.Active,
      });
      if (check.length === 0) {
        return res.json({
          error: "Topic has been deleted. You can not delete",
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
          return res.json({ error: "You can deleted all post in topic" });
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

        return res.json({ message: "Deleted successfully" });
      }
      return res.json({ error: "You cannot deleted topic" });
    } catch (error) {
      return res.json({ error: error });
    }
  };
}
