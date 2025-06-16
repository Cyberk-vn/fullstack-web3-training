import { ApiProperty } from '@nestjs/swagger'
import { FilterStatus } from '../interfaces'
import { Expose, Transform, Type } from 'class-transformer'
import { IsEnum, IsString } from 'class-validator'

class RedemptionItemDto {
  @Expose()
  @IsString()
  @ApiProperty({ example: '0x123...', description: 'Unique identifier of the redemption request.' })
  id: string

  @Expose()
  @IsString()
  @ApiProperty({ example: '0xabc...', description: 'Hub address associated with the redemption.' })
  hub: string

  @Expose()
  @ApiProperty({ example: '1000000000000000000', description: 'Amount of USHD requested for redemption.' })
  @IsString()
  amount: string

  @Expose()
  @ApiProperty({ example: '1678886400', description: 'Unix timestamp of the block when the request was made.' })
  @Type(() => Number)
  blockTimestamp: number

  @Expose()
  @ApiProperty({ example: '101', description: 'Sequence number of the redemption request.' })
  @Type(() => Number)
  seq: number

  // This property is used for deriving the status.
  // It's populated from the 'maxSeq' field added in the service.
  // It doesn't need to be @Exposed if it's not part of the final API response.
  @Type(() => Number) // Ensures 'maxSeq' from source is treated as a number
  @Expose()
  maxSeq: number

  // Important: class-transform to use `seq` and `maxSeq` to create `status` in final response
  @Expose()
  @Transform(({ obj }) => {
    // Ensure both seq and maxSeq are numbers before comparison
    const sequenceNumber = Number(obj.seq)
    const maxSequenceNumber = Number(obj.maxSeq)

    // Defensive check in case parsing fails, though @Type should handle it
    if (isNaN(sequenceNumber) || isNaN(maxSequenceNumber)) {
      return 'pending' // Or some default/error status
    }
    return sequenceNumber <= maxSequenceNumber ? FilterStatus.APPROVED : FilterStatus.PENDING
  })
  @IsEnum(FilterStatus)
  @ApiProperty({
    example: FilterStatus.APPROVED,
    enum: FilterStatus, // Use the actual enum for Swagger
    description: 'Calculated status of the redemption request (approved or pending).',
  })
  status: FilterStatus // Use FilterStatus enum type

  @Expose()
  @ApiProperty({ example: '0xdef...', description: 'Transaction hash of the redemption request.' })
  @IsString()
  transactionHash: string
}

export class PaginatedRedemptionsResponseDto {
  @Expose()
  @ApiProperty({ type: [RedemptionItemDto], description: 'List of redemption items for the current page.' })
  @Type(() => RedemptionItemDto)
  items: RedemptionItemDto[]

  @Expose()
  @ApiProperty({ example: 1, description: 'Current page number.' })
  currentPage: number

  @Expose()
  @ApiProperty({ example: 10, description: 'Number of items per page.' })
  pageSize: number

  @Expose()
  @ApiProperty({ example: true, description: 'Indicates if there are more items available overall.' })
  hasNextPage: boolean

  @Expose()
  @ApiProperty({ example: 125, description: 'Total number of items matching the filter criteria.' })
  totalItems: number

  @Expose()
  @ApiProperty({ example: 13, description: 'Total number of pages for the given filter and page size.' })
  totalPages: number

  @Expose()
  @ApiProperty({
    example: FilterStatus.ALL,
    enum: FilterStatus,
    description: 'The filter status that was applied to this request.',
  })
  filterApplied: FilterStatus

  @Expose()
  @ApiProperty({ example: 'blockTimestamp', description: 'The field by which the results are sorted.' })
  orderBy: string

  @Expose()
  @ApiProperty({ example: 'asc', description: 'The direction of the sort.' })
  orderDirection: string
}
