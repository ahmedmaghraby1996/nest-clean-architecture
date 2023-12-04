import { Body, Controller, Get, Inject, Post, Put, UseGuards } from '@nestjs/common';
import { AdditionalInfoService } from './additional-info.service';
import { DoctorInfoRequest } from './dto/requests/doctor-info-request';
import { ApiBearerAuth, ApiHeader, ApiTags } from '@nestjs/swagger';
import { Roles } from '../authentication/guards/roles.decorator';
import { Role } from 'src/infrastructure/data/enums/role.enum';
import { JwtAuthGuard } from '../authentication/guards/jwt-auth.guard';
import { RolesGuard } from '../authentication/guards/roles.guard';
import { ActionResponse } from 'src/core/base/responses/action.response';
import { I18nResponse } from 'src/core/helpers/i18n.helper';

@ApiBearerAuth()
@ApiTags("Additonal-info")
@ApiHeader({ name: 'Accept-Language', required: false, description: 'Language header: en, ar' })
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('additional-info')
export class AdditionalInfoController {

constructor( private readonly additionalInfoService:AdditionalInfoService, @Inject(I18nResponse) private readonly _i18nResponse: I18nResponse,){

}

@Roles(Role.DOCTOR)
@Get("specializations")
async getSpecilizations(){
    const specializations= await this.additionalInfoService.getSpecilizations()
    return new ActionResponse(this._i18nResponse.entity(specializations));
}
@Roles(Role.DOCTOR)
@Put("doctor")
async addDoctorInfo(@Body() request:DoctorInfoRequest ){
return new ActionResponse( await this.additionalInfoService.addDoctorInfo(request));

}

}
