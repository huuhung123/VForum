import { Request, Response } from "express";
import mongoose from "mongoose";

export abstract class BaseService {
  model: any;

  constructor(model: any) {
    this.model = model;
  }

  create = async (item: any) => {
    try {
      const newItem = new this.model(item);
      await newItem.save();
      return newItem;
    } catch (error) {
      console.log(error);
    }
  };

  findByEmail = async (item: any) => {
    try {
      const checkedEmail = await this.model.find({ email: item.email });
      return checkedEmail;
    } catch (error) {
      console.log(error);
    }
  };

  findByIdAndDelete = async (item: any) => {
    try {
      const checkedId = await this.model.findById(item);
      if (checkedId) {
        await this.model.findOneAndDelete({ _id: item });
        return checkedId;
      }
      return checkedId;
    } catch (error) {
      console.log(error);
    }
  };

  findById = async (item: any) => {
    try {
      const checkedId = await this.model.findById(item.id);
      return checkedId;
    } catch (error) {
      console.log(error);
    }
  };
}
