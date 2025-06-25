export const getClientId = () => process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "1031251635661-o4411b01cr784910o5a41n0j8ifkagop.apps.googleusercontent.com";
export const getRedirectUrl = (provider: string) => `${window.location.origin}/auth/${provider}/callback`;
export const SCOPE = "profile email openid";
