import { Injectable } from '@nestjs/common'

import type { PrismaService } from '../prisma/prisma.service'
import type { EditUserDto } from './dto'

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}
  async editUser(userId: number, dto: EditUserDto) {
    const user = await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        ...dto,
      },
    })
    
    return { user, password: undefined }
  }
}
