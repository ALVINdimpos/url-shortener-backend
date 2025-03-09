import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import { User } from "./user";
import { v4 as uuidv4 } from "uuid";

@Table({ tableName: "urls", timestamps: true })
export class Url extends Model {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: () => uuidv4(),
  })
  id!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  short_code!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  long_url!: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  user_id!: string;

  @Column({
    type: DataType.INTEGER,
    defaultValue: 0,
  })
  clicks!: number;

  @BelongsTo(() => User)
  user!: User;
}
