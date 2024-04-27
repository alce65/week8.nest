import { Logger, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { CryptoService } from './crypto/crypto.service';

@Module({
  imports: [JwtModule],
  providers: [CryptoService, Logger],
  exports: [CryptoService],
})
export class CoreModule {}
