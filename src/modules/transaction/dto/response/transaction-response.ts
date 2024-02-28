import { Expose, Transform } from "class-transformer"
import { TransactionTypes } from "src/infrastructure/data/enums/transaction-types"
import { User } from "src/infrastructure/entities/user/user.entity"

export class TransactionResponse {
    @Expose()
    id: string
    @Expose()
    amount: number
    @Expose()
    type: TransactionTypes
    @Expose()
    
    created_at: Date

    @Expose()
    @Transform(({ value }) => {
        return {id: value.receiver.id, name: value.receiver.first_name + ' ' + value.receiver.last_name}
    })
    receiver: User

    @Expose()
    @Transform(({ value }) => {
        return {id: value.user.id, name: value.user.first_name + ' ' + value.user.last_name}
    })
    user: User
}