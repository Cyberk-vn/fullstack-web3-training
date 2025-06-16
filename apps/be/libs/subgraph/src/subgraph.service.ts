import { Injectable, Logger, InternalServerErrorException, HttpException, HttpStatus, Inject } from '@nestjs/common'
import { GraphQLClient, RequestDocument, Variables } from 'graphql-request'
import { GetRedemptionsQueryDto } from './dtos/get-redemptions-query.dto'
import { GetReleaseLogsQueryDto } from './dtos/get-release-logs-query.dto'
import {
  FilterStatus,
  HmmtRedemptionRequested_orderBy,
  OrderDirection,
  GetRedemptionMasterVariables,
  GetRedemptionMasterResponse,
  GetRedemptionRequestsVariables,
  GetRedemptionRequestsResponse,
} from './interfaces'
import {
  RedemptionReleaseLog_orderBy,
  ReleaseLogStatus,
  RedemptionReleaseLog_filter,
  GetRedemptionReleaseLogsVariables,
  GetRedemptionReleaseLogsResponse,
} from './interfaces/release-log.interface'
import {
  GET_REDEMPTION_MASTER_QUERY,
  GET_REDEMPTION_REQUESTS_QUERY,
  GET_REDEMPTION_RELEASE_LOGS_QUERY,
} from './queries'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { lastValueFrom, timer } from 'rxjs'
import { retry } from 'rxjs/operators'
import { throwError } from 'rxjs'
import { defer } from 'rxjs'
import { Cache } from 'cache-manager'
import { th } from '@app/helper'
import { RedemptionMasterEntity } from './entities/redemption-master.entity'
const graphQL = new GraphQLClient(process.env.SUBGRAPH_URL)

@Injectable()
export class SubgraphService {
  private readonly logger = new Logger(SubgraphService.name)
  private readonly MAX_RETRY_ATTEMPTS = 3
  private readonly RETRY_DELAY_MS = 1000
  private readonly RELEASE_LOGS_TTL_MS = 5000 // 5 seconds TTL for release logs
  private readonly TTL_MS = 2000
  private readonly redemptionMasterId = '1'
  // Feature flags for filtering options
  private readonly ENABLE_DATE_RANGE_FILTER = false

  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  private async _fetchGraphQLWithRetry<TResponse, TVariables extends Variables>(
    query: RequestDocument,
    variables: TVariables,
  ): Promise<TResponse> {
    const graphqlRequest$ = defer(() => graphQL.request<TResponse>(query, variables as Variables))

    const response$ = graphqlRequest$.pipe(
      retry({
        count: this.MAX_RETRY_ATTEMPTS,
        delay: (error: any, retryCount: number) => {
          if (error.response?.status === 429) {
            const delayDuration = this.RETRY_DELAY_MS * Math.pow(2, retryCount - 1)
            this.logger.warn(
              `Rate limit exceeded for Subgraph request. Retry attempt ${retryCount}/${this.MAX_RETRY_ATTEMPTS}. Retrying after ${delayDuration}ms...`,
              error?.toString(),
            )
            return timer(delayDuration)
          }
          return throwError(() => error)
        },
      }),
    )
    return lastValueFrom(response$)
  }

  private async _getRedemptionMaster() {
    const variables: GetRedemptionMasterVariables = {
      masterId: this.redemptionMasterId,
    }
    const gqlResponse = await this._fetchGraphQLWithRetry<GetRedemptionMasterResponse, GetRedemptionMasterVariables>(
      GET_REDEMPTION_MASTER_QUERY,
      variables,
    )
    return th.toInstanceSafe(RedemptionMasterEntity, gqlResponse.redemptionMaster)
  }

  private _buildPaginationMetadata(page: number, pageSize: number, total: number) {
    return {
      currentPage: page,
      pageSize,
      totalItems: total,
      hasNextPage: page * pageSize < total,
      totalPages: Math.ceil(total / pageSize),
    }
  }

  private _getRedemptionRequestsCacheKey(queryDto: GetRedemptionsQueryDto): string {
    return `prime-redemption-requests-${queryDto.page}-${queryDto.pageSize}-${queryDto.filterStatus}-${queryDto.orderBy}-${queryDto.orderDirection}`
  }

