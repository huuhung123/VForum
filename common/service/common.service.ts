import { response } from "express";
import { StatusCode } from "../../utils/constants";

export abstract class BaseService {
  model: any;

  constructor(model: any) {
    this.model = model;
  }

  create = async (item: any, filter: object = {}) => {
    try {
      const check = await this.model.find({
        type: item.type,
        status: StatusCode.Active,
        ...filter
      });
      if (check.length > 0) {
        return {
          error: new Error("Type has been existed. Please enter type again")
        }
      }
      const newItem = new this.model(item);
      await newItem.save();
      return {
        data: newItem
      }
    } catch (error) {
        return { error: new Error(error)};
    }
  };

  update = async (id: any, item: any, filter: object = {}) => {
    try {
      const check = await this.model.find({
        _id: id,
        status: StatusCode.Deactive,
        ...filter
     });
    if (check.length > 0) {
      return {
        error: new Error("Item has been deleted. You can not update item")
      }
    }
    const updateItem = await this.model.findByIdAndUpdate(id, item, { new: true })
      return {
        data: updateItem
      }
    } catch (error) {
      return { error: new Error(error)};
    }
  };

  getAll = async (filter: object = {}) => {
    try {
       const getAll =  await this.model.find({ status: StatusCode.Active, ...filter})
        
       return {
          data: getAll
        }
    } catch (error) {
      return {
        error: new Error(error)
      }
    }
  };

  getById = async (id: any) => {
    try {
      const item =  await this.model.find({ status: StatusCode.Active, _id: id})
      return {
         data: item
       }

    } catch (error) {
     return {
       error: new Error(error)
     }
   }
  };

  deleteById = async (id: any) => {
    try {
      const check = await this.model.find({
        _id: id,
        status: StatusCode.Deactive,
    });
    if (check.length > 0) {
      return {
        error: new Error("Item has been deleted. You can not delete item")
      }
    }
    await this.model.findByIdAndUpdate(id, {status: StatusCode.Deactive} ,{ new: true })
    
    return { result: 'success' };
    } catch (error) {
      return {
        error: new Error(error)
      }
    }
  };
  
}
