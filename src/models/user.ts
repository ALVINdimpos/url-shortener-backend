import { Table, Column, Model, DataType, HasMany } from "sequelize-typescript";
import { Url } from "./url";
import { v4 as uuidv4 } from "uuid";

@Table({
  tableName: "users",
  timestamps: true,
  underscored: true,
})
export class User extends Model {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: () => uuidv4(),
  })
  id!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  email!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  username!: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  password!: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    field: "google_id",
  })
  google_id!: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    field: "github_id",
  })
  github_id!: string;

  @HasMany(() => Url)
  urls!: Url[];
}
