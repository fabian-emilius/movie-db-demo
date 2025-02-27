import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common'
import type { User } from '@prisma/client'

import { GetUser } from '../auth/decorator'
import { JwtGuard } from '../auth/guard'
import type { EditUserDto } from './dto'
import type { UserService } from './user.service'

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}
  @Get('me')
  getMe(@GetUser() user: User) {
    return user
  }
  @Patch()
  editUser(@GetUser('id') userId: number, @Body() dto: EditUserDto) {
    return this.userService.editUser(userId, dto)
  }
}
