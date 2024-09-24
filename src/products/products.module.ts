import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { envs, NATS_SERVICE, PRODUCT_SERVICE } from 'src/config';
import { NatsModule } from 'src/transports/nats.module';

@Module({
  controllers: [ProductsController],
  imports: [NatsModule]
})
export class ProductsModule {}
