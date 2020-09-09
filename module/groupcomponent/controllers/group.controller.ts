import { Request, Response } from "express";
import { GroupService } from "../services/group.service";
import { IGroupCreateForm, IGroupUpdateForm } from "../models/group.model";
import {
  serialCreateGroup,
  serialUpdateGroup,
} from "../serializers/group.serializer";

import { Group } from "../../../common/model/group.model";

import { StatusCode } from "../../../common/model/common.model";
import { RoleCode } from "../../../common/model/user.model";
export class GroupController {
  public groupService: GroupService = new GroupService(Group);

  getAllGroup = async (req: Request, res: Response) => {
    try {
      const result = await Group.find({ status: StatusCode.Active });
      return res.json({ data: result });
    } catch (error) {
      return res.json({ Error: error });
    }
  };

  getGroup = async (req: Request, res: Response) => {
    try {
      const { group_id } = req.params;

      const result = await Group.find({
        status: StatusCode.Active,
        _id: group_id,
      });
      return res.json({ data: result });
    } catch (error) {
      return res.json({ Error: error });
    }
  };
  // xoa roi tao cai moi thi ntn ???
  createGroup = async (req: Request, res: Response) => {
    try {
      const { role, userId } = res.locals.user;

      if (role === RoleCode.Admin || role === RoleCode.Moderator) {
        const formGroup: IGroupCreateForm = req.body;

        const check = await Group.find({ name: formGroup.name });
        if (check.length > 0) {
          return res.json({ Error: "Name is exist. Please enter again" });
        }

        formGroup.createdBy = userId;
        const group = await this.groupService.create(formGroup);

        return res.json(serialCreateGroup(group));
      }

      return res.json({ Message: "You cannot create group" });
    } catch (error) {
      return res.json({ Message: error });
    }
  };

  updateGroup = async (req: Request, res: Response) => {
    try {
      const { role, userId } = res.locals.user;
      const { group_id } = req.params;

      if (role === RoleCode.Admin || role === RoleCode.Moderator) {
        const formGroup: IGroupUpdateForm = req.body;

        const check: any = await Group.find({
          _id: group_id,
          status: StatusCode.Active,
        });
        if (check.length === 0) {
          return res.json({
            Error: "Group has been deleted. You can not update",
          });
        }

        if (check.name === formGroup.name) {
          return res.json({ Error: "Sorry!. Please enter name again" });
        }

        const group: any = await Group.findByIdAndUpdate(
          group_id,
          {
            $set: {
              name: formGroup.name,
              updatedBy: userId,
            },
          },
          {
            new: true,
            useFindAndModify: false,
          }
        );

        return res.json(serialUpdateGroup(group));
      }

      return res.json({ Message: "You cannot update group" });
    } catch (error) {
      return res.json({ Message: error });
    }
  };

  deleteGroup = async (req: Request, res: Response) => {
    try {
      const { role } = res.locals.user;
      if (role == RoleCode.Admin) {
        const { group_id } = req.params;

        const check: any = await Group.find({
          _id: group_id,
          status: StatusCode.Active,
        });
        if (check.length === 0) {
          return res.json({
            Error: "Group has been deleted. You can not delete",
          });
        }

        const result = await Group.aggregate()
          .match({ _id: group_id })
          .project({ topics: 1 })
          .unwind("$topics")
          .group({ _id: "$status", count: { $sum: 1 } });

        result.sort((d1, d2) => d1._id - d2._id);

        if (result[0] !== 0) {
          return res.json({ Error: "You can deleted all topic in group" });
        }

        await Group.findByIdAndUpdate(group_id, {
          $set: {
            status: StatusCode.Deactive,
          },
        });

        return res.json({ Message: "Deleted successfully" });
      }

      return res.json({ Message: "You cannot remove group" });
    } catch (error) {
      return res.json({ Message: error });
    }
  };
}
