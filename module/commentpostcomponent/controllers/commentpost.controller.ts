import { Request, Response } from "express";
import { CommentPostService } from "../services/commentpost.service";
import {
  ICommentPostCreateForm,
  ICommentPostUpdateForm,
} from "../models/commentpost.model";
import {
  serialCreateCommentPost,
  serialUpdateCommentPost,
} from "../serializers/commentpost.serializer";

import { CommentPost } from "../../../common/model/commentpost.model";
import { Post } from "../../../common/model/post.model";
import { Topic } from "../../../common/model/topic.model";
import { Group } from "../../../common/model/group.model";
import { User } from "../../../common/model/user.model";

export class CommentPostController {
  public commentPostService: CommentPostService = new CommentPostService(
    CommentPost
  );

  getAllCommentPost = async (req: Request, res: Response) => {
    try {
      const result = await CommentPost.find({});
      return res.json({ data: result });
    } catch (error) {
      return res.json({ Message: error });
    }
  };

  getCommentPost = async (req: Request, res: Response) => {
    try {
      const { comment_id } = req.params;
      const result = await CommentPost.find({ _id: comment_id });
      return res.json({ data: result });
    } catch (error) {
      return res.json({ Message: error });
    }
  };

  createCommentPost = async (req: Request, res: Response) => {
    try {
      const { group_id, topic_id, post_id } = req.params;
      const form: ICommentPostCreateForm = req.body;
      // const userId = req!.session!.user._id
      // form.createdBy = userId

      const commentpost = await this.commentPostService.create(form);

      const newPost = await Post.findByIdAndUpdate(post_id, {
        $push: { commentsPost: commentpost },
      });

      const newTopic = await Topic.findByIdAndUpdate(topic_id, {
        $push: {
          posts: newPost,
        },
      });

      const newGroup = await Group.findByIdAndUpdate(group_id, {
        $push: {
          topics: newTopic,
        },
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

      return res.json(serialCreateCommentPost(commentpost));
    } catch (error) {
      return res.json({ Message: error });
    }
  };

  updateCommentPost = async (req: Request, res: Response) => {
    // const userId = req!.session!.user._id;
    // const { group_id, topic_id, post_id, comment_id } = req.params;

    // const check: any = await CommentPost.findById(comment_id);

    // if (userId !== check.createdAt) {
    //   return res.json({ Error: "You cannot update commentpost" });
    // }

    // const form: ICommentPostUpdateForm = req.body;

    // if (check.description === form.description) {
    //   return res.json({ Error: "Sorry!. Please enter description again" });
    // }

    // const newCommentPost: any = await CommentPost.findByIdAndUpdate(
    //   comment_id,
    //   {
    //     $set: {
    //       description: req.body.description,
    //       // updatedBy: userId,
    //     },
    //     // }
    //   },
    //   {
    //     new: true,
    //   }
    // );

    // const newPost = await Post.updateOne(
    //   { _id: post_id, "commentsPost._id": comment_id },
    //   {
    //     $set: {
    //       "commentsPost.$": newCommentPost,
    //     },
    //   }
    // );

    // const newTopic = await Topic.updateOne(
    //   { _id: topic_id, "posts._id": post_id },
    //   {
    //     $set: {
    //       "posts.$": newPost,
    //     },
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

    // return res.json(serialUpdateCommentPost(newCommentPost));

    const { group_id, topic_id, post_id, comment_id } = req.params;

    const form: ICommentPostUpdateForm = req.body;
    const check: any = await CommentPost.findById(comment_id);

    if (check.description === form.description) {
      return res.json({ Error: "Sorry!. Please enter description again" });
    }
    const newCommentPost: any = await CommentPost.findByIdAndUpdate(
      comment_id,
      {
        $set: {
          description: req.body.description,
          // updatedBy: userId,
        },
        // }
      },
      {
        new: true,
      }
    );

    const newPost = await Post.updateOne(
      { _id: post_id, "commentsPost._id": comment_id },
      {
        $set: {
          "commentsPost.$": newCommentPost,
        },
      }
    );

    const newTopic = await Topic.updateOne(
      { _id: topic_id, "posts._id": post_id },
      {
        $set: {
          "posts.$": newPost,
        },
      }
    );

    const newGroup = await Group.updateOne(
      { _id: group_id, "topics._id": topic_id },
      {
        $set: {
          "topics.$": newTopic,
        },
      }
    );

    await User.updateOne(
      { _id: "5f54a0dd94273a271497a1d", "groups._id": group_id },
      {
        $set: {
          "groups.$": newGroup,
        },
      }
    );

    return res.json(serialUpdateCommentPost(newCommentPost));
  };

  deleteCommentPost = async (req: Request, res: Response) => {
    try {
      // const { _id, role } = req!.session!.user;

      // const { group_id, topic_id, post_id, comment_id } = req.params;
      // const createdCommentPost: any = await CommentPost.findById(comment_id);

      // if (role === "admin" || _id === createdCommentPost._id) {
      //   const newCommentPost = await CommentPost.findByIdAndUpdate(comment_id, {
      //     $set: {
      //       status: "deactive",
      //     },
      //   });

      //   const newPost = await Post.updateOne(
      //     { _id: post_id, "commentsPost._id": comment_id },
      //     {
      //       $set: {
      //         "commentsPost.$": newCommentPost,
      //       },
      //     }
      //   );

      //   const newTopic = await Topic.updateOne(
      //     { _id: topic_id, "posts._id": post_id },
      //     {
      //       $set: {
      //         "posts.$": newPost,
      //       },
      //     }
      //   );

      //   const newGroup = await Group.findByIdAndUpdate(
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

      const { group_id, topic_id, post_id, comment_id } = req.params;

      const newCommentPost = await CommentPost.findByIdAndUpdate(comment_id, {
        $set: {
          status: "deactive",
        },
      });

      const newPost = await Post.updateOne(
        { _id: post_id, "commentsPost._id": comment_id },
        {
          $set: {
            "commentsPost.$": newCommentPost,
          },
        }
      );

      const newTopic = await Topic.findByIdAndUpdate(
        { _id: topic_id, "posts._id": post_id },
        {
          $set: {
            "posts.$": newPost,
          },
        }
      );

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
      return res.json({ Error: error });
    }
  };
}
