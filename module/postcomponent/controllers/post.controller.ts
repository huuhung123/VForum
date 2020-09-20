import { Request, Response } from "express";

import { PostService } from "../services/post.service";
import { success, error } from "../../../common/service/response.service";

import { StatusCode } from "../../../common/model/common.model";
import { Post } from "../../../common/model/post.model";
import { Like } from "../../../common/model/like.model";
import { CommentPost } from "../../../common/model/commentpost.model";
import { RoleCode } from "../../../common/model/user.model";
import { LikeType } from "../../../common/model/like.model";

import { IPostCreateForm, IPostUpdateForm } from "../models/post.model";
import {
  serializeCreatePost,
  serializeUpdatePost,
} from "../serializers/post.serializer";

export class PostController {
  public postservice: PostService = new PostService(Post);

  getAllPost = async (req: Request, res: Response) => {
    try {
      const { topic_id } = req.params;
      const result = await Post.find(
        { status: StatusCode.Active, topicId: topic_id },
        "title description createdBy createdAt countLike countCommentPost commentsPost"
      ).sort({ updatedAt: -1 });
      return success(res, result);
    } catch (err) {
      return error(res, "Error", 200);
    }
  };

  getPost = async (req: Request, res: Response) => {
    try {
      const { post_id, topic_id } = req.params;
      const result = await Post.find(
        {
          _id: post_id,
          status: StatusCode.Active,
          topicId: topic_id,
        },
        "title description createdBy createdAt countLike countCommentPost commentsPost"
      );
      return success(res, result);
    } catch (err) {
      return error(res, "Error", 200);
    }
  };

  createPost = async (req: Request, res: Response) => {
    try {
      const { _id, display_name } = req.authorized_user;
      const { topic_id } = req.params;

      const formPost: IPostCreateForm = req.body;
      const check = await Post.find({
        title: formPost.title,
        description: formPost.description,
        status: StatusCode.Active,
      });
      if (check.length > 0) {
        const messageError =
          "Title, description has been existed. Please enter title, description again";
        return error(res, messageError, 200);
      }

      formPost.createdBy = display_name;
      formPost.userId = _id;
      formPost.topicId = topic_id;

      const post = await this.postservice.create(formPost);

      const newLike = new Like({
        likeType: LikeType.Post,
        likeReferenceId: post._id,
      });
      await newLike.save();

      const messageSuccess = "You have been created post successfully";
      return success(res, serializeCreatePost(post), messageSuccess);
    } catch (err) {
      return error(res, "Error", 200);
    }
  };

  updatePost = async (req: Request, res: Response) => {
    try {
      const { display_name } = req.authorized_user;
      const { post_id } = req.params;

      const check: any = await Post.find({
        _id: post_id,
        status: StatusCode.Active,
      });

      if (check.length === 0) {
        const messageError = "Post has been deleted. You can not update";
        return error(res, messageError, 200);
      }

      if (check[0].createdBy !== display_name) {
        const messageError =
          "You cannot update post, you aren't owner of topic";
        return error(res, messageError, 200);
      }

      const formPost: IPostUpdateForm = req.body;
      const arr = await Post.find({
        title: formPost.title,
        description: formPost.description,
      });

      if (
        (check[0].title === formPost.title &&
          check[0].description === formPost.description) ||
        arr.length > 0
      ) {
        const messageError = "Sorry!. Please enter title, description again";
        return error(res, messageError, 200);
      }

      const newPost: any = await Post.findByIdAndUpdate(
        post_id,
        {
          $set: {
            title: formPost.title,
            description: formPost.description,
            isUpdated: true,
          },
        },
        {
          new: true,
          useFindAndModify: false,
        }
      );
      const messageSuccess = "Post have updated successfully";
      return success(res, serializeUpdatePost(newPost), messageSuccess);
    } catch (err) {
      return error(res, "Error", 200);
    }
  };

  addLike = async (req: Request, res: Response) => {
    try {
      const { post_id, topic_id } = req.params;

      const check: any = await Post.find({
        _id: post_id,
        status: StatusCode.Active,
      });

      if (check.length === 0) {
        const messageError = "Post has been deleted. You can not add like";
        return error(res, messageError, 200);
      }

      await Post.updateOne(
        { _id: post_id },
        {
          $inc: { countLike: 1 },
        }
      );

      const result = await Post.find(
        {
          _id: post_id,
          topicId: topic_id,
        },
        "title description createdBy createdAt countLike countCommentPost commentsPost"
      );
      return success(res, result);
    } catch (err) {
      return error(res, "Error", 200);
    }
  };

  minusLike = async (req: Request, res: Response) => {
    try {
      const { post_id, topic_id } = req.params;

      const check: any = await Post.find({
        _id: post_id,
        status: StatusCode.Active,
      });

      if (check.length === 0) {
        const messageError = "Post has been deleted. You can not minus like";
        return error(res, messageError, 200);
      }

      await Post.updateOne(
        { _id: post_id },
        {
          $inc: { countLike: -1 },
        }
      );

      const result = await Post.find(
        {
          _id: post_id,
          topicId: topic_id,
        },
        "title description createdBy createdAt countLike countCommentPost commentsPost"
      );
      return success(res, result);
    } catch (err) {
      return error(res, "Error", 200);
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
      if (check.length === 0) {
        const messageError = "Post has been deleted. You can not delete";
        return error(res, messageError, 200);
      }
      if (
        role === RoleCode.Admin ||
        check[0].createdBy === display_name ||
        role === RoleCode.Moderator
      ) {
        await Post.findByIdAndUpdate(post_id, {
          $set: {
            status: StatusCode.Deactive,
          },
        });

        await this.postservice.callbackDeleteCommentPost(post_id);

        const arr: any = await CommentPost.find({ postId: post_id });

        await Post.updateOne(
          { _id: post_id },
          {
            $set: {
              commentsPost: arr,
            },
          }
        );
        const messageSuccess = "You deleted post successfully";
        return success(res, null, messageSuccess);
      }
      const messageError = "You cannot deleted post";
      return error(res, messageError, 200);
    } catch (err) {
      return error(res, "Error", 200);
    }
  };
}
