import { OrderDirection } from '.'

export enum RedemptionReleaseLog_orderBy {
  ID = 'id',
  TOTAL_AMOUNT = 'totalAmount',
  TOTAL_SHARE = 'totalShare',
  TOTAL_REQUESTS = 'totalRequests',
  BLOCK_TIMESTAMP = 'blockTimestamp',
  ADDRESS = 'address',
}

export enum ReleaseLogStatus {
  COMPLETED = 'completed',
  FAILED = 'failed',
}

export interface RedemptionReleaseLogEntity {
  id: string
  totalShare: string
  totalAmount: string
  totalRequests: string
  blockTimestamp: string
  address: string
}

export interface GetRedemptionReleaseLogsVariables {
  first: number
  skip: number
  orderBy: RedemptionReleaseLog_orderBy
  orderDirection: OrderDirection
  where?: {
    blockTimestamp_gte?: string
    blockTimestamp_lte?: string
  }
  masterId: string
}

export interface GetRedemptionReleaseLogsResponse {
  redemptionReleaseLogs: RedemptionReleaseLogEntity[]
  redemptionMaster: {
    id: string
    totalReleaseLogs: string
  } | null
}

export interface RedemptionReleaseLog_filter {
  blockTimestamp_gte?: string
  blockTimestamp_lte?: string
  address?: string
}
