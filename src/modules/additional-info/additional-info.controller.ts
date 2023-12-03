import { Body, Controller, Post, Put, UseGuards } from '@nestjs/common';
import { AdditionalInfoService } from './additional-info.service';
import { DoctorInfoRequest } from './dto/requests/doctor-info-request';
import { ApiBearerAuth, ApiHeader, ApiTags } from '@nestjs/swagger';
import { Roles } from '../authentication/guards/roles.decorator';
import { Role } from 'src/infrastructure/data/enums/role.enum';
import { JwtAuthGuard } from '../authentication/guards/jwt-auth.guard';
import { RolesGuard } from '../authentication/guards/roles.guard';
import { ActionResponse } from 'src/core/base/responses/action.response';

@ApiBearerAuth()
@ApiTags("Additonal-info")
@ApiHeader({ name: 'Accept-Language', required: false, description: 'Language header: en, ar' })
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('additional-info')
export class AdditionalInfoController {

constructor( private readonly additionalInfoService:AdditionalInfoService){

}

@Put("doctor")
async addDoctorInfo(@Body() request:DoctorInfoRequest ){
return new ActionResponse( await this.additionalInfoService.addDoctorInfo(request));

}

}
