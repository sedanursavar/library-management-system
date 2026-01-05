import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) {}

    async register(registerDto: RegisterDto) {
        // Email kontrolü
        const existingUser = await this.usersService.findByEmail(registerDto.email);
        if (existingUser) {
            throw new ConflictException('Bu email zaten kayıtlı');
        }

        // Şifreyi hashle
        const hashedPassword = await bcrypt.hash(registerDto.password, 10);

        // Kullanıcı oluştur
        const user = await this.usersService.create({
            ...registerDto,
            password: hashedPassword,
        });

        // Token oluştur
        const token = this.generateToken(user);

        return {
            message: 'Kayıt başarılı',
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
            access_token: token,
        };
    }

    async login(loginDto: LoginDto) {
        const user = await this.usersService.findByEmail(loginDto.email);
        if (!user) {
            throw new UnauthorizedException('Email veya şifre hatalı');
        }

        const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Email veya şifre hatalı');
        }

        const token = this.generateToken(user);

        return {
            message: 'Giriş başarılı',
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
            access_token: token,
        };
    }

    private generateToken(user: any): string {
        const payload = { sub: user.id, email: user.email, role: user.role };
        return this.jwtService.sign(payload);
    }
}
