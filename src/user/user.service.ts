import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {UserEntity} from "./entities/user.entity";
import {handleError} from "../utils/handleError";
import {NewUserDto} from "./dto/new-user.dto";
import {QueryFailedError} from "typeorm";
import {DeletedUserResponse, NewUserCreatedInterface, ObjUserInterface, UpdateUserType} from "./types";
import {UpdateUser} from "./dto/update-user.dto";
import {v4 as uuid} from 'uuid';
import {hash} from "bcrypt";
import {hashPassword} from 'src/utils/hashPwd';
import {verify} from "jsonwebtoken";

@Injectable()
export class UserService {

    static async hashPassword(password: string) {
        return hash(password, 12);
    }

    private static filter(user: ObjUserInterface) {
        const {name, email, id, authorNickName, details, avatarUrl} = user;
        return {name, email, id, authorNickName};
    }

    async findAll() {
        const allUsers = await UserEntity.find();
        if (allUsers.length <= 0) {
            handleError('No users found', 400);
        }
        return allUsers.map(UserService.filter);
    }

    async create(user: NewUserDto): Promise<NewUserCreatedInterface> {
        try {
            const newUser = new UserEntity();
            const {email, name, authorNickName, password, gender} = user;
            const hashedPassword = await UserService.hashPassword(password);

            newUser.name = name;
            newUser.email = email;
            newUser.authorNickName = authorNickName;
            newUser.password = hashedPassword
            newUser.gender = gender
            newUser.refreshToken = uuid();

            await newUser.save();

            return {
                id: newUser.id,
                email: newUser.email,
                authorNickName: newUser.authorNickName
            };
        } catch (e) {
            if (e instanceof QueryFailedError) {
                handleError('Sorry, this email already exists', 400);
            }
            throw e;
        }
    }

    async findOne(id: string): Promise<ObjUserInterface> {
        const user = await UserEntity.findOne({where: {id}});
        if (!user) handleError(`${id} is not found`, 404);
        return {
            id: user.id,
            email: user.email,
            name: user.name,
            details: user.details,
            avatarUrl: user.avatarUrl,
            authorNickName: user.authorNickName,
            gender: user.gender
        }
    }

    async remove(id: string): Promise<DeletedUserResponse> {
        const user = await UserEntity.findOne({where: {id}});
        if (!user) handleError(`id: (${id}) was not found`, 404);
        await user.remove();

        return {
            id,
            success: true
        }
    }

    async update(id: string, newUser: UpdateUser): Promise<UpdateUserType> {
        const {email, password, avatarUrl, authorNickName} = newUser;
        const hashPassword = await UserService.hashPassword(password);
        const user = await UserEntity
            .createQueryBuilder()
            .update(UserEntity)
            .set({email, password: hashPassword, avatarUrl, authorNickName})
            .where('id = :id', {id})
            .execute();

        if (user.affected !== 1) {
            handleError('Something went wrong with updating. Make sure you passed correct data or your (id) is valid.', 400)
        } else {
            return {
                message: `${id} was successfully updated`
            }
        }
    }

    async findOneUserByEmail(email: string) {
        const user = await UserEntity.findOne({where: {email: email}});
        if (!user) handleError('User does not exist. Please, try again.', 404);
        return user;
    }

    async changePassword(refreshToken: string, password: string) {
        const pwd = await hashPassword(password);

        try {
            const token = verify(refreshToken, '1');

            if (!token) {
                throw new HttpException('No token provided', HttpStatus.BAD_REQUEST)
            }

            await UserEntity
                .createQueryBuilder()
                .update(UserEntity)
                .set({password: pwd})
                .where("refreshToken = :refreshToken", {
                    refreshToken
                })
                .execute()

            const clearAc = await UserEntity.findOne({
                where: {
                    refreshToken
                }
            })

            clearAc.accessToken = null;
            await clearAc.save();

            return {
                message: 'Password changed successfully'
            }
        } catch (err: any) {
            if (err.message === 'jwt expired') {
                return {
                    message: 'Sorry, link has expired.',
                    expired: (err.expiredAt).toLocaleDateString()
                }
            } else if (err.message === 'invalid token') {
                return {
                    message: 'Token is not valid',
                }
            }

            throw new Error(err.message);
        }

    }

}
