import {Body, Controller, Delete, Get, HttpCode, HttpException, HttpStatus, Param, Patch, Post} from '@nestjs/common';
import {UserService} from './user.service';
import {NewUserDto} from "./dto/new-user.dto";
import {ObjUserInterface, UpdateUserInterface} from "./types";

@Controller('/user')
export class UserController {
    constructor(private readonly userService: UserService) {
    }

    @HttpCode(200)
    @Get('/')
    findAll() {
        return this.userService.findAll();
    }

    @HttpCode(201)
    @Post('/')
    create(@Body() user: NewUserDto) {
        return this.userService.create(user);
    }

    @HttpCode(200)
    @Get('/:id')
    findOne(@Param('id') id: string): Promise<ObjUserInterface> {
        return this.userService.findOne(id);
    }

    @HttpCode(200)
    @Patch('/:id')
    update(@Param('id') id: string, @Body() updatedUser: UpdateUserInterface) {
        return this.userService.update(id, updatedUser)
    }

    //admin tylko
    @HttpCode(204)
    @Delete('/:id')
    remove(@Param('id') id: string) {
        return this.userService.remove(id);
    }

    @Post('/reset/password')
    reset(@Body('refreshToken') refreshToken: string,
          @Body('password') password: string,
          @Body('passwordRepeat') passwordRepeat: string) {

        if(password !== passwordRepeat) {
            throw new HttpException('Password are not equal', HttpStatus.BAD_REQUEST);
        }
        return this.userService.changePassword(refreshToken, password);
    }
}
