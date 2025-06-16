import { promiseHelper, th } from '@app/helper'
import { UserEntity } from '@app/user/entities/user.entity'
import { BadRequestException, Injectable } from '@nestjs/common'
import { PrismaService } from 'nestjs-prisma'
import { ProfileUpdateDto } from './dtos/profile.update.dto'
import { ProfileEntity } from './entities/profile.entity'
import isEmail from 'validator/lib/isEmail'
import { Prisma } from '@prisma/client'

@Injectable()
export class ProfileService {
  constructor(private _prisma: PrismaService) {}

  async init(user: UserEntity) {
    if (user.profileId) {
      throw new BadRequestException('User has initialized the profile')
    }

    let name = user.name,
      email = null
    if (isEmail(user.username)) {
      name = name || user.username.split('@')[0]
      email = user.username
    }
    const profile = await promiseHelper.transactionRetry(() =>
      this._prisma.$transaction(
        async (p) => {
          const { profile } = await p.user.update({
            where: {
              id: user.id,
              profileId: null,
            },
            data: {
              profile: {
                create: {
                  name,
                  email,
                },
              },
            },
            select: { profile: true },
          })
          return profile
        },
        { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
      ),
    )
    return th.toInstanceSafe(ProfileEntity, profile)
  }

  async findAll(params) {
    const results = await this._prisma.profile.findMany(params)
    return results.map((r) => th.toInstanceSafe(ProfileEntity, r))
  }

  async findOne(id: bigint) {
    const profile = await this._prisma.profile.findUniqueOrThrow({ where: { id } })
    return th.toInstanceSafe(ProfileEntity, profile)
  }

  update(id: bigint, updateProfileDto: ProfileUpdateDto) {
    const updatedProfile = this._prisma.profile.update({
      where: { id },
      data: updateProfileDto,
    })
    return th.toInstanceSafe(ProfileEntity, updatedProfile)
  }

  remove(id: bigint) {
    return `This action removes a #${id} profile`
  }

  async findUserByWalletAddress(walletAddress: string): Promise<UserEntity | null> {
    const profile = await this._prisma.profile.findUnique({
      where: { walletAddress: walletAddress.toLowerCase() },
      include: { users: { select: { id: true } } },
    })

    if (profile && profile.users && profile.users.length > 0) {
      // Assuming one profile links to one user for wallet auth
      const user = await this._prisma.user.findUnique({
        where: { id: profile.users[0].id },
      })
      return user ? th.toInstanceSafe(UserEntity, user) : null
    }
    return null
  }
}
