import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiHeader, ApiTags } from '@nestjs/swagger';
import { Role } from 'src/infrastructure/data/enums/role.enum';
import { JwtAuthGuard } from '../authentication/guards/jwt-auth.guard';
import { Roles } from '../authentication/guards/roles.decorator';
import { RolesGuard } from '../authentication/guards/roles.guard';
import { ReservationService } from './reservation.service';
import { urgentReservationRequest } from './dto/requests/urgent_reservation_request';
import { ActionResponse } from 'src/core/base/responses/action.response';

@ApiTags("reservation")
@ApiHeader({ name: 'Accept-Language', required: false, description: 'Language header: en, ar' })
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()


@Controller('reservation')
export class ReservationController {
    constructor(private readonly reservationService:ReservationService){}

    @Roles(Role.CLIENT)

    @Post("urgent")
    async urgentReservation(@Body() request:urgentReservationRequest){
        
return  new ActionResponse( await this.reservationService.urgentReservation(request)

)
    }




}
