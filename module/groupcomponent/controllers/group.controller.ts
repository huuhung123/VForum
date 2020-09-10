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
      const result = await Group.find(
        { status: StatusCode.Active },
        "name createdBy createdAt"
      );
      return res.json({ data: result });
    } catch (error) {
      return res.json({ error: error });
    }
  };

  getGroup = async (req: Request, res: Response) => {
    try {
      const { group_id } = req.params;

      const result = await Group.find(
        {
          status: StatusCode.Active,
          _id: group_id,
        },
        "name createdBy createdAt"
      );
      return res.json({ data: result });
    } catch (error) {
      return res.json({ error: error });
    }
  };
  // xoa roi tao cai moi thi ntn ???
  createGroup = async (req: Request, res: Response) => {
    try {
      const { role, display_name } = req.authorized_user;
      console.log(role);
      if (role === RoleCode.Admin || role === RoleCode.Moderator) {
        const formGroup: IGroupCreateForm = req.body;

        const check = await Group.find({
          name: formGroup.name,
          status: StatusCode.Active,
        });
        if (check.length > 0) {
          return res.json({
            error: "Name has been existed. Please enter name again",
          });
        }

        formGroup.createdBy = display_name;
        const group = await this.groupService.create(formGroup);

        return res.json({
          message: "You have been created group successfully",
        });
        // return res.json(serialCreateGroup(group));
      }

      return res.json({ error: "You cannot create group, you aren't admin" });
    } catch (error) {
      return res.json({ error: error });
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
            error: "Group has been deleted. You can not update",
          });
        }

        if (check.name === formGroup.name) {
          return res.json({ error: "Sorry!. Please enter name again" });
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

        // return res.json(serialUpdateGroup(group));
        return res.json({
          message: "You have been updated group successfully",
        });
      }

      return res.json({ message: "You cannot update group" });
    } catch (error) {
      return res.json({ error: error });
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
            error: "Group has been deleted. You can not delete",
          });
        }

        await Group.findByIdAndUpdate(group_id, {
          $set: {
            status: StatusCode.Deactive,
          },
        });
        await this.groupService.callbackDeleteTopic(group_id);
        await this.groupService.callbackDeletePost(group_id);
        await this.groupService.callbackDeleteCommentPost(group_id);

        return res.json({ message: "You Deleted group successfully" });
      }

      return res.json({ error: "You cannot delete group" });
    } catch (error) {
      return res.json({ error: error });
    }
  };
}
