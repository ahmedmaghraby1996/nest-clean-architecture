import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../authentication/guards/jwt-auth.guard';
import { ApiTags, ApiHeader, ApiBearerAuth } from '@nestjs/swagger';
import { RolesGuard } from '../authentication/guards/roles.guard';
import { PackageService } from './package.service';
import { I18nResponse } from 'src/core/helpers/i18n.helper';
import { ActionResponse } from 'src/core/base/responses/action.response';
import { CreatePackageRequest } from './dto/requests/create-package-request';
@ApiTags('Package')
@ApiHeader({
  name: 'Accept-Language',
  required: false,
  description: 'Language header: en, ar',
})
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('package')
export class PackageController {
  constructor(
    private packageService: PackageService,
    private readonly _i18nResponse: I18nResponse,
  ) {}

  @Get()
  async getSubscriptionPackages() {
    return new ActionResponse(
      this._i18nResponse.entity(
        await this.packageService.getSubscriptionPackages(),
      ),
    );
  }
  @Post()
  async makePackage(@Body() request: CreatePackageRequest) {
    return new ActionResponse(
      await this.packageService.makePackage(request),
    );
  }

  @Post("/subscription/:id")
  async makeSubscription(@Param('id') id: string) {
    return new ActionResponse(
      await this.packageService.makeSubscription(id),
    );
  }
}
