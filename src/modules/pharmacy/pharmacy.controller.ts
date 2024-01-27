import { Controller, Get, Inject, Query } from '@nestjs/common';
import { ApiHeader, ApiTags } from '@nestjs/swagger';
import { ActionResponse } from 'src/core/base/responses/action.response';
import { PharmacyService } from './pharmacy.service';
import { I18nResponse } from 'src/core/helpers/i18n.helper';
import { query } from 'express';
import { FindDrugQuery } from './dto/request/find-drug-query';

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

@Get('/categories')
async getDrugCategories() {
    return new ActionResponse( this._i18nResponse.entity(  await this.pharmacyService.getDrugCategories()));
}

}
