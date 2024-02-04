import { Controller, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { FaqQuestion } from "src/infrastructure/entities/faq/faq_question";
import { Repository } from "typeorm";

@Injectable()
export class FaqService{
    constructor(    
    @InjectRepository(FaqQuestion) public  faq_question_repo:Repository<FaqQuestion>
    ){    }
  

    async getQuestion():Promise<FaqQuestion[]>{
       
            return   await this.faq_question_repo.find()
            
    }
}