import { ApiProperty } from '@nestjs/swagger'
import { Expose, Transform, Type } from 'class-transformer'
import { IsEnum, IsInt, IsNumber, IsOptional, Max, Min } from 'class-validator'
import { OrderDirection, RedemptionReleaseLog_orderBy, ReleaseLogStatus } from '../interfaces'

export class GetReleaseLogsQueryDto {
  @ApiProperty({
    required: false,
    default: 1,
    description: 'Page number for pagination',
    minimum: 1,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  @Expose()
  page?: number

  @ApiProperty({
    required: false,
    default: 10,
    description: 'Number of items per page',
    minimum: 1,
    maximum: 100,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  @Type(() => Number)
  @Expose()
  pageSize?: number

  @ApiProperty({
    required: false,
    enum: RedemptionReleaseLog_orderBy,
    default: RedemptionReleaseLog_orderBy.BLOCK_TIMESTAMP,
    description: 'Field to order the results by',
  })
  @IsOptional()
  @IsEnum(RedemptionReleaseLog_orderBy)
  @Expose()
  orderBy?: RedemptionReleaseLog_orderBy

  @ApiProperty({
    required: false,
    enum: OrderDirection,
    default: OrderDirection.DESC,
    description: 'Direction to order the results',
  })
  @IsOptional()
  @IsEnum(OrderDirection)
  @Expose()
  orderDirection?: OrderDirection

  @ApiProperty({
    required: false,
    enum: ReleaseLogStatus,
    description: 'Filter by release log status',
  })
  @IsOptional()
  @IsEnum(ReleaseLogStatus)
  @Expose()
  status?: ReleaseLogStatus

  @ApiProperty({
    required: false,
    type: Number,
    description: 'Filter logs after this Unix timestamp (seconds)',
    minimum: 0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  @Expose()
  startDate?: number

  @ApiProperty({
    required: false,
    type: Number,
    description: 'Filter logs before this Unix timestamp (seconds)',
    minimum: 0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  @Expose()
  endDate?: number
}
