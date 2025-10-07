import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as argon2 from 'argon2';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async register(payload: RegisterDto) {
    const passwordHash = await argon2.hash(payload.password);
    const user = await this.prisma.user.create({
      data: {
        email: payload.email,
        passwordHash,
        fullName: payload.fullName
      }
    });
    return { id: user.id, email: user.email, fullName: user.fullName };
  }

  async login(payload: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: payload.email }
    });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const passwordValid = await argon2.verify(user.passwordHash, payload.password);
    if (!passwordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return {
      accessToken: 'mock-access-token',
      refreshToken: 'mock-refresh-token'
    };
  }

  async refresh(token: string) {
    if (!token) {
      throw new UnauthorizedException('Refresh token is required');
    }
    return { accessToken: 'mock-access-token', refreshToken: token };
  }
}
