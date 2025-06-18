import { Hash, th } from '@app/helper'
import { UserService } from '@app/user'
import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { User, UserProvider } from '@prisma/client'
import { UserJwtPayload as UserJwtPayload } from './models/user.jwt.payload'
import { TokenRefreshResDto, TokenResDto } from './dtos/token.res.dto'
import { RegisterDto } from './dtos/register.dto'
import { ProvidersRegisterService, SocialProviderType } from './services/providers-register.service'
import { ProfileService } from '@app/profile'
import { MailerService } from '@app/mailer'
import { ConfirmDto } from './dtos/confirm.dto'
import { ResetPasswordDto } from './dtos/reset-password.dto'
import { ConfirmResetPasswordDto } from './dtos/confirm.reset-password.dto'
import { Request } from 'express'
import { PrismaService } from 'nestjs-prisma'
import { UserEntity } from '@app/user/entities/user.entity'
import { SiweMessage, generateNonce as generateSiweNonce } from 'siwe'
import { Duration } from 'luxon'
import { ProfileEntity } from '@app/profile/entities/profile.entity'
import { GenerateNonceDto } from './dtos/generate-nonce.dto'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Cache } from 'cache-manager'
const VERIFY_CODE_EXPIRE_TIME = +process.env.VERIFY_CODE_EXPIRE_TIME

const NONCE_EXPIRY_IN_MS = Duration.fromDurationLike({ minutes: 5 }).toMillis()

@Injectable()
export class AuthService {
  constructor(
    private _userService: UserService,
    private _profileService: ProfileService,
    private jwtService: JwtService,
    private _providerRegister: ProvidersRegisterService,
    private _mailer: MailerService,
    private _prisma: PrismaService,
    @Inject(CACHE_MANAGER) private _cacheManager: Cache,
  ) {
    // Remove manual initialization from constructor
    // const redisUrl = this.configService.get<string>('REDIS_URL') || 'redis://localhost:6379';
    // this.redisClient = new Redis(redisUrl);
  }

  async initProfile(user: UserEntity) {
    const profile = await this._profileService.init(user)
    user.profileId = profile.id
    return th.toInstanceSafe(TokenResDto, {
      ...(await this.issueToken(user)),
      profile,
    })
  }

  async confirm(req: Request, dto: ConfirmDto) {
    // if (!process.env.UNIT_TEST) throw new HttpException('This feature is currently unsupported.', HttpStatus.GONE)
    const isWebRequest = !!req.headers.accept?.includes('text/html')
    const user = await this._userService.findLocalUserByVerifyCode(dto.code, {
      advantage: true,
    })
    let message = 'Nestjs Boilerplate Mail Confirmation Successfully, Please open mobile app to continue use'
    try {
      if (!user) throw new BadRequestException('Invalid code')
      if (user.confirmed) throw new BadRequestException('confirmed')
      const diff = Date.now() - user.verifyCreatedAt.getTime()
      if (diff > VERIFY_CODE_EXPIRE_TIME) {
        throw new BadRequestException('Code is expired')
      }
      const updatedUser = await this._userService.update(user.id, {
        confirmed: true,
        verifyCode: null,
      })

      if (!isWebRequest) {
        return this.issueToken(updatedUser)
      }
    } catch (error) {
      if (isWebRequest) {
        message = error.message
      } else {
        throw error
      }
    }

    return `
<!DOCTYPE html>
<html>
<title>Nestjs Boilerplate Mail Confirmation</title>
<body>

<h1>${message}</h1>

</body>
</html>
    `
  }

  async resendConfirmMail(user: UserEntity) {
    // if (!process.env.UNIT_TEST) throw new HttpException('This feature is currently unsupported.', HttpStatus.GONE)
    if (user.confirmed) throw new BadRequestException('confirmed')
    const verifyCode = Hash.randomHash()
    await this._userService.update(user.id, {
      verifyCode,
      verifyCreatedAt: new Date(),
    })
    return true
  }

  async resetPassword(dto: ResetPasswordDto) {
    // if (!process.env.UNIT_TEST)
    //   throw new HttpException(
    //     'This feature is currently unsupported. Kindly contact the administrator.',
    //     HttpStatus.GONE
    //   )
    const user = await this._userService.findUser(dto.username, 'LOCAL', {
      advantage: true,
    })

    if (user) {
      if (user.confirmed != true) {
        throw new ForbiddenException('Unconfirmed account')
      }
      const verifyCode = Hash.randomDigits()
      await this._userService.update(user.id, {
        verifyCode,
        verifyCreatedAt: new Date(),
      })
    } else {
      throw new NotFoundException('The email does not exist.')
    }
  }

  async confirmResetPassword(dto: ConfirmResetPasswordDto) {
    // if (!process.env.UNIT_TEST)
    //   throw new HttpException(
    //     'This feature is currently unsupported. Kindly use another sign-in method.',
    //     HttpStatus.GONE
    //   )
    const user = await this._userService.findUser(dto.username, 'LOCAL', {
      advantage: true,
    })
    if (!user) throw new BadRequestException('Invalid username')
    const diff = Date.now() - user.verifyCreatedAt.getTime()
    if (diff > VERIFY_CODE_EXPIRE_TIME) {
      throw new BadRequestException('Code is expired')
    } else if (user.verifyCode !== dto.code) {
      throw new BadRequestException('Invalid code')
    }
    const updatedUser = await this._userService.update(user.id, {
      verifyCode: null,
      verifyCodeCount: 0,
      password: Hash.make(dto.password),
    })
    return this.issueToken(updatedUser)
  }

