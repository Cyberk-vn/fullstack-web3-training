export const ROUTES = {
  HOME: "/home",
  AUTH: "/auth",

  getAuthCallback: (provider: string) => `/auth/${provider}/callback`,
} as const;
