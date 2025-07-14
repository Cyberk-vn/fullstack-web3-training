import { HttpStatus, INestApplication } from '@nestjs/common'
import { PrismaService } from 'nestjs-prisma'
import { RegisterDto } from './dtos/register.dto'
import { TestContext, testHelper, UserContextTestType } from '@app/spec/test.helper'
import { LoginDto } from './dtos/login.dto'
import { Hash } from '@app/helper/hash.helper'
import { UserService } from '@app/user/user.service'
import { proH } from '@app/helper'
import { UserEntity } from '@app/user/entities/user.entity'
import { AuthService } from './auth.service'

describe('Auth', () => {
  let tc: TestContext
  let app: INestApplication
  let prismaService: PrismaService

  beforeAll(async () => {
    tc = await testHelper.createContext()
    app = tc.app
    prismaService = app.get(PrismaService)
  })

  afterAll(async () => {
    await tc?.clean()
  })
  describe('RegisterFailed', () => {
    test('RegisterFailed:InvalidPassword', async () => {
      const res = await tc
        .request()
        .post('/auth/local/register')
        .send({ username: 'huy@cc.com', password: '12312' } as RegisterDto)
      expect(res).toBeBad('password must be longer than or equal to 6 characters')
    })
    test('RegisterFailed:InvalidEmail', async () => {
      const res = await tc
        .request()
        .post('/auth/local/register')
        .send({ username: 'huy@', password: '123123' } as RegisterDto)
      expect(res).toBeBad('username must be an email')
    })
  })
  describe('Register', () => {
    const username = `${Hash.randomHash()}@cc.com`
    const password = '124311'
    let userContext: UserContextTestType
    test('Register:OK', async () => {
      const res = await tc
        .request()
        .post('/auth/local/register')
        .send({ username, password } as RegisterDto)
      expect(res).toBeCreated()
      userContext = tc.buildUserContext(res.body)
      const { jwt, user } = userContext.userInfo
      expect(!!jwt).toEqual(true)
      expect(user.id).not.toBeUndefined()
      expect(user.password).toBeUndefined() // password should be omitted in response
    })
    it('Register:Duplicated', async () => {
      const res = await tc
        .request()
        .post('/auth/local/register')
        .send({ username, password } as RegisterDto)
      expect(res).toBeBad('User already exists')
    })
    test('LoginFailed:InvalidBody', async () => {
      const res = await tc
        .request()
        .post('/auth/local')
        .send({ username, password: '123' } as LoginDto)
        .expect(HttpStatus.BAD_REQUEST)
      expect(res.body.message).toContain('password must be longer than or equal to 6 characters')
    })
    test('LoginFailed:Unauthorized', async () => {
      await tc
        .request()
        .post('/auth/local')
        .send({ username, password: '324123' } as LoginDto)
        .expect(HttpStatus.UNAUTHORIZED)
    })
  })
  describe('Login', () => {
    const username = `${Hash.randomHash()}@cc.com`
    const password = '124231'
    let userContext: UserContextTestType
    test('Login:OK', async () => {
      let res = await tc
        .request()
        .post('/auth/local/register')
        .send({ username, password } as RegisterDto)
      expect(res).toBeCreated()
      res = await tc
        .request()
        .post('/auth/local')
        .send({ username, password } as LoginDto)
      expect(res).toBeOK()
      expect(!!res.body.jwt).toEqual(true)
      expect(res.body.user.id).not.toBeUndefined()
      userContext = tc.buildUserContext(res.body)
      expect(res.body.user.password).toBeUndefined()
    })
    test('Confirm:failed', async () => {
      const res = await userContext.request((r) => r.get('/auth/local/confirm')).query({ code: Hash.randomHash() })
      expect(res).toBeBad('Invalid code')
    })
    test('Confirm:OK', async () => {
      const user = await prismaService.user.findUnique({
        where: { id: userContext.userInfo.user.id },
      })
      const res = await userContext.request((r) => r.get('/auth/local/confirm')).query({ code: user.verifyCode })
      expect(res).toBeOK()
    })
    test('ResendConfirm', async () => {
      const userService = app.get(UserService)
      await userService.update(userContext.userInfo.user.id, { confirmed: false })
      const res = await userContext.request((r) => r.post('/auth/local/resend-confirm'))
      expect(res).toBeOK()
    })
    test.skip('Confirm:Expired', async () => {
      await proH.delay(2000)
      const user = await prismaService.user.findUnique({
        where: { id: userContext.userInfo.user.id },
      })
      const res = await userContext.request((r) => r.get('/auth/local/confirm')).query({ code: user.verifyCode })
      expect(res.statusCode).toBe(HttpStatus.BAD_REQUEST)
      expect(res.body.message).toBe('Code is expired')
    })
    test('Confirm:OK', async () => {
      let res = await userContext.request((r) => r.post('/auth/local/resend-confirm'))
      expect(res).toBeOK()
      const user = await prismaService.user.findUnique({
        where: { id: userContext.userInfo.user.id },
      })
      res = await userContext.request((r) => r.get('/auth/local/confirm')).query({ code: user.verifyCode })
      expect(res).toBeOK()
    })
    test('Me:OK', async () => {
      const res = await userContext.request((r) => r.get('/auth/me')).expect(HttpStatus.OK)
      const user: UserEntity = res.body
      expect(user.id).not.toBeUndefined()
      expect(user.password).toBeUndefined()
    })
    test.skip('Token Expired', async () => {
      jest.useFakeTimers()
      jest.setSystemTime(new Date(Date.now() + 24 * 60 * 60 * 1000))
      await userContext.request((r) => r.get('/auth/me')).expect(HttpStatus.UNAUTHORIZED)
      const res = await userContext
        .request((r) => r.get('/auth/refreshToken'))
        .set('Authorization', `Bearer ${userContext.userInfo.jwtRefresh}`)
      expect(res).toBeOK()
      userContext.setJwt(res.body.jwt)
      await userContext.request((r) => r.get('/auth/me')).expect(HttpStatus.OK)
      jest.useRealTimers()
    })
    it('Reset password', async () => {
      let user = await prismaService.user.findUnique({
        where: { id: userContext.userInfo.user.id },
      })
      expect(user.verifyCode).toBeNull()

      let res = await userContext.request((r) => r.post('/auth/local/reset-password')).send({ username })
      expect(res).toBeOK()
      user = await prismaService.user.findUnique({
        where: { id: userContext.userInfo.user.id },
      })
      expect(user.verifyCode).not.toBeNull()
      res = await userContext
        .request((r) => r.post('/auth/local/confirm-reset-password'))
        .send({
          username: user.username,
          code: user.verifyCode,
          password: '9hge9rgh9erhg',
        })
      expect(res).toBeOK()

      userContext = tc.buildUserContext(res.body)
      res = await userContext.request((r) => r.get('/auth/me')).send()
      expect(res).toBeOK()
    })
  })
})

