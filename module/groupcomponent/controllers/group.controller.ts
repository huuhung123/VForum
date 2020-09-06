import { Request, Response } from "express";
import { GroupService } from "../services/group.service";
import { IGroupCreateForm, IGroupUpdateForm } from "../models/group.model";
import {
  serialCreateGroup,
  serialUpdateGroup,
} from "../serializers/group.serializer";

import { StatusCode } from "../../../common/model/common.model";
import { Group } from "../../../common/model/group.model";
import { User } from "../../../common/model/user.model";

export class GroupController {
  public groupService: GroupService = new GroupService(Group);

  getAllGroup = async (req: Request, res: Response) => {
    try {
      const result = await Group.find({});
      return res.json({ data: result });
    } catch (error) {
      return res.json({ Error: error });
    }
  };

  getGroup = async (req: Request, res: Response) => {
    try {
      const { group_id } = req.params;
      const result = await Group.findById(group_id);
      return res.json({ data: result });
    } catch (error) {
      return res.json({ Error: error });
    }
  };

  createGroup = async (req: Request, res: Response) => {
    try {
      // const groupter = req!.session!.user;
      // const { role } = req!.session!.user;
      // const  userId  = req!.session!.user.id;

      // if (role === "admin" || role === "moderator") {
      //   const formGroup: IGroupCreateForm = req.body;
      // const check = await Group.find({ name: formGroup.name });
      // if (check.length > 0) {
      //   return res.json({ Error: "Name is exist. Please enter again" });
      // }

      //   formGroup.createdBy = groupter;
      //   const group = await this.groupService.create(formGroup);

      //   User.findByIdAndUpdate(userId, {
      //     $push: {
      //       groups: group,
      //     },
      // {
      //   new: true,
      //   useFindAndModify: false
      // }
      //   });

      //   return res.json(serialCreateGroup(group));
      // }
      // return res.json({ Message: "You cannot create group" });

      const formGroup: IGroupCreateForm = req.body;

      const check = await Group.find({ name: formGroup.name });
      if (check.length > 0) {
        return res.json({ Error: "Name is exist. Please enter again" });
      }

      const group = await this.groupService.create(formGroup);

      await User.findByIdAndUpdate(
        "5f54a0fd94273a271497a1d8",
        {
          $push: {
            groups: group,
          },
        },
        {
          new: true,
        }
      );

      return res.json(serialCreateGroup(group));
    } catch (error) {
      return res.json({ Message: error });
    }
  };

  updateGroup = async (req: Request, res: Response) => {
    try {
      // const groupter = req!.session!.user;
      // const { role, id } = req!.session!.user;
      // const { group_id } = req.params

      // if (role === "admin" || role === "moderator") {

      // const check: any = await Group.findById({ _id: group_id });
      // if (check.name === formGroup.name) {
      //   return res.json({Error: "Sorry!. Please enter name again"})
      // }

      //   const formGroup: IGroupCreateForm = req.body;
      //   formGroup.updatedBy = groupter;

      // const group: any = await Group.findByIdAndUpdate(
      //   group_id,
      //   {
      //     $set: {
      //       name: req.body.name,
      //     },
      //      $push: {
      //      updatedBy: req!.session!.user
      //     }
      //   },
      //   {
      //     new: true,
      //     useFindAndModify: false,
      //   }
      // );

      // await User.findByIdAndUpdate(
      //   , //userid maf ng ta tao
      //   {
      //     $set: {
      //       groups: group
      //     }
      //   },
      //   {
      //     new: true,
      //     useFindAndModify: false,
      //   }
      // )

      // return res.json(serialUpdateGroup(group));

      //   User.findByIdAndUpdate(userId, {
      //     $push: {
      //       groups: group,
      //     },
      //   });

      //   return res.json(serialCreateGroup(group));
      // }
      // return res.json({ Message: "You cannot create group" });

      const { group_id } = req.params;
      const formGroup: IGroupUpdateForm = req.body;

      const check: any = await Group.findById({ _id: group_id });
      if (check.name === formGroup.name) {
        return res.json({ Error: "Sorry!. Please enter name again" });
      }

      const group: any = await Group.findByIdAndUpdate(
        group_id,
        {
          $set: {
            name: req.body.name,
          },
        },
        {
          new: true,
        }
      );

      // await User.update(
      //   { _id: "5f54a0fd94273a271497a1d8", "groups._id": group_id },
      //   {
      //     $set: {
      //       "groups.$.name": req.body.name,
      //       "groups.$.updatedAt": group.updatedAt,
      //       //"groups.$.updatedBy": req!.session!.user
      //     },
      //   }
      // );

      // await User.findByIdAndUpdate(
      //   { _id: "5f54a0fd94273a271497a1d8" },
      //   {
      //     $set: {
      //       "groups.$[el].name": String(req.body.name),
      //       "groups.$[el].updatedAt": String(group.updatedAt),
      //     },
      //   },
      //   {
      //     arrayFilters: [{ "el._id": group_id }],
      //     new: true,
      //   }
      // );

      // await User.updateOne(
      //   {
      //     _id: "5f54a0fd94273a271497a1d8",
      //     groups: { $elemMatch: { _id: group_id } },
      //   },
      //   { $set: { "groups.$.name": req.body.name } }
      // );

      // await User.update(
      //   { _id: "5f54a0fd94273a271497a1d8" },
      //   { $pull: { groups: { _id: group_id } } },
      //   { safe: true }
      // );

      return res.json(serialUpdateGroup(group));
    } catch (error) {
      return res.json({ Message: error });
    }
  };

  deleteGroup = async (req: Request, res: Response) => {
    try {
      // const { role, id } = req!.session!.user;
      // if (role == "admin" || role == "moderator") {
      //   const { group_id } = req.params;

      // const createdUser = await Group.findByIdAndUpdate(group_id, {
      //   $set: {
      //     status: StatusCode.Active,
      //   },
      // });

      //   await User.updateOne(
      //     {
      //       _id: createdUser.createdBy , // user tao ra ?
      //       groups: { $elemMatch: { _id: group_id } },
      //     },
      //     { $set: { "groups.$.status": StatusCode.Deactive } }
      //   );
      //   return res.json({ Message: "Deleted successfully" });
      // }

      // return res.json({ Message: "You cannot remove group" });

      const { group_id } = req.params;
      await Group.findByIdAndUpdate(group_id, {
        $set: {
          status: StatusCode.Deactive,
        },
      });
      await User.updateOne(
        {
          _id: "5f54a0fd94273a271497a1d8",
          groups: { $elemMatch: { _id: group_id } },
        },
        { $set: { "groups.$.status": StatusCode.Deactive } }
      );

      return res.json({ Message: "Deleted successfully" });
    } catch (error) {
      return res.json({ Message: error });
    }
  };
}
