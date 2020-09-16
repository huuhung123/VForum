import { BaseService } from "../../../common/service/common.service";
import { Post } from "../../../common/model/post.model";
import { CommentPost } from "../../../common/model/commentpost.model";
import { StatusCode } from "../../../common/model/common.model";

export class TopicService extends BaseService {
  constructor(Topic: any) {
    super(Topic);
  }

  // callbackDeleteCommentPost = async (topic_id: string) => {
  //   try {
  //     const posts = await Post.find({ topicId: topic_id });
  //     const postsId = posts.map((item) => item._id);
  //     await CommentPost.updateMany(
  //       { postId: { $in: postsId } },
  //       {
  //         $set: {
  //           status: StatusCode.Deactive,
  //         },
  //       }
  //     );
  //   } catch (error) {
  //     return console.log(error);
  //   }
  // };

  callbackDeletePost = async (topic_id: string) => {
    try {
      await Post.updateMany(
        { topicId: topic_id },
        {
          $set: {
            status: StatusCode.Deactive,
          },
        }
      );
    } catch (error) {
      return console.log(error);
    }
  };
}
