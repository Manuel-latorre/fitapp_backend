import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { PlansModule } from './modules/plans/plans.module';

@Module({
  imports: [AuthModule, UsersModule, PlansModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
