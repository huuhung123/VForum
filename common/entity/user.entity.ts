
import { Column, Entity } from 'typeorm'
import Model from './model.entity'

@Entity('users')
export class User extends Model {
  @Column()
  email: string

  @Column()
  password: string

  @Column()
  phone_number: string
}
