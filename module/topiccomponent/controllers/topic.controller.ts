import { Request, Response } from "express";

import { TopicService } from "../services/topic.service";
import { success, error } from "../../../common/service/response.service";

import { StatusCode } from "../../../common/model/common.model";
import { Topic } from "../../../common/model/topic.model";
import { RoleCode } from "../../../common/model/user.model";

import { ITopicCreateForm, ITopicUpdateForm } from "../models/topic.model";
import {
  serializeCreateTopic,
  serializeUpdateTopic,
} from "../serializers/topic.serializer";

export class TopicController {
  public topicService: TopicService = new TopicService(Topic);

  getAllTopic = async (req: Request, res: Response) => {
    try {
      const { group_id } = req.params;
      const result = await Topic.find(
        { status: StatusCode.Active, groupId: group_id },
        "name description createdBy createdAt"
      ).sort({ updatedAt: -1 });
      return success(res, result);
    } catch (err) {
      return error(res, "Error", 200);
    }
  };

  getTopic = async (req: Request, res: Response) => {
    try {
      const { topic_id, group_id } = req.params;
      const result = await Topic.find(
        {
          _id: topic_id,
          groupId: group_id,
          status: StatusCode.Active,
        },
        "name description createdBy createdAt"
      );
      return success(res, result);
    } catch (err) {
      return error(res, "Error", 200);
    }
  };

  createTopic = async (req: Request, res: Response) => {
    try {
      const { display_name, role } = req.authorized_user;
      if (role === RoleCode.Member) {
        const messageError =
          "You cannot create topic, you aren't moderator or admin";
        return error(res, messageError, 200);
      }
      const { group_id } = req.params;
      const formTopic: ITopicCreateForm = req.body;
      const check = await Topic.find({
        name: formTopic.name,
        description: formTopic.description,
        status: StatusCode.Active,
      });

      if (check.length > 0) {
        const messageError =
          "Name, description has been existed. Please enter name, description again";
        return error(res, messageError, 200);
      }

      formTopic.createdBy = display_name;
      formTopic.groupId = group_id;

      const topic = await this.topicService.create(formTopic);
      const messageSuccess = "You have been created topic successfully";
      return success(res, serializeCreateTopic(topic), messageSuccess);
    } catch (err) {
      return error(res, "Error", 200);
    }
  };

  updateTopic = async (req: Request, res: Response) => {
    try {
      const { display_name, role } = req.authorized_user;
      const { topic_id } = req.params;

      const check: any = await Topic.find({
        _id: topic_id,
        status: StatusCode.Active,
      });

      if (check.length === 0) {
        const messageError = "Topic has been deleted. You can not update";
        return error(res, messageError, 200);
      }

      if (role === RoleCode.Member || check[0].createdBy !== display_name) {
        const messageError =
          "You cannot update topic, you aren't owner of topic";
        return error(res, messageError, 200);
      }

      const formTopic: ITopicUpdateForm = req.body;
      const arr = await Topic.find({
        name: formTopic.name,
        description: formTopic.description,
      });
      if (
        (check[0].name === formTopic.name &&
          check[0].description === formTopic.description) ||
        arr.length > 0
      ) {
        const messageError = "Sorry!. Please enter name, description again";
        return error(res, messageError, 200);
      }

      const topic: any = await Topic.findByIdAndUpdate(
        topic_id,
        {
          $set: {
            name: formTopic.name,
            description: formTopic.description,
            isUpdated: true,
          },
        },
        {
          new: true,
          useFindAndModify: false,
        }
      );
      const messageSuccess = "Topic have updated successfully";
      return success(res, serializeUpdateTopic(topic), messageSuccess);
    } catch (err) {
      return error(res, "Error", 200);
    }
  };

  deleteTopic = async (req: Request, res: Response) => {
    try {
      const { display_name, role } = req.authorized_user;
      const { topic_id } = req.params;

      const check: any = await Topic.find({
        _id: topic_id,
        status: StatusCode.Active,
      });

      if (check.length === 0) {
        const messageError = "Topic has been deleted. You can not delete";
        return error(res, messageError, 200);
      }

      if (role === RoleCode.Admin || check[0].createdBy === display_name) {
        await Topic.findByIdAndUpdate(topic_id, {
          $set: {
            status: StatusCode.Deactive,
          },
        });

        await this.topicService.callbackDeletePost(topic_id);

        const messageSuccess = "You deleted topic successfully";
        return success(res, null, messageSuccess);
      }
      const messageError = "You cannot deleted topic";
      return error(res, messageError, 200);
    } catch (err) {
      return error(res, "Error", 200);
    }
  };
}
