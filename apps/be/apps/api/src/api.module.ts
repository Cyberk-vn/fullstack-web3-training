import { Module } from '@nestjs/common'

import { AuthModule } from '@app/auth/auth.module'
import { CoreModule } from '@app/core/core.module'
import { SubgraphModule } from '@app/subgraph/subgraph.module'

@Module({
  imports: [CoreModule, AuthModule, SubgraphModule],
  controllers: [],
  providers: [],
})
export class ApiModule {}
