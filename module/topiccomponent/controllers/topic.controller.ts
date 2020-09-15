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

import { success, error } from "../../../common/service/response.service";
export class TopicController {
  public topicService: TopicService = new TopicService(Topic);

  getAllTopic = async (req: Request, res: Response) => {
    try {
      const { group_id } = req.params;
      const result = await Topic.find(
        { status: StatusCode.Active, groupId: group_id },
        "name description createdBy createdAt"
      );
      return success(res, result);
    } catch (err) {
      return error(res, err);
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
      return error(res, err);
    }
  };

  createTopic = async (req: Request, res: Response) => {
    try {
      const { display_name, role } = req.authorized_user;
      if (role === RoleCode.Member) {
        const messageError =
          "You cannot create topic, you aren't moderator or admin";
        return error(res, messageError);
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
        return error(res, messageError);
      }

      formTopic.createdBy = display_name;
      formTopic.groupId = group_id;

      const topic = await this.topicService.create(formTopic);
      const messageSuccess = "You have been created topic successfully";
      return success(res, serializeCreateTopic(topic), messageSuccess);
    } catch (err) {
      return error(res, err);
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
        const messageError =
          "You cannot update topic, you aren't owner of topic";
        return error(res, messageError);
      }
      if (check.length === 0) {
        const messageError = "Topic has been deleted. You can not update";
        return error(res, messageError);
      }

      const formTopic: ITopicUpdateForm = req.body;
      if (
        check[0].name === formTopic.name &&
        check[0].description === formTopic.description
      ) {
        const messageError = "Sorry!. Please enter name, description again";
        return error(res, messageError);
      }

      const topic: any = await Topic.findByIdAndUpdate(
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
      const messageSuccess = "Topic have updated successfully";
      return success(res, serializeUpdateTopic(topic), messageSuccess);
    } catch (err) {
      return error(res, err);
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
          const messageError = "Topic has been deleted. You can not delete";
          return error(res, messageError);
        }

        await Topic.findByIdAndUpdate(topic_id, {
          $set: {
            status: StatusCode.Deactive,
          },
        });

        await this.topicService.callbackDeletePost(topic_id);
        await this.topicService.callbackDeleteCommentPost(topic_id);

        const messageSuccess = "You deleted topic successfully";
        return success(res, null, messageSuccess);
      }
      const messageError = "You cannot deleted topic";
      return error(res, messageError);
    } catch (err) {
      return error(res, err);
    }
  };
}
