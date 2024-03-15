import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/core/base/service/service.base';
import { PromoCode } from 'src/infrastructure/entities/promo-code/promo-code.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PromoCodeService  extends BaseService<PromoCode> {

    constructor(@InjectRepository(PromoCode) private readonly repository: Repository<PromoCode>) {
        super(repository);
    }
}
