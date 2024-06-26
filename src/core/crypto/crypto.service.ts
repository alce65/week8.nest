import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { hash, compare } from 'bcrypt';
import { SignUser, User } from 'src/users/entities/user.entity';

export type TokenPayload = {
  id: string;
  role: string;
};

@Injectable()
export class CryptoService {
  constructor(
    private readonly logger: Logger,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    this.logger.debug('Instantiated', 'CryptoService');
  }

  async hash(value: string) {
    return hash(value, 10);
  }

  async compare(value: string, hash: string) {
    return compare(value, hash);
  }

  async createToken({ id, role }: User | SignUser) {
    const payload: TokenPayload = { id, role };
    const token = await this.jwtService.signAsync(payload, {
      secret: this.configService.get('SECRET_JWT'),
    });
    return token;
  }

  async verifyToken(token: string) {
    return this.jwtService.verifyAsync<TokenPayload>(token, {
      secret: this.configService.get('SECRET_JWT'),
    });
  }
}
