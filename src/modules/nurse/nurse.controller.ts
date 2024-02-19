import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Put,
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
import { applyQueryIncludes, applyQuerySort } from 'src/core/helpers/service-related.helper';
import { User } from 'src/infrastructure/entities/user/user.entity';
import { plainToInstance } from 'class-transformer';
import { NurseOrderResponse } from './dto/respone/nurse-order.response';
import { NurseOfferRequest } from './dto/request/nurse-offer-request';
import { NurseOfferResponse } from './dto/respone/nurse-offer.response';
import { UpdateNurseRequest } from './dto/request/update-nurse-request';

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

  @Get('order/:id/offers')
  async getNurseOffer(@Param('id') id: string) {
    return new ActionResponse(
      plainToInstance(
        NurseOfferResponse,
        await this.nurseService.getOffers(id),
      ),
    );
  }

  @Get('order')
  async getNurseOrder(@Query() query: PaginatedRequest) {
    applyQueryIncludes(query, 'user');
    applyQuerySort(query, 'created_at=desc');
    applyQueryIncludes(query, 'address');
    const nurse = await this.nurseService.getNurse(
      this.nurseService.currentUser.id,
    );
    const orders = await this.nurseService.findAll(query);
    const order_response = await Promise.all(
      orders.map(async (order) => {
        return plainToInstance(NurseOrderResponse, {
          ...order,
          sent_offer: await this.nurseService.sentOffer(
            order.id,

            nurse===null?null:nurse.id,
          ),
        });
      }),
    );
    if (query.page && query.limit) {
      const total = await this.nurseService.count(query);
      return new PaginatedResponse(order_response, {
        meta: { total, ...query },
      });
    } else return new ActionResponse(order_response);
  }

  @Post('accept/offer/:id')
  async acceptOffer(@Param('id') id: string) {
    return new ActionResponse(await this.nurseService.acceptOffer(id));
  }

}
