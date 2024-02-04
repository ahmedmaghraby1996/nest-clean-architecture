import { Body, Controller, Get, Post } from '@nestjs/common';
import { SuggestionsComplaintsService } from './suggestions-complaints.service';
import { ActionResponse } from 'src/core/base/responses/action.response';
import { SuggestionsComplaints } from 'src/infrastructure/entities/suggestions-complaints/suggestions-complaints.entity';
import { SuggestionsComplaintsRequest } from './dto/suggestions-complaints.request';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Suggestions-complaints')
@Controller('suggestions-complaints')
export class SuggestionsComplaintsController {
  constructor(
    private readonly suggestionsComplaintsService: SuggestionsComplaintsService,
  ) {}

  @Get()
  async getAllSuggestionsComplaints() {
    const result =
      await this.suggestionsComplaintsService.getSuggestionsComplaints();
    return new ActionResponse<SuggestionsComplaints[]>(result);
  }
  @Post()
  async createSuggestionsComplaints(@Body() suggestionsComplaintsRequest:SuggestionsComplaintsRequest) {
    const result =
      await this.suggestionsComplaintsService.createSuggestionsComplaints(suggestionsComplaintsRequest);
    return new ActionResponse<SuggestionsComplaints>(result);
  }

}
