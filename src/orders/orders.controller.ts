import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, ParseIntPipe, ParseUUIDPipe, Query } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { NATS_SERVICE, ORDER_SERVICE } from 'src/config';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError, firstValueFrom, throwError } from 'rxjs';
import { PaginationDto } from 'src/common';
import { OrderPaginationDto, StatusDto } from './dto';

@Controller('orders')
export class OrdersController {
  constructor(
    //@Inject(ORDER_SERVICE) private readonly ordersClient: ClientProxy, //-> TCP
    @Inject(NATS_SERVICE) private readonly client: ClientProxy,
  ) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.client.send('createOrder',createOrderDto)
  }

  @Get()
  findAll(@Query() orderPaginationDto: OrderPaginationDto) {
    return this.client.send('findAllOrders',orderPaginationDto)
  }

  @Get('id/:id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    try {
      const order = await firstValueFrom(
        this.client.send('findOneOrder',{id})
      )
      return order;
    } catch (error) {
      throw new RpcException(error);
    }
  }
  @Get(':status')
  async findAllByStatus(
    @Param() statusDto: StatusDto,
    @Query() paginationDto: PaginationDto
  ) {
    try {
      return this.client.send('findAllOrders', {
        ...paginationDto,
        status:statusDto.status
      })
    } catch (error) {
      throw new RpcException(error);
    }
  } 

  @Patch(':id')
  changeStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() statusDto: StatusDto
  ) {
      return this.client.send('chageOrderStatus', {
        id,
        status:statusDto.status
      }).pipe(
        catchError(err=>{throw new RpcException(err)})
      )
  }

}
