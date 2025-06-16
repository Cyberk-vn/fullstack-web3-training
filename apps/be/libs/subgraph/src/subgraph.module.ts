import { Module } from '@nestjs/common'
import { SubgraphController } from './subgraph.controller'
import { SubgraphService } from './subgraph.service'

@Module({
  imports: [],
  providers: [SubgraphService],
  exports: [SubgraphService],
  controllers: [SubgraphController],
})
export class SubgraphModule {}
