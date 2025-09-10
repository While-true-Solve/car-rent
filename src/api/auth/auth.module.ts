import { Module } from '@nestjs/common';
import { AuthService } from './auht.service';
import { TokenService } from 'src/infrastructure/lib/token/Token';

@Module({
  providers: [AuthService, TokenService],
  exports: [AuthService],
})
export class AuthModule {}