import { Controller, Get, Inject, Param, Query } from '@nestjs/common';
import { PaginatedRequest } from 'src/core/base/requests/paginated.request';
import { DoctorService } from './doctor.service';
import { I18nResponse } from 'src/core/helpers/i18n.helper';
import { ActionResponse } from 'src/core/base/responses/action.response';
import { PaginatedResponse } from 'src/core/base/responses/paginated.response';
import { DoctorResopone } from './dto/respone/doctor-respone';
import { applyQueryIncludes } from 'src/core/helpers/service-related.helper';

@Controller('doctor')
export class DoctorController {
  constructor(
    private readonly doctorService: DoctorService,
    @Inject(I18nResponse) private readonly _i18nResponse: I18nResponse,
  ) {}

  @Get()
  async getDoctor(@Query() query: PaginatedRequest) {
    applyQueryIncludes(query, 'clinic');
    applyQueryIncludes(query, 'user');
    applyQueryIncludes(query, 'specialization');
    const doctors = await this.doctorService.findAll(query);
    const data = this._i18nResponse.entity(doctors);
    const doctorsReposonse = data.map((doctor) =>
     
      new DoctorResopone({id:doctor.id,user:doctor.user,specialization:doctor.specialization}));
    
    if (query.page && query.limit) {
      const total = await this.doctorService.count();
      return new PaginatedResponse(doctorsReposonse, {
        meta: { total, ...query },
      });
    } else {
      return new ActionResponse(doctorsReposonse);
    }
  }
@Get("/:id")
  async getSingle(@Param('id') id: string) {
    const doctor = await this.doctorService.findOne(id);
    console.log(id)
    const data = this._i18nResponse.entity(doctor);
    return new ActionResponse(new DoctorResopone({...data}));
  }
}
