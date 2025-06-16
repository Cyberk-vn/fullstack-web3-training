import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsEnum, IsInt, IsOptional, Max, Min } from 'class-validator'
import { Expose, Type } from 'class-transformer'
import { FilterStatus, HmmtRedemptionRequested_orderBy, OrderDirection } from '../interfaces'

export class GetRedemptionsQueryDto {
  @ApiProperty({
    description: 'Page number for pagination.',
    example: 1,
    default: 1,
    minimum: 1,
    type: Number,
  })
  @Expose()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number

  @ApiProperty({
    description: 'Number of items per page.',
    example: 10,
    default: 10,
    minimum: 1,
    maximum: 100,
    type: Number,
  })
  @Expose()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(1000)
  pageSize: number

  @ApiPropertyOptional({
    description: 'Field to order the results by.',
    enum: HmmtRedemptionRequested_orderBy,
    default: HmmtRedemptionRequested_orderBy.SEQ,
  })
  @IsOptional()
  @IsEnum(HmmtRedemptionRequested_orderBy)
  @Expose()
  orderBy?: HmmtRedemptionRequested_orderBy

  @ApiPropertyOptional({
    description: 'Direction of the order.',
    enum: OrderDirection,
    default: OrderDirection.DESC,
  })
  @IsOptional()
  @IsEnum(OrderDirection)
  @Expose()
  orderDirection?: OrderDirection

  @ApiProperty({
    description: 'Filter by redemption status.',
    enum: FilterStatus,
    default: FilterStatus.ALL,
  })
  @Expose()
  @IsOptional()
  @IsEnum(FilterStatus)
  filterStatus: FilterStatus
}
