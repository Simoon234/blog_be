import {BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {BlogEntityInterface} from "../types";
import {UserEntity} from "../../user/entities/user.entity";
import {ObjUserInterface} from "../../user/types";

@Entity()
export class BlogEntity extends BaseEntity implements BlogEntityInterface {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({length: 100})
    title: string;

    @Column({length: 10000})
    description: string;

    @Column({
        nullable: true,
        default: null,
    })
    photo: string;

    @Column()
    createdAt: string;

    @Column()
    category: string;

    @ManyToOne(() => UserEntity, (entity) => entity.blog)
    user: ObjUserInterface

}
