import { Request, Response } from "express";
import mongoose from "mongoose";

export abstract class BaseService {
  model: any;

  constructor(model: any) {
    this.model = model;
  }

  // Get all

  // getAll = async (req: Request, res: Response) => {
  //   try {
  //     const docs = await this.model.find({});
  //     res.status(200).json(docs);
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };

  // // Get by ID

  // getByID = async (req: Request, res: Response) => {
  //   try {
  //     const item = this.model.findOne({ _id: req.params.id });
  //     res.status(200).json(item);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  // Post

  create = async (item: any) => {
  
  const newItem = new this.model(item);
  await newItem.save();

  return newItem

  };

  // Delete by ID

  // delete = async (req: Request, res: Response) => {
  //   try {
  //     await this.model.findOneAndDelete({ _id: req.params.id });
  //     res.json({ response: "Deleted successfully" });
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };
}
