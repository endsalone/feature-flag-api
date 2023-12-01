import { Expose } from 'class-transformer';
import { Secret } from 'modules/organization/domain/secret';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('secrets')
export class SecretEntity implements Secret {
  @Expose()
  @PrimaryGeneratedColumn()
  id: number;

  @Expose()
  @Column({ type: 'character varying', length: 120, nullable: false })
  server: string;

  @Expose()
  @Column({ type: 'character varying', length: 120, nullable: false })
  client: string;

  @Expose()
  @Column({ type: 'character varying', length: 120, nullable: false })
  mobile: string;
}
