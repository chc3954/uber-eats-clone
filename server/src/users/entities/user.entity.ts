import { CoreEntity } from 'src/common/entities/core.entity';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

type UserRole = 'client' | 'owner' | 'delivery';

@Entity()
export class User extends CoreEntity {
  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  role: UserRole;
}
