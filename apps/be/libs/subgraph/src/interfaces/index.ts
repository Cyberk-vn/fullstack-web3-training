import { HmmtRedemptionRequestedEntity, RedemptionMasterEntity } from '../entities'

export interface HmmtRedemptionRequested_filter {
  // This filter cannot use currentReleasedSeq from RedemptionMaster in the same query
  // if we are to maintain a single GraphQL call.
  // Add other filterable fields from your HmmtRedemptionRequested entity if needed
  // e.g., hub_in?: string[];
  seq_lte?: string // Can be used if latestCompletedSeq is known *before* the call
  seq_gt?: string // Can be used if latestCompletedSeq is known *before* the call
}

export interface GetRedemptionMasterVariables {
  masterId: string
}

export interface GetRedemptionMasterResponse {
  redemptionMaster: {
    id: string
    totalRequests: string
    totalReleasedRequests: string
    totalPendingRequests: string
    currentReleasedSeq: string
  } | null
}

// Variables for the combined GraphQL query
export interface GetRedemptionRequestsVariables {
  first: number
  skip: number
  orderBy: HmmtRedemptionRequested_orderBy
  orderDirection: OrderDirection
  where?: HmmtRedemptionRequested_filter
}

export interface GetRedemptionRequestsResponse {
  hmmtRedemptionRequesteds: HmmtRedemptionRequestedEntity[]
}

// Raw entity structure from the subgraph for HmmtReleaseSequenceChanged
export interface HmmtReleaseSequenceChangedEntity {
  id: string
  seq: string
  blockNumber: string
  blockTimestamp: string
}

// Variables for the main GraphQL query fetching HRR entities
export interface GetHmmtRedemptionRequestedVariables {
  first: number
  skip: number
  orderBy: HmmtRedemptionRequested_orderBy
  orderDirection: OrderDirection
  where?: HmmtRedemptionRequested_filter
}

// Response structure for HRR query
export interface GetHmmtRedemptionRequestedResponse {
  hmmtRedemptionRequesteds: HmmtRedemptionRequestedEntity[]
}

export enum HmmtRedemptionRequested_orderBy {
  ID = 'id',
  HUB = 'hub',
  AMOUNT = 'amount',
  SHARE = 'share',
  SEQ = 'seq',
  BLOCK_NUMBER = 'blockNumber',
  BLOCK_TIMESTAMP = 'blockTimestamp',
  TRANSACTION_HASH = 'transactionHash',
}

export enum OrderDirection {
  ASC = 'asc',
  DESC = 'desc',
}

export enum FilterStatus {
  ALL = 'all',
  PENDING = 'pending',
  APPROVED = 'approved',
}

export {
  RedemptionReleaseLog_orderBy,
  ReleaseLogStatus,
  RedemptionReleaseLogEntity,
  GetRedemptionReleaseLogsVariables,
  GetRedemptionReleaseLogsResponse,
} from './release-log.interface'
