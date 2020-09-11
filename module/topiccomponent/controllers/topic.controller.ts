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
import { RoleCode, User } from "../../../common/model/user.model";

export class TopicController {
  public topicService: TopicService = new TopicService(Topic);

  getAllTopic = async (req: Request, res: Response) => {
    try {
      const result = await Topic.find(
        { status: StatusCode.Active },
        "name description createdBy createdAt"
      );
      return res.json({ data: result });
    } catch (error) {
      return res.json({ error });
    }
  };

  getTopic = async (req: Request, res: Response) => {
    try {
      const { topic_id } = req.params;
      const result = await Topic.find(
        {
          _id: topic_id,
          status: StatusCode.Active,
        },
        "name description createdBy createdAt"
      );
      return res.json({ data: result });
    } catch (error) {
      return res.json({ error });
    }
  };

  createTopic = async (req: Request, res: Response) => {
    try {
      const { display_name, role } = req.authorized_user;
      if (role === RoleCode.Member) {
        return res.json({
          error: "You cannot create topic, you aren't moderator or admin",
        });
      }
      const { group_id } = req.params;
      const formTopic: ITopicCreateForm = req.body;
      const check = await Topic.find({
        name: formTopic.name,
        description: formTopic.description,
        status: StatusCode.Active,
      });

      if (check.length > 0) {
        return res.json({
          error:
            "Name, description has been existed. Please enter name, description again",
        });
      }

      formTopic.createdBy = display_name;
      formTopic.groupId = group_id;

      const topic = await this.topicService.create(formTopic);

      return res.json({ message: "You have been created topic successfully" });
      //return res.json(serializeCreateTopic(topic));
    } catch (error) {
      return res.json({ error });
    }
  };

  updateTopic = async (req: Request, res: Response) => {
    try {
      const { display_name, role } = req.authorized_user;
      const { group_id, topic_id } = req.params;

      const check: any = await Topic.find({
        _id: topic_id,
        status: StatusCode.Active,
      });

      if (role === RoleCode.Member || check[0].createdBy !== display_name) {
        return res.json({
          error: "You cannot update topic, you aren't owner of topic",
        });
      }

      if (check.length === 0) {
        return res.json({
          error: "Topic has been deleted. You can not update",
        });
      }

      const formTopic: ITopicUpdateForm = req.body;
      if (
        check[0].name === formTopic.name &&
        check[0].description === formTopic.description
      ) {
        return res.json({
          error: "Sorry!. Please enter name, description again",
        });
      }

      const newTopic: any = await Topic.findByIdAndUpdate(
        topic_id,
        {
          $set: {
            name: formTopic.name,
            description: formTopic.description,
            updatedBy: display_name,
          },
        },
        {
          new: true,
          useFindAndModify: false,
        }
      );
      return res.json({ message: "You have been updated topic successfully" });
      // return res.json(serializeUpdateTopic(newTopic));
    } catch (error) {
      return res.json({ error });
    }
  };

  deleteTopic = async (req: Request, res: Response) => {
    try {
      const { display_name, role } = req.authorized_user;
      const { group_id, topic_id } = req.params;

      const check: any = await Topic.find({
        _id: topic_id,
        status: StatusCode.Active,
      });

      if (role === RoleCode.Admin || check[0].createdBy === display_name) {
        if (check.length === 0) {
          return res.json({
            error: "Topic has been deleted. You can not delete",
          });
        }

        await Topic.findByIdAndUpdate(topic_id, {
          $set: {
            status: StatusCode.Deactive,
          },
        });

        // await this.topicService.callbackDeletePost(topic_id);
        // await this.topicService.callbackDeleteCommentPost(topic_id);
        return res.json({ message: "You deleted topic successfully" });
      }
      return res.json({ error: "You cannot deleted topic" });
    } catch (error) {
      return res.json({ error });
    }
  };
}
