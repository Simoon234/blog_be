import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post, Res,
    UnauthorizedException, UploadedFiles,
    UseGuards,
    UseInterceptors
} from '@nestjs/common';
import {BlogService} from './blog.service';
import {NewBlogDtoInterface} from "./types";
import {BlogEntity} from "./entities/blog.entity";
import {JwtStrategy} from "../auth/guards/jwtGuard.guard";
import {UserObj} from "../decorators/user-obj.decorator";
import {UserEntity} from "../user/entities/user.entity";
import {Roles} from "../decorators/roles.decorator";
import {Role} from "../auth/types";
import {RolesGuard} from "../auth/roles.guard";
import {ObjUserInterface} from "../user/types";
import * as path from "path";
import {FileFieldsInterceptor} from "@nestjs/platform-express";
import {multerStorage, storageDirectory} from "../utils/storage";

@Controller('blog')
export class BlogController {
    constructor(private readonly blogService: BlogService) {
    }

    @Roles(Role.ADMIN)
    @UseGuards(JwtStrategy, RolesGuard)
    @Get('/admin')
    findAll(@UserObj() user: UserEntity): Promise<BlogEntity[]> {
        return this.blogService.findAll();
    }

    @Get('/')
    getAll() {
      return this.blogService.getAll();
    }

    @UseGuards(JwtStrategy)
    @Post('/')
    @UseInterceptors(
        FileFieldsInterceptor(
            [
                {
                    name: 'photo',
                    maxCount: 1,
                },
            ],
            {
                storage: multerStorage(path.join(storageDirectory(), 'blog-img')),
            },
        ),
    )
    create(@Body() blog: NewBlogDtoInterface, @UserObj() user: ObjUserInterface, @UploadedFiles() files: any,): Promise<BlogEntity> {
        return this.blogService.create(blog, user, files)
    }

    @Get('/photo/:id')
    getByPhoto(@Param('id') id: string, @Res() res: any){
        return this.blogService.getByPhoto(id,res)
    }


    @Get(':id')
    findOne(@Param('id') id: string, @UserObj() user: any) {
        return this.blogService.findOne(id);
    }

    @Get('/:category/:id')
    getOneByCatAndId(@Param('id') id: string, @Param('category') category: string) {
        return this.blogService.findOneByCatAndId(category, id);
    }

    // @UseGuards(JwtStrategy)
    @Get('/user/all/:userId')
    getAllByUserId(@Param('userId') id: string, @UserObj() user: any) {
        return this.blogService.getAllArticlesByUserId(id)
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() blog: NewBlogDtoInterface) {
        return this.blogService.update(id, blog)
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.blogService.remove(id);
    }
}
