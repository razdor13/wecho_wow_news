import { Post } from 'src/post/entities/post.entity'
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number
  @Column()
  email: string
  @Column()
  username: string
  @Column()
  password: string
  @CreateDateColumn()
  createdAt: Date
  @UpdateDateColumn()
  updatedAt: Date
  @Column({ default: 'user' })
  role: 'user' | 'editor' | 'admin' // Ролі користувачів
  @OneToMany(() => Post, (post) => post.author)
  posts: Post[]
}
