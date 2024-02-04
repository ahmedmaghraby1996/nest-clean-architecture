import { BaseEntity } from 'src/infrastructure/base/base.entity';

import { Column, Entity } from 'typeorm';

@Entity()
export class SuggestionsComplaints extends BaseEntity {


  @Column()  
  title:string;

  @Column()  
  description:string;
    
}
