import { ForbiddenException, Injectable } from '@nestjs/common'
import type { ConfigService } from '@nestjs/config'
import type { JwtService } from '@nestjs/jwt'
import * as argon from 'argon2'

import type { PrismaService } from '../prisma/prisma.service'
import type { AuthDto } from './dto'

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwt: JwtService, private config: ConfigService) {}

  async signup(dto: AuthDto) {
    const password = await argon.hash(dto.password)

    try {
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          password,
        },
      })
      return this.signToken(user.id, user.email)
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ForbiddenException('Credentials taken')
      }

      throw error
    }
  }

  async signin(dto: AuthDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    })
    if (!user) {
      throw new ForbiddenException('Credentials incorrect')
    }
    const passwordMatches = await argon.verify(user.password, dto.password)
    if (!passwordMatches) {
      throw new ForbiddenException('Credentials incorrect')
    }
    return this.signToken(user.id, user.email)
  }
  async signToken(userId: number, email: string): Promise<{ acces_token: string; email: string }> {
    const payload = {
      sub: userId,
      email,
    }
    const secret = this.config.get('JWT_SECRET')

    const token = await this.jwt.signAsync(payload, {
      expiresIn: '120m',
      secret,
    })

    return {
      acces_token: token,
      email: email,
    }
  }
}
