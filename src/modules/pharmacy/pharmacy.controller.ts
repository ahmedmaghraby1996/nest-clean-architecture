import { Body, Controller, Get, Inject, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiHeader, ApiTags } from '@nestjs/swagger';
import { ActionResponse } from 'src/core/base/responses/action.response';
import { PharmacyService } from './pharmacy.service';
import { I18nResponse } from 'src/core/helpers/i18n.helper';
import { query } from 'express';
import { FindDrugQuery } from './dto/request/find-drug-query';
import { makeOrderRequest } from './dto/request/make-order-request';
import { Roles } from '../authentication/guards/roles.decorator';
import { Role } from 'src/infrastructure/data/enums/role.enum';
import { JwtAuthGuard } from '../authentication/guards/jwt-auth.guard';
import { RolesGuard } from '../authentication/guards/roles.guard';
import { PhOrderReplyRequest } from './dto/request/ph-order-replay-request';

@ApiHeader({
    name: 'Accept-Language',
    required: false,
    description: 'Language header: en, ar',
  })
@ApiTags("Pharmacy")
@Controller('pharmacy')
export class PharmacyController {

    constructor(
      private readonly pharmacyService: PharmacyService,
      @Inject(I18nResponse) private readonly _i18nResponse: I18nResponse,  
    ){}

    @Get('/drugs')
async getDrugs(@Query() query:FindDrugQuery) {
    return new ActionResponse(   await this.pharmacyService.getDrugs(query));
}
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
@Roles(Role.CLIENT)
@Post('/order')
async makeOrder(@Body() request: makeOrderRequest){
    return new ActionResponse(  await this.pharmacyService.makeOrder(request));
}

@Get('/categories')
async getDrugCategories() {
    return new ActionResponse( this._i18nResponse.entity(  await this.pharmacyService.getDrugCategories()));
}
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
@Get('/order')
async getOrders() {
    return new ActionResponse(  await this.pharmacyService.getOrders());
}

@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
@Roles(Role.PHARMACY)
@Post('/order/reply')
async orderReply(@Body() request:PhOrderReplyRequest) {
    return new ActionResponse(  await this.pharmacyService.orderReply(request));
}

}
