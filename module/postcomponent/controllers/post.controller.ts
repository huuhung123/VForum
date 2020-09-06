import { Request, Response } from "express";
import { PostService } from "../services/post.service";
import { IPostCreateForm, IPostUpdateForm } from "../models/post.model";
import {
  serializeCreatePost,
  serializeUpdatePost,
} from "../serializers/post.serializer";
import {
  Post,
  Topic,
  CommentPost,
  Group,
  User,
} from "../../../common/model/common.model";

export class PostController {
  public postservice: PostService = new PostService(Post);

  getAllPost = async (req: Request, res: Response) => {
    try {
      const result = await Post.find({});
      return res.json({ data: result });
    } catch (error) {
      return res.json({ Message: error });
    }
  };

  getPost = async (req: Request, res: Response) => {
    try {
      const { post_id } = req.params;
      const result = await Post.find({ _id: post_id });
      return res.json({ data: result });
    } catch (error) {
      return res.json({ Message: error });
    }
  };

  createPost = async (req: Request, res: Response) => {
    try {
      const { group_id, topic_id } = req.params;
      const form: IPostCreateForm = req.body;
      // const userId = req!.session!.user._id
      // form.createdBy = userId

      const post = await this.postservice.create(form);

      const newTopic = await Topic.findByIdAndUpdate(topic_id, {
        $push: { posts: post._id },
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

      return res.json(serializeCreatePost(post));
    } catch (error) {
      return res.json({ Error: error });
    }
  };

  updatePost = async (req: Request, res: Response) => {
    // const userId = req!.session!.user._id;
    // const { group_id, topic_id, post_id } = req.params;

    // const check: any = await Post.findById(post_id);

    // if (userId !== check.createdAt) {
    //   return res.json({ Error: "You cannot update post" });
    // }

    // const form: IPostUpdateForm = req.body;

    // if (check.title === form.title) {
    //   return res.json({ Error: "Sorry!. Please enter title again" });
    // }

    // const newPost: any = await Post.findByIdAndUpdate(
    //   post_id,
    //   {
    //     $set: {
    //       title: req.body.title,
    //       description: req.body.description,
    //       // updatedBy: userId,
    //     },
    //     // }
    //   },
    //   {
    //     new: true,
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
    //   {_id: group_id, "topics._id": topic_id},
    //   {
    //     $set: {
    //       "topics.$": newTopic
    //     }
    //   }
    // )

    // await User.updateOne(
    //   { _id: userId, "groups._id": group_id },
    //   {
    //     $set: {
    //       "groups.$": newGroup,
    //     },
    //   }
    // );

    // return res.json(serializeUpdatePost(newPost));

    const { group_id, topic_id, post_id } = req.params;

    const form: IPostUpdateForm = req.body;
    const check: any = await Post.findById(post_id);

    if (check.title === form.title) {
      return res.json({ Error: "Sorry!. Please enter title again" });
    }

    const newPost: any = await Post.findByIdAndUpdate(
      post_id,
      {
        $set: {
          title: req.body.title,
          description: req.body.description,
          // updatedBy: userId,
        },
        // }
      },
      {
        new: true,
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

    return res.json(serializeUpdatePost(newPost));
  };

  deletePost = async (req: Request, res: Response) => {
    // const { _id, role } = req!.session!.user;

    // const { group_id, topic_id, post_id } = req.params;
    // const createdPost: any = await Post.findById(post_id);

    // if (role === "admin" || _id === createdPost._id) {
    //   const newPost = await Post.findByIdAndUpdate(post_id, {
    //     $set: {
    //       status: "deactive",
    //     },
    //   });

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

    const { group_id, topic_id, post_id } = req.params;

    const newPost = await Post.findByIdAndUpdate(post_id, {
      $set: {
        status: "deactive",
      },
    });

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
  };
}
