import { ApiProperty } from '@nestjs/swagger'
import { Expose, Transform, Type } from 'class-transformer'
import { IsEnum, IsString } from 'class-validator'
import { OrderDirection, RedemptionReleaseLog_orderBy, ReleaseLogStatus } from '../interfaces'

class ReleaseLogItemDto {
  @Expose()
  @IsString()
  @ApiProperty({ example: '0x123...', description: 'Unique identifier of the release log.' })
  id: string

  @Expose()
  @ApiProperty({ example: '1000000000000000000', description: 'Total amount of tokens in the release.' })
  @IsString()
  totalAmount: string

  @Expose()
  @ApiProperty({ example: '1000000000000000000', description: 'Total share in the release.' })
  @IsString()
  totalShare: string

  @Expose()
  @ApiProperty({ example: '100', description: 'Total number of requests in the release.' })
  @Type(() => Number)
  totalRequests: number

  @Expose()
  @ApiProperty({ example: 1678886400, description: 'Unix timestamp of the block when the release occurred.' })
  @Type(() => Number)
  blockTimestamp: number

  @Expose()
  @ApiProperty({ example: '0xabc...', description: 'Address associated with the release.' })
  @IsString()
  address: string

  @Expose()
  @ApiProperty({
    enum: ReleaseLogStatus,
    example: ReleaseLogStatus.COMPLETED,
    description: 'Status of the release log.',
  })
  @IsEnum(ReleaseLogStatus)
  status: ReleaseLogStatus
}

export class PaginatedReleaseLogsResponseDto {
  @Expose()
  @ApiProperty({ type: [ReleaseLogItemDto], description: 'List of release log items for the current page.' })
  @Type(() => ReleaseLogItemDto)
  items: ReleaseLogItemDto[]

  @Expose()
  @ApiProperty({ example: 1, description: 'Current page number.' })
  currentPage: number

  @Expose()
  @ApiProperty({ example: 10, description: 'Number of items per page.' })
  pageSize: number

  @Expose()
  @ApiProperty({ example: true, description: 'Indicates if there are more items available.' })
  hasNextPage: boolean

  @Expose()
  @ApiProperty({ example: 125, description: 'Total number of items matching the filter criteria.' })
  totalItems: number

  @Expose()
  @ApiProperty({ example: 13, description: 'Total number of pages for the given filter and page size.' })
  totalPages: number

  @Expose()
  @ApiProperty({
    enum: RedemptionReleaseLog_orderBy,
    example: RedemptionReleaseLog_orderBy.BLOCK_TIMESTAMP,
    description: 'The field by which the results are sorted.',
  })
  orderBy: RedemptionReleaseLog_orderBy

  @Expose()
  @ApiProperty({
    enum: OrderDirection,
    example: OrderDirection.DESC,
    description: 'The direction of the sort.',
  })
  orderDirection: OrderDirection
}
