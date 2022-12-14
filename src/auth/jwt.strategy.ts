import {Strategy} from 'passport-jwt';
import {PassportStrategy} from '@nestjs/passport';
import {Injectable, UnauthorizedException} from '@nestjs/common';
import {UserEntity} from "../user/entities/user.entity";


function cookieExtract(req: any): null | string {
    return (req && req.cookies) ? (req.cookies?.jwt ?? null) : null;
}

@Injectable()
export class JwtStr extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: cookieExtract,
            secretOrKey: process.env.SECRET
        });
    }

    async validate(payload: any, done: (err, user) => void) {

        if (!payload && !payload.id) {
            return done(new UnauthorizedException(), false);
        }

        const user = await UserEntity.findOne({
            where: {accessToken: payload.id}
        })

        if(!user) {
            return done(new UnauthorizedException(), false)
        }

        done(null, user);
    }
}