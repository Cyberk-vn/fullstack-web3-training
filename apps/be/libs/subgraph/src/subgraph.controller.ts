import {
  Controller,
  Get,
  Query,
  ValidationPipe,
  UsePipes,
  HttpException,
  HttpStatus,
  Logger,
  UseGuards,
  InternalServerErrorException,
} from '@nestjs/common'
import { SubgraphService } from './subgraph.service' // Service for querying list
import { GetRedemptionsQueryDto } from './dtos/get-redemptions-query.dto' // Adjusted path
import { GetReleaseLogsQueryDto } from './dtos/get-release-logs-query.dto'
import { PaginatedRedemptionsResponseDto } from './dtos/paginated-redemptions-response.dto' // Adjusted path
import { PaginatedReleaseLogsResponseDto } from './dtos/paginated-release-logs-response.dto'
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger'
import {
  FilterStatus,
  HmmtRedemptionRequested_orderBy,
  OrderDirection,
  RedemptionReleaseLog_orderBy,
  ReleaseLogStatus,
} from './interfaces' // Adjusted path
import { plainToClass } from 'class-transformer'
import { JwtGuard } from '@app/auth/guards/jwt.guard'
import { th } from '@app/helper'

@ApiTags('Subgraph') // You might want to group this under the existing 'Redeem' tag or a new sub-tag
@Controller('subgraph') // Example route, adjust as needed e.g. /redeem/history or /redemptions
export class SubgraphController {
  constructor(private readonly subgraphService: SubgraphService) {}
  private readonly logger = new Logger(SubgraphController.name) // Add logger instance

  @Get('redemption-requests')
  @ApiOperation({ summary: 'Get a paginated list of redemption requests with status' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number (default: 1)' })
  @ApiQuery({ name: 'pageSize', required: false, type: Number, description: 'Items per page (default: 10, max: 100)' })
  @ApiQuery({
    name: 'orderBy',
    required: false,
    enum: HmmtRedemptionRequested_orderBy,
    description: 'Field to order by (default: seq)',
  })
  @ApiQuery({
    name: 'orderDirection',
    required: false,
    enum: OrderDirection,
    description: 'Order direction (default: desc)',
  })
  @ApiQuery({
    name: 'filterStatus',
    required: false,
    enum: FilterStatus,
    description: 'Filter by status (default: all)',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved redemption requests.',
    type: PaginatedRedemptionsResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad Request - Invalid query parameters.' })
  @ApiResponse({
    status: 424,
    description: 'Failed Dependency - Error communicating with an external service (e.g., subgraph).',
  })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  @UseGuards(JwtGuard)
  async getRedemptionRequests(@Query() queryDto: GetRedemptionsQueryDto): Promise<PaginatedRedemptionsResponseDto> {
    try {
      const result = await this.subgraphService.getRedemptionRequests(queryDto)
      return th.toInstanceSafe(PaginatedRedemptionsResponseDto, result)
    } catch (error) {
      if (error instanceof HttpException) {
        throw error
      }
      throw new InternalServerErrorException('An unexpected error occurred while processing your request.')
    }
  }

  @Get('release-logs')
  @ApiOperation({ summary: 'Get a paginated list of redemption release logs with filtering options' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number (default: 1)' })
  @ApiQuery({ name: 'pageSize', required: false, type: Number, description: 'Items per page (default: 10, max: 100)' })
  @ApiQuery({
    name: 'orderBy',
    required: false,
    enum: RedemptionReleaseLog_orderBy,
    description: 'Field to order by (default: blockTimestamp)',
  })
  @ApiQuery({
    name: 'orderDirection',
    required: false,
    enum: OrderDirection,
    description: 'Order direction (default: desc)',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: ReleaseLogStatus,
    description: 'Filter by release log status',
  })
  @ApiQuery({
    name: 'startDate',
    required: false,
    type: Number,
    description: 'Filter logs after this Unix timestamp (seconds)',
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    type: Number,
    description: 'Filter logs before this Unix timestamp (seconds)',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved release logs.',
    type: PaginatedReleaseLogsResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad Request - Invalid query parameters.' })
  @ApiResponse({
    status: 424,
    description: 'Failed Dependency - Error communicating with an external service (e.g., subgraph).',
  })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  @UseGuards(JwtGuard)
  async getRedemptionReleaseLogs(@Query() queryDto: GetReleaseLogsQueryDto): Promise<PaginatedReleaseLogsResponseDto> {
    try {
      const result = await this.subgraphService.getRedemptionReleaseLogs(queryDto)
      return th.toInstanceSafe(PaginatedReleaseLogsResponseDto, result)
    } catch (error) {
      if (error instanceof HttpException) {
        throw error
      }
      throw new InternalServerErrorException('An unexpected error occurred while processing your request.')
    }
  }
}
