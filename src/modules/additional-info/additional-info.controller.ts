import { Body, ClassSerializerInterceptor, Controller, Get, Inject, Post, Put, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { AdditionalInfoService } from './additional-info.service';
import { DoctorInfoRequest } from './dto/requests/doctor-info-request';
import { ApiBearerAuth, ApiConsumes, ApiHeader, ApiTags } from '@nestjs/swagger';
import { Roles } from '../authentication/guards/roles.decorator';
import { Role } from 'src/infrastructure/data/enums/role.enum';
import { JwtAuthGuard } from '../authentication/guards/jwt-auth.guard';
import { RolesGuard } from '../authentication/guards/roles.guard';
import { ActionResponse } from 'src/core/base/responses/action.response';
import { I18nResponse } from 'src/core/helpers/i18n.helper';
import { FamilyMemberRequest } from './dto/requests/family-member.request';
import { ClientInfoRequest } from './dto/requests/client-info-request';
import { UploadValidator } from 'src/core/validators/upload.validator';
import { FileInterceptor } from '@nestjs/platform-express';


@ApiTags("Additonal-info")
@ApiHeader({ name: 'Accept-Language', required: false, description: 'Language header: en, ar' })

@Controller('additional-info')
export class AdditionalInfoController {

constructor( private readonly additionalInfoService:AdditionalInfoService, @Inject(I18nResponse) private readonly _i18nResponse: I18nResponse,){

}


@Get("specializations")
async getSpecilizations(){
    const specializations= await this.additionalInfoService.getSpecilizations()
    return new ActionResponse(this._i18nResponse.entity(specializations));
}
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
@Roles(Role.DOCTOR)
@Put("doctor/info")
async addDoctorInfo(@Body() request:DoctorInfoRequest ){
return new ActionResponse( await this.additionalInfoService.addDoctorInfo(request));

}

@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
@Roles(Role.DOCTOR)
@Get("doctor/info")
async getDoctorInfo() {
return new ActionResponse( this._i18nResponse.entity(await this.additionalInfoService.getDoctor()));

}

@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
@Roles(Role.CLIENT)

@Put("client/info")
async addClientInfo(@Body() request:ClientInfoRequest ){
return new ActionResponse( await this.additionalInfoService.addClientInfo(request));

}

@UseInterceptors(ClassSerializerInterceptor, FileInterceptor('avatarFile'))
@ApiConsumes('multipart/form-data')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
@Roles(Role.CLIENT)
@Post("client/family-members")
async addFamilyMeber(@Body() request:FamilyMemberRequest 
,
@UploadedFile(new UploadValidator().build())
avatarFile: Express.Multer.File,){
if( avatarFile){
  request.avatarFile=avatarFile
}
return new ActionResponse( await this.additionalInfoService.addFamilyMembers(request));
}

@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
@Roles(Role.CLIENT)
@Get("client/family-members")
async getFamilyMembers(){

return new ActionResponse( await this.additionalInfoService.getFamilyMembers());
}


@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
@Roles(Role.CLIENT)
@Get("client/info")
async getClientInfo(){

return new ActionResponse( await this.additionalInfoService.getClientInfo());
}



}
