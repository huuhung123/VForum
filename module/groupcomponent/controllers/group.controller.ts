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
      const { role, _id } = req.authorized_user;

      if (role === RoleCode.Admin || role === RoleCode.Moderator) {
        const formGroup: IGroupCreateForm = req.body;

        const check = await Group.find({ name: formGroup.name });
        if (check.length > 0) {
          return res.json({ Error: "Name is exist. Please enter again" });
        }

        formGroup.createdBy = _id;
        const group = await this.groupService.create(formGroup);

        return res.json(serialCreateGroup(group));
      }

      return res.json({ Error: "You cannot create group" });
    } catch (error) {
      return res.json({ Message: error });
    }
  };

  updateGroup = async (req: Request, res: Response) => {
    try {
      const { role, _id } = req.authorized_user;
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
              updatedBy: _id,
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
      const { role } = req.authorized_user;
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
        // callbackDeletePost() trong service

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