describe('SIWE Authentication Tests', () => {
  let tc: TestContext
  let app: INestApplication
  let prismaService: PrismaService

  beforeAll(async () => {
    tc = await testHelper.createContext()
    app = tc.app
    prismaService = app.get(PrismaService)
  })

  afterAll(async () => {
    await tc?.clean()
  })

  describe('SIWE Nonce Generation', () => {
    test('Generate nonce without address', async () => {
      const res = await tc.request().get('/auth/siwe/nonce')
      expect(res).toBeOK()
      expect(res.body.nonce).toBeDefined()
      expect(typeof res.body.nonce).toBe('string')
      expect(res.body.nonce.length).toBeGreaterThan(0)
    })

    test('Generate nonce with address', async () => {
      const testWalletAddress = '0x742d35Cc6634C0532925a3b8D186dEecA45c3Cf9'
      const res = await tc.request().get('/auth/siwe/nonce').query({ address: testWalletAddress })
      expect(res).toBeOK()
      expect(res.body.nonce).toBeDefined()
      expect(typeof res.body.nonce).toBe('string')
    })
  })

  describe('User and Profile Creation', () => {
    test('Should create new user and profile for first-time wallet login', async () => {
      const newWalletAddress = '0x' + Hash.randomHash().substring(0, 40)

      // Get initial counts
      const initialUserCount = await prismaService.user.count()
      const initialProfileCount = await prismaService.profile.count()

      // Create user using the service method
      const authService = app.get(AuthService)
      const user = await authService['_createUserWithWallet'](newWalletAddress)

      expect(user).toBeDefined()
      expect(user.username).toBe(newWalletAddress.toLowerCase())
      expect(user.provider).toBe('wallet')
      expect(user.confirmed).toBe(true)

      // Verify counts increased
      const finalUserCount = await prismaService.user.count()
      const finalProfileCount = await prismaService.profile.count()

      expect(finalUserCount).toBe(initialUserCount + 1)
      expect(finalProfileCount).toBe(initialProfileCount + 1)

      // Verify profile has correct wallet address
      const profile = await prismaService.profile.findFirst({
        where: { users: { some: { id: user.id } } },
      })
      expect(profile.walletAddress).toBe(newWalletAddress.toLowerCase())
    })
  })

  describe('Logout and Token Invalidation', () => {
    test('Should invalidate JWTs on logout', async () => {
      const authService = app.get(AuthService)

      // Create test user
      const testWalletAddress = '0x' + Hash.randomHash().substring(0, 40)
      const testUser = await authService['_createUserWithWallet'](testWalletAddress)

      // Issue tokens
      const tokenResponse = await authService.issueToken(testUser)
      expect(tokenResponse.jwt).toBeDefined()

      // Get original jwtValidFrom timestamp
      const userBefore = await prismaService.user.findUnique({
        where: { id: testUser.id },
      })
      const originalJwtValidFrom = userBefore.jwtValidFrom

      // Wait to ensure timestamp difference
      await proH.delay(1000)

      // Perform logout
      await authService.signOut(testUser.id)

      // Verify jwtValidFrom was updated
      const userAfter = await prismaService.user.findUnique({
        where: { id: testUser.id },
      })
      expect(userAfter.jwtValidFrom.getTime()).toBeGreaterThan(originalJwtValidFrom.getTime())
    })
  })

  describe('JWT Strategy Token Validation', () => {
    test('Should reject tokens issued before jwtValidFrom', async () => {
      const authService = app.get(AuthService)

      // Create test user
      const testWalletAddress = '0x' + Hash.randomHash().substring(0, 40)
      const user = await authService['_createUserWithWallet'](testWalletAddress)

      // Issue token
      const tokenResponse = await authService.issueToken(user)

      // Invalidate all tokens
      await authService.signOut(user.id)

      // Try to use old token - should fail
      const res = await tc.request().get('/auth/me').set('Authorization', `Bearer ${tokenResponse.jwt}`)

      expect(res.status).toBe(HttpStatus.UNAUTHORIZED)
    })
  })
})
