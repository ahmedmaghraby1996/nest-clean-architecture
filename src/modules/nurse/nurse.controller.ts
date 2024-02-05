import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { NurseService } from './nurse.service';
import { NurseOrderRequest } from './dto/request/nurse-order-request';

import { ActionResponse } from 'src/core/base/responses/action.response';

import { PaginatedRequest } from 'src/core/base/requests/paginated.request';
import { PaginatedResponse } from 'src/core/base/responses/paginated.response';
import { ApiTags, ApiHeader, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../authentication/guards/jwt-auth.guard';
import { RolesGuard } from '../authentication/guards/roles.guard';
import { applyQueryIncludes } from 'src/core/helpers/service-related.helper';
import { User } from 'src/infrastructure/entities/user/user.entity';
import { plainToInstance } from 'class-transformer';
import { NurseOrderResponse } from './dto/respone/nurse-order.response';
import { NurseOfferRequest } from './dto/request/nurse-offer-request';

@ApiTags('Nusre')
@ApiHeader({
  name: 'Accept-Language',
  required: false,
  description: 'Language header: en, ar',
})
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
@Controller('nurse')
export class NurseController {
  constructor(
    @Inject(NurseService) private readonly nurseService: NurseService,
  ) {}

  @Post('order')
  async createNurseorder(@Body() request: NurseOrderRequest) {
    return new ActionResponse(
      await this.nurseService.createNurseOrder(request),
    );
  }

  @Post('order/offer')
  async createNurseOffer(@Body() request: NurseOfferRequest) {
    return new ActionResponse(await this.nurseService.sendOffer(request));
  }

  @Get('order')
  async getNurseOrder(@Query() query: PaginatedRequest) {
    applyQueryIncludes(query, 'user');
    applyQueryIncludes(query, 'address');
    const orders = await this.nurseService.findAll(query);
    const order_response = plainToInstance(NurseOrderResponse, orders);
    if (query.page && query.limit) {
      const total = await this.nurseService.count();
      return new PaginatedResponse(order_response, {
        meta: { total, ...query },
      });
    } else return new ActionResponse(order_response);
  }
}
