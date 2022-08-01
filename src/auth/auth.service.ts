import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { UserService } from "../user/user.service";
import { UserEntity } from "../user/entities/user.entity";
import { LogUserReq } from "./types";
import { Response } from "express";
import { sign } from "jsonwebtoken";
import { v4 as uuid } from "uuid";
import { compare } from "bcrypt";
import { MailService } from "../mail/mail.service";
import { UserPassword } from "./auth.controller";


@Injectable()
export class AuthService {
  constructor(@Inject(UserService) private userService: UserService, private mailService: MailService) {
  }

  private static createToken(currentTokenId: string): { accessToken: string, expiresIn: number } {
    const payload: { id: string } = {
      id: currentTokenId
    };
    const expiresIn = 60 * 60 * 24;
    const accessToken = sign(payload, process.env.SECRET, {
      expiresIn
    });

    return {
      accessToken,
      expiresIn
    };
  }


  private static async generateToken(user: UserEntity): Promise<string> {
    let token;
    let refreshToken;
    let userWithTheSameToken = null;

    do {
      token = uuid();
      refreshToken = uuid();
      userWithTheSameToken = await UserEntity.findOne({
        where: {
          accessToken: token
        }
      });
    } while (!!userWithTheSameToken);

    user.accessToken = token;
    await user.save();

    return token;
  }

  private static async comparePassword(password: string, hashPassword: string) {
    return compare(password, hashPassword);
  }

  async login(req: LogUserReq, res: Response): Promise<any> {
    const { email, password } = req;

    try {
      const user = await UserEntity.findOne({
        where: {
          email
        }
      });

      if (user.accessToken) {
        return res.json({
          message: "You are already logged in."
        });
      }

      const pwd = await AuthService.comparePassword(password, user.password);

      if (!user || pwd === false) {
        return res.json({ error: "Invalid login" });
      }

      const token = AuthService.createToken(
        await AuthService.generateToken(user),
      );

      return res
        .cookie("jwt", token.accessToken, {
          secure: false,
          domain: "localhost",
          httpOnly: true
        })
        .json({
          id: user.id,
          email: user.email,
          authorNickName: user.authorNickName
        });

    } catch (e) {
      return res.json({ error: e.message });
    }
  }

  async logout(user: UserEntity, res: any) {
    try {
      user.accessToken = null;
      await user.save();
      res.clearCookie("jwt", {
        secure: false,
        domain: "localhost",
        httpOnly: true
      });
      return res.json({
        message: "Logged out."
      });
    } catch (err) {
      res.json({
        error: err.message
      });
    }
  }

  async forgot({ email }: UserPassword) {
    const user = await UserEntity.findOne({
      where: {
        email
      }
    });

    if (!user) {
      throw new HttpException("No user found", HttpStatus.NOT_FOUND);
    }

    if (!user.email) {
      throw new HttpException(`No user with that: (${email}) email`, HttpStatus.BAD_REQUEST);
    }


    user.refreshToken = sign({ email: user.email }, "1", {
      expiresIn: "30s"
    });
    await user.save();

    const url = `http://localhost:3000/reset/${user.refreshToken}`;

    await this.mailService.sendMail(user.email, "Password reset", `<p>Click <a href="http://localhost:3000/rower">here</a> to reset your password</p>`);

    return {
      message: "Check your email address."
    };
  }
}
