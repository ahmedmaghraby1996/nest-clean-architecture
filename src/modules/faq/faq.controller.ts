import { Controller, Get, Inject, Param } from "@nestjs/common";
import { FaqService } from "./faq.service";

import { ApiHeader, ApiTags } from "@nestjs/swagger";
import { FaqQuestion } from "src/infrastructure/entities/faq/faq_question";
import { I18nResponse } from "src/core/helpers/i18n.helper";
import { ActionResponse } from "src/core/base/responses/action.response";


@Controller('faq')
@ApiTags('Faq')
@ApiHeader({ name: 'Accept-Language', required: false, description: 'Language header: en, ar' })
export class FaqController{
    constructor(
        @Inject(I18nResponse) private readonly _i18nResponse: I18nResponse,
        private readonly serivce:FaqService){}


   @Get()
   async getQuestion(){

    const res=await  this.serivce.getQuestion();
    const result = this._i18nResponse.entity(res)
     return   new ActionResponse(result)
   }
   
}