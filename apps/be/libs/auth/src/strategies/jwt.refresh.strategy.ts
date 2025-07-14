import { ExtractJwt, Strategy } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { UserService } from '@app/user'

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(private readonly _userSerivce: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_REFRESH_SECRET,
    })
  }

  async validate(payload) {
    if (!payload.id) throw new UnauthorizedException()

    const user = await this._userSerivce.findOne(payload.id, {
      advantage: true,
    })

    if (new Date(payload.iat * 1000) < user.jwtValidFrom) {
      throw new UnauthorizedException()
    }

    if (!user) throw new UnauthorizedException()
    return user
  }
}
