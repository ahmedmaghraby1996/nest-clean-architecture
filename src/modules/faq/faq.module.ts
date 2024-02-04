import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { FaqCategory } from "src/infrastructure/entities/faq/faq-category";
import { FaqQuestion } from "src/infrastructure/entities/faq/faq_question";
import { FaqController } from "./faq.controller";
import { FaqService } from "./faq.service";

@Module({
  
    imports: [
    
      TypeOrmModule.forFeature([FaqCategory,FaqQuestion])],
    controllers: [FaqController],
    providers: [FaqService],  

  })
  export class FaqModule {}