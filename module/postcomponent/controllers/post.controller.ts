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
      const result = await Post.find(
        { status: StatusCode.Active },
        "title description createdBy createdAt countLike countCommentPost commentsPost"
      );
      return res.json({ data: result });
    } catch (error) {
      return res.json({ error });
    }
  };

  getPost = async (req: Request, res: Response) => {
    try {
      const { post_id } = req.params;
      const result = await Post.find(
        {
          _id: post_id,
          status: StatusCode.Active,
        },
        "title description createdBy createdAt countLike countCommentPost commentsPost"
      );
      return res.json({ data: result });
    } catch (error) {
      return res.json({ error });
    }
  };

  createPost = async (req: Request, res: Response) => {
    try {
      const { _id, display_name } = req.authorized_user;
      const { group_id, topic_id } = req.params;

      const formPost: IPostCreateForm = req.body;
      const check = await Post.find({
        title: formPost.title,
        description: formPost.description,
        status: StatusCode.Active,
      });
      if (check.length > 0) {
        return res.json({
          error:
            "Title, description has been existed. Please enter title, description again",
        });
      }

      formPost.createdBy = display_name;
      formPost.userId = _id;
      formPost.topicId = topic_id;

      const post = await this.postservice.create(formPost);

      return res.json({ message: "You have created post successfully" });
      // return res.json(serializeCreatePost(post));
    } catch (error) {
      return res.json({ error });
    }
  };

  updatePost = async (req: Request, res: Response) => {
    try {
      const { _id, display_name } = req.authorized_user;
      const { post_id } = req.params;

      const check: any = await Post.find({
        _id: post_id,
        status: StatusCode.Active,
      });

      if (check[0].createdBy !== display_name) {
        return res.json({
          error: "You cannot update post, you aren't owner of topic",
        });
      }

      if (check.length === 0) {
        return res.json({
          error: "Post has been deleted. You can not update",
        });
      }

      const formPost: IPostUpdateForm = req.body;
      if (
        check[0].title === formPost.title &&
        check[0].description === formPost.description
      ) {
        return res.json({
          error: "Sorry!. Please enter title, description again",
        });
      }

      await Post.findByIdAndUpdate(
        post_id,
        {
          $set: {
            title: formPost.title,
            description: formPost.description,
            updatedBy: display_name,
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
      return res.json({ error });
    }
  };

  deletePost = async (req: Request, res: Response) => {
    try {
      const { display_name, role } = req.authorized_user;
      const { post_id } = req.params;

      const check: any = await Post.find({
        _id: post_id,
        status: StatusCode.Active,
      });
      if (role === RoleCode.Admin || check[0].createdBy === display_name) {
        if (check.length === 0) {
          return res.json({
            error: "Post has been deleted. You can not delete",
          });
        }

        await Post.findByIdAndUpdate(post_id, {
          $set: {
            status: StatusCode.Deactive,
          },
        });

        // await this.postservice.callbackDeleteCommentPost(post_id);
        return res.json({ message: "You deleted post successfully" });
      }
      return res.json({ error: "You cannot deleted post" });
    } catch (error) {
      return res.json({ error });
    }
  };
}
