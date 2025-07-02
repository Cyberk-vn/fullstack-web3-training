export const ROUTES = {
  HOME: "/",

  getAuthCallback: (provider: string) => `/auth/${provider}/callback`,
} as const;
