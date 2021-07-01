import {
  BaseEntity, Column, CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'
import { StatusCode } from '../../utils/constants'

  
export default abstract class Model extends BaseEntity {

  @PrimaryGeneratedColumn()
  id: string

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date

  @Column({
    type: "enum",
    enum: StatusCode,
    default: StatusCode.Active
  })
  status: StatusCode

  constructor(model?: Partial<any>) {
    super()
    Object.assign(this, model)
  }
}