  async validateUser(username: string, provider: UserProvider, pass: string): Promise<UserEntity> {
    const user: User | null = await this._userService.findUser(username, provider, { advantage: true })
    if (user && Hash.compare(pass, user.password)) {
      return th.toInstanceSafe(UserEntity, user)
    }
    return null
  }

  async issueToken(user: User, options = { updateLastLogin: true }) {
    const payload = th.toInstanceSafe(UserJwtPayload, user)
    if (options.updateLastLogin) {
      await this._userService.update(user.id, { lastLoginAt: new Date() })
    }
    let profile
    if (user.profileId) {
      profile = await this._profileService.findOne(user.profileId)
    }
    return th.toInstanceSafe(TokenResDto, {
      jwt: this.jwtService.sign(
        { ...payload },
        {
          secret: process.env.JWT_SECRET,
          expiresIn: process.env.JWT_EXPIRES,
        },
      ),
      jwtRefresh: this.jwtService.sign(
        { ...payload },
        {
          secret: process.env.JWT_REFRESH_SECRET,
          expiresIn: process.env.JWT_REFRESH_EXPIRES,
        },
      ),
      user: th.toInstanceSafe(UserEntity, user),
      profile: profile,
    })
  }

  async refreshToken(user: UserEntity) {
    const payload = th.toInstanceSafe(UserJwtPayload, user)
    return th.toInstanceSafe(TokenRefreshResDto, {
      jwt: this.jwtService.sign(
        { ...payload },
        {
          secret: process.env.JWT_SECRET,
          expiresIn: process.env.JWT_EXPIRES,
        },
      ),
    })
  }

  async register(req: Request, dto: RegisterDto, initSpa = false) {
    const passwordHash = Hash.make(dto.password)
    const verifyCode = Hash.randomHash()
    const user = await this._userService.create({
      ...dto,
      password: passwordHash,
      verifyCode,
      verifyCreatedAt: new Date(),
      confirmed: process.env.ENV !== 'spec', // TODO send mail to confirm
      provider: UserProvider.LOCAL,
      role: 'USER',
      lastLoginAt: new Date(),
    })
    return await this.issueToken(user, { updateLastLogin: false })
  }

  async callback(provider: SocialProviderType, accessToken: string) {
    const profile = await this._providerRegister.run(provider, accessToken)
    console.log('profile', profile)
    let user = await this._userService.findUser(profile.email, provider, {
      advantage: true,
    })
    if (!user) {
      user = await this._userService.create({
        username: profile.email,
        provider,
        name: profile.username,
        confirmed: true, // TODO send mail to confirm
        lastLoginAt: new Date(),
      })
      return await this.issueToken(user, { updateLastLogin: false })
    } else {
      if (user.blocked) {
        throw new UnauthorizedException('You are blocked')
      }
      return await this.issueToken(user)
    }
  }

  async generateNonce(address?: string): Promise<GenerateNonceDto> {
    const nonce = generateSiweNonce()
    const key = address ? `nonce:${address}:${nonce}` : `nonce:${nonce}`
    await this._cacheManager.set(key, true, NONCE_EXPIRY_IN_MS)
    return th.toInstanceSafe(GenerateNonceDto, { nonce })
  }

  async verifySiweSignature(message: string, signature: string): Promise<TokenResDto> {
    const siweMessage = new SiweMessage(message)
    const nonce = siweMessage.nonce
    const address = siweMessage.address
    const key = address ? `nonce:${address}:${nonce}` : `nonce:${nonce}`

    // Check if nonce exists in Redis and delete it atomically to avoid replay attacks
    const cachedNonce = await this._cacheManager.get<string>(key)
    if (!cachedNonce) {
      throw new UnauthorizedException('Invalid or expired nonce.')
    } else {
      await this._cacheManager.del(key)
    }

    try {
      const { data: verifiedData } = await siweMessage.verify({ signature })

      const walletAddress = verifiedData.address

      const user = await this._profileService.findUserByWalletAddress(walletAddress)
      if (!user) {
        throw new UnauthorizedException('Admin not found.')
      }

      if (user.blocked) {
        throw new UnauthorizedException('Admin account is blocked.')
      }

      return await this.issueToken(user)
    } catch (error) {
      console.error('SIWE signature verification failed:', error)
      if (error instanceof Error && error.message.includes('Signature does not match')) {
        throw new UnauthorizedException('Invalid signature.')
      }
      throw new UnauthorizedException('SIWE signature verification failed.')
    }
  }

  async signOut(token: string): Promise<void> {
    try {
      const decoded = this.jwtService.decode(token) as { jti?: string; exp?: number }
      const exp = decoded?.exp

      if (exp) {
        const ttl = exp * 1000 - Date.now() // Calculate remaining time in milliseconds
        if (ttl > 0) {
          const key = `blacklist:${token}`
          console.log(`Blacklisting token ${token} with TTL: ${ttl}ms`)
          await this._cacheManager.set(key, 'true', ttl)
        } else {
          console.log(`Token ${token} already expired, not adding to blacklist.`)
        }
      } else {
        console.warn('Could not extract expiry from token for blacklisting.')
      }
    } catch (error) {
      console.error('Error blacklisting token:', error)
    }
  }
}
