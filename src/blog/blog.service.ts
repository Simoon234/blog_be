import {Inject, Injectable} from '@nestjs/common';
import {BlogEntity} from "./entities/blog.entity";
import {NewBlogDto} from "./dto/new-blog.dto";
import {Deleted, DeletedBlogInterface, UpdatedBlogInterface} from "./types";
import {UpdatedBlogDto} from "./dto/updated-blog.dto";
import {handleError} from "../utils/handleError";
import {MailService} from 'src/mail/mail.service';
import {ObjUserInterface} from "../user/types";
import * as fs from "fs";
import * as path from "path";
import { storageDirectory } from 'src/utils/storage';

@Injectable()
export class BlogService {
    constructor(@Inject(MailService) private mailService: MailService) {
    }

    private static filter(user: ObjUserInterface) {
        const {name, authorNickName, avatarUrl, id, email, details} = user;
        return {name, authorNickName, avatarUrl, id, email, details};
    }

    async findAll(): Promise<BlogEntity[]> {
        const blogs = await BlogEntity.find({
            relations: ['user']
        });

        if (blogs.length <= 0) handleError('No blogs found in database!', 404)
        return blogs;
    }

    async getAll() {
        const blogs = await BlogEntity.find({
            relations: ['user']
        });
        if (blogs.length <= 0) handleError('No blogs found in database!', 404)
        return blogs.map((item) => {
            return {
                ...item,
                user: BlogService.filter({
                    id: item.user.id,
                    email: item.user.email,
                    authorNickName: item.user.authorNickName,
                    avatarUrl: item.user.avatarUrl,
                    name: item.user.name,
                    details: item.user.details
                })
            }
        });
    }

    async findOne(id: string): Promise<BlogEntity> {
        const blog = await BlogEntity.findOne({
            where: {id}
        })
        if (!blog) handleError(`Blog with that id (${id}) does not exist.`, 400);

        return blog;
    }

    async create(singleBlog: NewBlogDto, user: ObjUserInterface, files: any): Promise<BlogEntity> {
        const {description, title, photo, category} = singleBlog;
        const img = files?.photo?.[0] ?? null;

        try {
            const newBlog = new BlogEntity();

            newBlog.title = title;
            newBlog.description = description;
            newBlog.category = category;
            newBlog.createdAt = new Date().toLocaleString('de-DE', {timeZone: 'UTC'});
            await newBlog.save();

            if (img) {
                newBlog.photo = img.filename;
            }
            newBlog.user = BlogService.filter(user);
            await newBlog.save();

            return newBlog;
        } catch (e) {
            try {
                if (photo) {
                    fs.unlinkSync(
                        path.join(storageDirectory(), 'photo', img.filename),
                    );
                }
            } catch (err2) {
                throw new Error(err2.message);
            }

            throw new Error(e);
        }

    }

    async update(id: string, newUpdatedBlog: UpdatedBlogDto): Promise<UpdatedBlogInterface> {
        const {photo, description, title} = newUpdatedBlog;
        const blog = await BlogEntity
            .createQueryBuilder()
            .update(BlogEntity)
            .set({title, description, photo})
            .where("id = :id", {id})
            .execute()

        if (blog.affected === 0) handleError('You did not updated blog properly. Please try again later.', 400);
        return {
            id,
            success: true
        };
    }

    async remove(id: string): Promise<DeletedBlogInterface> {
        const blog = await BlogEntity.findOne({where: {id}});
        if (!blog) handleError('No blog found', 400);

        await BlogEntity.remove(blog);

        return {
            id,
            message: Deleted.DELETED,
            success: true
        }
    }

    async getAllArticlesByUserId(id: string): Promise<BlogEntity[]> {
        return await BlogEntity.find({
            where: {
                user: {
                    id
                }
            },
        });
    }

    async getByPhoto(id: string, res: any) {
        try {
            const singlePhoto = await BlogEntity.findOne({where: {id}})
            if (!singlePhoto) {
                throw new Error('No object')
            }
            if (!singlePhoto.photo) {
                throw new Error('No photo in entity')
            }

            res.sendFile(
                singlePhoto.photo, {
                    root: path.join(storageDirectory(), 'blog-img')
                }
            )
        } catch (e) {
            res.json({
                message: e.message
            })
        }
    }

    async findOneByCatAndId(category: string, id: string) {
        return await BlogEntity.findOne({
            where: {
                category,
                id
            }
        })
    }
}
