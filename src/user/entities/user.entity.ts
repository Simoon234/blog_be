import { BlogEntity } from "src/blog/entities/blog.entity";
import {BaseEntity, Column, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {UserInterface} from "../types";
import {Role} from "../../auth/types";

@Entity()
export class UserEntity extends BaseEntity implements UserInterface {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        length: 30
    })
    authorNickName: string;

    @Column({
        nullable: true,
        default: null
    })
    avatarUrl: string;

    @Column({
        length: 250,
        unique: true
    })
    email: string;

    @Column({
        length: 25,
        nullable: false
    })
    name: string;

    @Column({
        length: 300,
        nullable: false,
    })
    password: string;

    @Column({nullable: false, length: 522})
    details: string;

    @Column({
        nullable: true,
        default: null
    })
    accessToken: string;

    @Column({
        nullable: true,
        default: null
    })
    refreshToken: string;

    @Column({ type: 'enum', enum: Role, default: Role.USER })
    role: string;

    @Column({
        nullable: false,
        length: 20
    })
    gender: string;

    @OneToMany(() => BlogEntity, (entity) => entity.user)
    @JoinColumn()
    blog: BlogEntity;
}
