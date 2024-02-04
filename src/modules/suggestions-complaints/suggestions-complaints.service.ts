import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SuggestionsComplaints } from 'src/infrastructure/entities/suggestions-complaints/suggestions-complaints.entity';
import { Repository } from 'typeorm';
import { SuggestionsComplaintsRequest } from './dto/suggestions-complaints.request';

@Injectable()
export class SuggestionsComplaintsService {
  constructor(
    @InjectRepository(SuggestionsComplaints)
    private _repo: Repository<SuggestionsComplaints>,
  ) {}

  async getSuggestionsComplaints(): Promise<SuggestionsComplaints[]> {
    return await this._repo.find();
  }
  async createSuggestionsComplaints(
    suggestionsComplaintsRequest: SuggestionsComplaintsRequest,
  ): Promise<SuggestionsComplaints> {
    return await this._repo.save(suggestionsComplaintsRequest);
  }
}
