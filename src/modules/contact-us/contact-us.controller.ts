import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ContactUsResponse } from './dtos/response/contact-us.response';
import { I18nResponse } from 'src/core/helpers/i18n.helper';
import { ApiTags, ApiHeader } from '@nestjs/swagger';
import { PaginatedRequest } from 'src/core/base/requests/paginated.request';
import { ContactUsService } from './contact-us.service';
import { CreateContactDto } from './dtos/request/create-contact.dto';
import { UpdateContactDto } from './dtos/request/update-contact.dto';

@ApiTags('Contact-Us')
@ApiHeader({
  name: 'Accept-Language',
  required: false,
  description: 'Language header: en, ar',
})
@Controller('contact-us')
export class ContactUsController {
  constructor(
    private contactUsService: ContactUsService,
    @Inject(I18nResponse) private readonly _i18nResponse: I18nResponse,
  ) {}

  @Get()
  async getAll(
    @Query() query?: PaginatedRequest,
  ): Promise<ContactUsResponse[]> {
    const contactUsData = await this.contactUsService.findAll(query);
    const data: ContactUsResponse[] = this._i18nResponse.entity(contactUsData);
    const dataRes = data.map((contact_us) => {
      return new ContactUsResponse(contact_us);
    });

    return dataRes;
  }

  @Post()
  async createContact(
    @Body() createContactDto: CreateContactDto,
  ): Promise<ContactUsResponse> {
    const contactUsData = await this.contactUsService.createContact(
      createContactDto,
    );
    const data: ContactUsResponse = this._i18nResponse.entity(contactUsData);

    const dataRes = new ContactUsResponse(data);
    return dataRes;
  }

  @Delete('/:id')
  deleteContact(@Param('id') id: string): Promise<void> {
    return this.contactUsService.deleteContact(id);
  }

  @Patch('/:id')
  async updateContact(
    @Param('id') id: string,
    @Body() updateContactDto: UpdateContactDto,
  ): Promise<ContactUsResponse> {
    const contactUsData = await this.contactUsService.updateContact(
      id,
      updateContactDto,
    );
    const data: ContactUsResponse = this._i18nResponse.entity(contactUsData);

    const dataRes = new ContactUsResponse(data);
    return dataRes;
  }
}
