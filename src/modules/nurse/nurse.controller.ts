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
import {
  applyQueryIncludes,
  applyQuerySort,
} from 'src/core/helpers/service-related.helper';
import { User } from 'src/infrastructure/entities/user/user.entity';
import { plainToInstance } from 'class-transformer';
import { NurseOrderResponse } from './dto/respone/nurse-order.response';
import { NurseOfferRequest } from './dto/request/nurse-offer-request';
import { NurseOfferResponse } from './dto/respone/nurse-offer.response';
import { UpdateNurseRequest } from './dto/request/update-nurse-request';
import { request } from 'http';


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











}
