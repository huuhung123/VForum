import { BaseService } from "../../../common/service/common.service";

import { StatusCode } from "../../../common/model/common.model";
import { Post } from "../../../common/model/post.model";

export class TopicService extends BaseService {
  constructor(Topic: any) {
    super(Topic);
  }

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
