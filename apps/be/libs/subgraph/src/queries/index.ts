import { gql } from 'graphql-request'

export const GET_REDEMPTION_MASTER_QUERY = gql`
  query GetRedemptionMaster($masterId: ID!) {
    redemptionMaster(id: $masterId) {
      id
      totalRequests
      totalReleasedRequests
      totalPendingRequests
      currentReleasedSeq
    }
  }
`

export const GET_REDEMPTION_REQUESTS_QUERY = gql`
  query GetRedemptions(
    $first: Int!
    $skip: Int!
    $orderBy: HmmtRedemptionRequested_orderBy!
    $orderDirection: OrderDirection!
    $where: HmmtRedemptionRequested_filter
  ) {
    hmmtRedemptionRequesteds(
      first: $first
      skip: $skip
      orderBy: $orderBy
      orderDirection: $orderDirection
      where: $where
    ) {
      id
      hub
      amount
      share
      seq
      blockNumber
      blockTimestamp
      transactionHash
    }
  }
`

export const GET_REDEMPTION_RELEASE_LOGS_QUERY = gql`
  query GetRedemptionReleaseLog(
    $skip: Int!
    $first: Int!
    $where: RedemptionReleaseLog_filter
    $orderBy: RedemptionReleaseLog_orderBy!
    $orderDirection: OrderDirection!
    $masterId: ID!
  ) {
    redemptionReleaseLogs(
      skip: $skip
      first: $first
      where: $where
      orderBy: $orderBy
      orderDirection: $orderDirection
    ) {
      id
      totalShare
      totalAmount
      totalRequests
      blockTimestamp
      address
    }
    redemptionMaster(id: $masterId) {
      id
      totalReleaseLogs
    }
  }
`
