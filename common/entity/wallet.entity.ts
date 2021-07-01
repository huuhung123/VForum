
import { Entity, Column, ManyToOne } from 'typeorm'

import Model from './model.entity'

// import { User } from './User'


@Entity('wallet')
export class Wallet extends Model {
  @Column()
  amount: number

  @Column()
  type: string

//   @ManyToOne(() => User)
//   userId: User
}
