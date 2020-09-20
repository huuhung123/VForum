import { BaseService } from "../../../common/service/common.service";

import { StatusCode } from "../../../common/model/common.model";
import { Topic } from "../../../common/model/topic.model";
import { Post } from "../../../common/model/post.model";

export class GroupService extends BaseService {
  constructor(Group: any) {
    super(Group);
  }

  callbackDeleteTopic = async (group_id: string) => {
    try {
      await Topic.updateMany(
        { groupId: group_id },
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

  callbackDeletePost = async (group_id: string) => {
    try {
      const topics = await Topic.find({ groupId: group_id });
      const topicsId = topics.map((item) => item._id);
      await Post.updateMany(
        { topicId: { $in: topicsId } },
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
