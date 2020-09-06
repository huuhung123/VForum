import { Request, Response } from "express";
import { TopicService } from "../services/topic.service";
import { ITopicCreateForm, ITopicUpdateForm } from "../models/topic.model";
import {
  serializeCreateTopic,
  serializeUpdateTopic,
} from "../serializers/topic.serializer";
import { Topic } from "../../../common/model/topic.model";
import { Group } from "../../../common/model/group.model";
import { User } from "../../../common/model/user.model";

export class TopicController {
  public topicService: TopicService = new TopicService(Topic);

  getAllTopic = async (req: Request, res: Response) => {
    try {
      const result = await Topic.find({}).populate("posts");
      return res.json({ data: result });
    } catch (error) {
      return res.json({ Message: error });
    }
  };

  getTopic = async (req: Request, res: Response) => {
    try {
      const { topic_id } = req.params;
      const result = await Topic.find({ _id: topic_id }).populate("posts");
      return res.json({ data: result });
    } catch (error) {
      return res.json({ Message: error });
    }
  };

  createTopic = async (req: Request, res: Response) => {
    try {
      const { group_id } = req.params;
      const form: ITopicCreateForm = req.body;
      const check = await Topic.find({ name: form.name });

      if (check.length > 0) {
        return res.json({ Error: "Name is exist. Please enter again" });
      }

      // const userId = req!.session!.user._id
      // form.createdBy = userId

      const topic = await this.topicService.create(form);

      const newGroup = await Group.findByIdAndUpdate(group_id, {
        $push: { topics: topic },
      });

      await User.update(
        // {_id: userId}
        { _id: "5f54a0dd94273a271497a1d7" },
        {
          $pull: {
            groups: {
              _id: group_id,
            },
          },
        }
      );

      await User.findByIdAndUpdate(
        // userId,
        "5f54a0dd94273a271497a1d7",
        {
          $push: {
            groups: newGroup,
          },
        }
      );

      return res.json(serializeCreateTopic(topic));
    } catch (error) {
      return res.json({ Message: error });
    }
  };

  updateTopic = async (req: Request, res: Response) => {
    try {
      // const userId = req!.session!.user._id;
      // const { group_id, topic_id } = req.params;

      // const check: any = await Topic.findById(topic_id);

      // if (req!.session!.user.id !== check.createdAt) {
      //   return res.json({ Error: "You cannot update topic" });
      // }

      // const form: ITopicUpdateForm = req.body;

      // if (check.name === form.name) {
      //   return res.json({ Error: "Sorry!. Please enter name again" });
      // }

      // const newTopic: any = await Topic.findByIdAndUpdate(
      //   topic_id,
      //   {
      //     $set: {
      //       name: req.body.name,
      //       description: req.body.description,
      //       // updatedBy: req!.session!.user,
      //     },
      //     // }
      //   },
      //   {
      //     new: true,
      //   }
      // );

      // const newGroup = await Group.updateOne(
      //   { _id: group_id, "topics._id": topic_id },
      //   {
      //     $set: {
      //       "topics.$": newTopic,
      //     },
      //   }
      // );

      // await User.updateOne(
      //   { _id: userId, "groups._id": group_id },
      //   {
      //     $set: {
      //       "groups.$": newGroup,
      //     },
      //   }
      // );

      // return res.json(serializeUpdateTopic(newTopic));

      const { group_id, topic_id } = req.params;

      const form: ITopicUpdateForm = req.body;

      const check: any = await Topic.findById(topic_id);
      if (check.name === form.name) {
        return res.json({ Error: "Sorry!. Please enter name again" });
      }

      const newTopic: any = await Topic.findByIdAndUpdate(topic_id, {
        $set: {
          name: req.body.name,
          description: req.body.description,
        },
      });

      const newGroup = await Group.updateOne(
        { _id: group_id, "topics._id": topic_id },
        {
          $set: {
            "topics.$": newTopic,
          },
        }
      );

      await User.updateOne(
        { _id: "5f54a0dd94273a271497a1d7", "groups._id": group_id },
        {
          $set: {
            "groups.$": newGroup,
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
      // const { _id, role } = req!.session!.user;

      // const { group_id, topic_id } = req.params;
      // const createdTopic: any = await Topic.findById(topic_id);

      // if (role === "admin" || _id === createdTopic._id) {
      //   const newTopic = await Topic.findByIdAndUpdate(topic_id, {
      //     $set: {
      //       status: "deactive",
      //     },
      //   });

      //   const newGroup = await Group.updateOne(
      //     { _id: group_id, "topics._id": topic_id },
      //     {
      //       $set: {
      //         "topics.$": newTopic,
      //       },
      //     }
      //   );

      //   await User.updateOne(
      //     { _id: "5f54a0dd94273a271497a1d7", "groups._id": group_id },
      //     {
      //       $set: {
      //         "groups.$": newGroup,
      //       },
      //     }
      //   );

      //   return res.json({ Message: "Deleted successfully" });
      // }
      // return res.json({ Message: "You cannot deleted topic" });

      const { group_id, topic_id } = req.params;

      const newTopic = await Topic.findByIdAndUpdate(topic_id, {
        $set: {
          status: "deactive",
        },
      });

      const newGroup = await Group.updateOne(
        { _id: group_id, "topics._id": topic_id },
        {
          $set: {
            "topics.$": newTopic,
          },
        }
      );

      await User.updateOne(
        { _id: "5f54a0dd94273a271497a1d7", "groups._id": group_id },
        {
          $set: {
            "groups.$": newGroup,
          },
        }
      );

      return res.json({ Message: "Deleted successfully" });
    } catch (error) {
      return res.json({ Message: error });
    }
  };
}
