import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { User } from '../entities/user.entity.js';
import { RegisterDto, LoginDto } from './dto/auth.dto.js';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto): Promise<{ token: string; user: Partial<User> }> {
    const existing = await this.userRepo.findOne({ where: { email: dto.email } });
    if (existing) throw new ConflictException('Email already registered');

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = this.userRepo.create({
      email: dto.email,
      name: dto.name,
      password: hashedPassword,
    });
    const saved = await this.userRepo.save(user) as unknown as User;
    const token = this.jwtService.sign({ sub: saved.id, email: saved.email });
    const { password, ...userWithoutPassword } = saved;
    return { token, user: userWithoutPassword };
  }

  async login(dto: LoginDto): Promise<{ token: string; user: Partial<User> }> {
    const user = await this.userRepo.findOne({ where: { email: dto.email } });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const valid = await bcrypt.compare(dto.password, user.password);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    const token = this.jwtService.sign({ sub: user.id, email: user.email });
    const { password, ...userWithoutPassword } = user;
    return { token, user: userWithoutPassword };
  }

  async getProfile(userId: number): Promise<Partial<User> | null> {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) return null;
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}
