import { Expose, Type } from 'class-transformer'

export class RedemptionMasterEntity {
  @Expose()
  id: string
  @Expose()
  @Type(() => Number)
  totalRequests: number // BigInt represented as string
  @Expose()
  @Type(() => Number)
  totalReleasedRequests: number // BigInt represented as string
  @Expose()
  @Type(() => Number)
  totalPendingRequests: number // BigInt represented as string
  @Expose()
  @Type(() => Number)
  currentReleasedSeq: number // BigInt represented as string
}
