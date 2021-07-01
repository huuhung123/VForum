import { Repository } from 'typeorm';
import { StatusCode } from '../../utils/constants';

export abstract class BaseAbstractRepository<T> {

  private entity: Repository<T>;

  protected constructor(entity: Repository<T>) {
    this.entity = entity;
  }
  public async create(data: T | any, filter: object = {}): Promise<T | object> {
    try {
      const check = await this.entity.find({
        where: {
          ...filter,
          status: StatusCode.Active
        }
      });
      if (check.length > 0) {
        return {
          error: new Error("Type has been existed. Please enter type again")
        }
      }
      const newItem =  await this.entity.save(data);
      return {
        data: newItem
      }
    } catch (error) {
        return { error: new Error(error)};
    }
  }

  public async getAll(filter: object = {}): Promise<T[] | object> {
    try {
      const data = await this.entity.find({
        where: {
          ...filter,
          status: StatusCode.Active
        }
      });
      return {
        data
      }
    } catch (error) {
        return { error: new Error(error)};
    }
  }

  public async getById(id: any): Promise<T | undefined | any> {
    try {
      const data = await this.entity.findOne({
        where: {
          id,
          status: StatusCode.Active
        }
      })      
      if (data) {
        return {
          data
        }
      }
      return { error: new Error("Cannot find item")}
    } catch (error) {
        return { error: new Error(error)};
    }
  }

  public async updateById(id: any, data: object): Promise<T | undefined | any> {
    try {
      const check = await this.entity.findOne({
        where: {
          id,
          status: StatusCode.Active
        }
      })      
      if (check) {
        const newItem = await this.entity.save({
          ...check,
          ...data
        })
        return {
          data: newItem
        }
      }
      return { error: new Error("Cannot find item")}
    } catch (error) {
        return { error: new Error(error)};
    }
  }

  public async deleteById(id: any): Promise<T | any | undefined> {
    return await this.updateById(
      id, 
      {status: StatusCode.Deactive}
    ) 
  }

  // public async  findWithRelations(relations: any): Promise<T[]> {
  //   return await this.entity.find(relations)
  // }

}