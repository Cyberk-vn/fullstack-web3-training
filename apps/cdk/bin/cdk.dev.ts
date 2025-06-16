#!/usr/bin/env node
import 'source-map-support/register'
import * as cdk from 'aws-cdk-lib'
import { CdkStack } from '../lib/cdk-stack'

const app = new cdk.App()
new CdkStack(
  app,
  'helix-prime-dev',
  {
    env: 'dev',
    STORAGE_BUCKET: 'helix-prime-dev-storage',
    name: 'helix-prime',
    ORIGINS: ['http://localhost:3000', 'https://admin-prime-dev.vercel.app', 'http://localhost:5173'],
  },
  {
    env: {
      account: '968270538251',
      region: 'ap-southeast-1',
    },
  },
)
