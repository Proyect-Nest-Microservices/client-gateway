import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { envs } from './config/envs.config';
import { Logger, ValidationPipe } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { RpcCustomExceptionFilter } from './common';

async function bootstrap() {

  const logger = new Logger('Main-Gateway')
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted:true
    })
  )

  app.useGlobalFilters(new RpcCustomExceptionFilter())

  app.setGlobalPrefix('api')
  await app.listen(envs.PORT);
  logger.log(`Gateway running on port ${envs.PORT}`)
}
bootstrap();
