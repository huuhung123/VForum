import { Request, Response } from "express";
import { PostService } from "../services/post.service";
import { IPostCreateForm, IPostUpdateForm } from "../models/post.model";
import {
  serializeCreatePost,
  serializeUpdatePost,
} from "../serializers/post.serializer";

import { Post } from "../../../common/model/post.model";
import { Topic } from "../../../common/model/topic.model";
import { Group } from "../../../common/model/group.model";
import { RoleCode } from "../../../common/model/user.model";
import { StatusCode } from "../../../common/model/common.model";

export class PostController {
  public postservice: PostService = new PostService(Post);

  getAllPost = async (req: Request, res: Response) => {
    try {
      const result = await Post.find({ status: StatusCode.Active });
      return res.json({ data: result });
    } catch (error) {
      return res.json({ Message: error });
    }
  };

  getPost = async (req: Request, res: Response) => {
    try {
      const { post_id } = req.params;
      const result = await Post.find({
        _id: post_id,
        status: StatusCode.Active,
      });
      return res.json({ data: result });
    } catch (error) {
      return res.json({ error: error });
    }
  };

  createPost = async (req: Request, res: Response) => {
    try {
      const { _id } = req.authorized_user;
      const { group_id, topic_id } = req.params;

      const formPost: IPostCreateForm = req.body;
      const check = await Post.find({ title: formPost.title, status: StatusCode.Active });
      if (check.length > 0) {
        return res.json({ error: "Title is exist. Please enter again" });
      }

      formPost.userId = _id;
      formPost.topicId = topic_id;

      const post = await this.postservice.create(formPost);
      const newTopic = await Topic.findByIdAndUpdate(topic_id, {
        $push: { posts: post._id },
      });

      await Group.findByIdAndUpdate(group_id, {
        $push: {
          topics: newTopic,
        },
      });
      return res.json({ message: "You have created post successfully" });
      // return res.json(serializeCreatePost(post));
    } catch (error) {
      return res.json({ error: error });
    }
  };

  updatePost = async (req: Request, res: Response) => {
    try {
      const { _id } = req.authorized_user;
      const { post_id } = req.params;

      const check: any = await Post.find({
        _id: post_id,
        status: StatusCode.Active,
      });
      if (check.length === 0) {
        return res.json({
          error: "Post has been deleted. You can not update",
        });
      }
      if (_id !== check.createdAt) {
        return res.json({ error: "You cannot update post" });
      }

      const formPost: IPostUpdateForm = req.body;
      if (check.title === formPost.title) {
        return res.json({ error: "Sorry!. Please enter title again" });
      }

      const newPost: any = await Post.findByIdAndUpdate(
        post_id,
        {
          $set: {
            title: formPost.title,
            description: formPost.description,
            updatedBy: _id,
          },
        },
        {
          new: true,
          useFindAndModify: false,
        }
      );
      return res.json({ message: "You have been updated post successfully" });
      // return res.json(serializeUpdatePost(newPost));
    } catch (error) {
      return res.json({ error: error });
    }
  };

  deletePost = async (req: Request, res: Response) => {
    const { _id, role } = req.authorized_user;
    const { post_id } = req.params;

    const check: any = await Post.find({
      _id: post_id,
      status: StatusCode.Active,
    });
    if (check.length === 0) {
      return res.json({
        error: "Post has been deleted. You can not delete",
      });
    }

    if (role === RoleCode.Admin || _id === check._id) {
      await Post.findByIdAndUpdate(post_id, {
        $set: {
          status: StatusCode.Deactive,
        },
      });
      this.postservice.callbackDeleteCommentPost(post_id);

      return res.json({ message: "You have been deleted post successfully" });
    }
    return res.json({ error: "You cannot deleted post" });
  };
}
