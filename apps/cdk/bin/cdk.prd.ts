#!/usr/bin/env node
import 'source-map-support/register'
import * as cdk from 'aws-cdk-lib'
import { CdkStack } from '../lib/cdk-stack'

const app = new cdk.App()
new CdkStack(
  app,
  'helix-prd',
  {
    env: 'prd',
    STORAGE_BUCKET: 'helix-prd-storage',
    name: 'helix',
    ORIGINS: ['http://localhost:3000'],
  },
  {
    env: {
      account: '',
      region: 'ap-southeast-1',
    },
  },
)