  async getRedemptionRequests(queryDto: GetRedemptionsQueryDto) {
    const cacheKey = this._getRedemptionRequestsCacheKey(queryDto)
    const cachedData = await this.cacheManager.get(cacheKey)
    if (cachedData) return cachedData

    const {
      page = 1,
      pageSize = 10,
      orderBy = HmmtRedemptionRequested_orderBy.BLOCK_TIMESTAMP,
      orderDirection = OrderDirection.DESC,
      filterStatus = FilterStatus.ALL,
    } = queryDto

    const redemptionMaster = await this._getRedemptionMaster()
    if (!redemptionMaster) {
      return {
        items: [],
        filterApplied: filterStatus,
        ...this._buildPaginationMetadata(page, pageSize, 0),
      }
    }

    const variables: GetRedemptionRequestsVariables = {
      first: pageSize,
      skip: (page - 1) * pageSize,
      orderBy: orderBy,
      orderDirection: orderDirection,
      where: {},
    }

    if (filterStatus !== FilterStatus.ALL) {
      variables.where = {
        [filterStatus === FilterStatus.APPROVED ? 'seq_lte' : 'seq_gt']: redemptionMaster.currentReleasedSeq,
      }
    }

    const { hmmtRedemptionRequesteds: items } = await this._fetchGraphQLWithRetry<
      GetRedemptionRequestsResponse,
      GetRedemptionRequestsVariables
    >(GET_REDEMPTION_REQUESTS_QUERY, variables)

    let totalItems = 0
    switch (filterStatus) {
      case FilterStatus.ALL:
        totalItems = redemptionMaster.totalRequests
        break
      case FilterStatus.APPROVED:
        totalItems = redemptionMaster.totalReleasedRequests
        break
      case FilterStatus.PENDING:
        totalItems = redemptionMaster.totalPendingRequests
        break
    }

    const result = {
      items: items.map((item) => ({
        ...item,
        // Important: class-transform to use this to create status in final response
        maxSeq: redemptionMaster.currentReleasedSeq,
      })),
      filterApplied: filterStatus,
      orderBy,
      orderDirection,
      ...this._buildPaginationMetadata(page, pageSize, totalItems),
    }
    await this.cacheManager.set(cacheKey, result, this.TTL_MS)
    return result
  }

  private _getReleaseLogsCacheKey(queryDto: GetReleaseLogsQueryDto): string {
    return `prime-release-logs-${queryDto.page}-${queryDto.pageSize}-${queryDto.status}-${queryDto.orderBy}-${queryDto.orderDirection}-${queryDto.startDate}-${queryDto.endDate}`
  }

  async getRedemptionReleaseLogs(queryDto: GetReleaseLogsQueryDto) {
    const cacheKey = this._getReleaseLogsCacheKey(queryDto)
    const cachedData = await this.cacheManager.get(cacheKey)
    if (cachedData) return cachedData

    const {
      page = 1,
      pageSize = 10,
      orderBy = RedemptionReleaseLog_orderBy.BLOCK_TIMESTAMP,
      orderDirection = OrderDirection.DESC,
      status,
      startDate,
      endDate,
    } = queryDto

    const redemptionMaster = await this._getRedemptionMaster()
    if (!redemptionMaster) {
      return {
        items: [],
        orderBy,
        orderDirection,
        ...this._buildPaginationMetadata(page, pageSize, 0),
      }
    }

    const where: RedemptionReleaseLog_filter = {}

    // Date range filters only applied if feature flag is enabled
    if (this.ENABLE_DATE_RANGE_FILTER) {
      if (startDate) {
        where.blockTimestamp_gte = startDate.toString()
      }
      if (endDate) {
        where.blockTimestamp_lte = endDate.toString()
      }
    }

    const variables: GetRedemptionReleaseLogsVariables = {
      first: pageSize,
      skip: (page - 1) * pageSize,
      orderBy,
      orderDirection,
      where,
      masterId: this.redemptionMasterId,
    }

    const response = await this._fetchGraphQLWithRetry<
      GetRedemptionReleaseLogsResponse,
      GetRedemptionReleaseLogsVariables
    >(GET_REDEMPTION_RELEASE_LOGS_QUERY, variables)

    const totalItems = parseInt(response.redemptionMaster?.totalReleaseLogs || '0')

    // Transform the items to include status
    const items = response.redemptionReleaseLogs.map((item) => ({
      ...item,
      status: ReleaseLogStatus.COMPLETED,
    }))

    const result = {
      items,
      orderBy,
      orderDirection,
      ...this._buildPaginationMetadata(page, pageSize, totalItems),
    }

    await this.cacheManager.set(cacheKey, result, this.RELEASE_LOGS_TTL_MS)
    return result
  }
}
