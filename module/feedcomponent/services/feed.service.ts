import { BaseService } from "../../../common/service/common.service";
import { CommentFeed } from "../../../common/model/commentfeed.model";
import { StatusCode } from "../../../common/model/common.model";

export class FeedService extends BaseService {
  constructor(Feed: any) {
    super(Feed);
  }

  callbackDeleteCommentPost = async (feed_id: string) => {
    try {
      CommentFeed.updateMany(
        { feedId: feed_id },
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
