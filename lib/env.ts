// Subpath the app is deployed under (e.g. "/Customer-console"). Must be
// prepended to same-origin fetch() calls to internal /api routes, since
// Next.js's basePath does not rewrite fetch() automatically (only
// next/link, next/image, next/script, etc.).
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || '';

// Prepend basePath to a static asset URL. Needed because <Image> with
// `unoptimized: true` does not apply basePath to the src automatically.
export const img = (path: string) => `${BASE_PATH}${path}`;

// Environment detection and API configuration
export const getApiBaseUrl = (): string => {
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  if (isDevelopment) {
    return process.env.NEXT_PUBLIC_API_BASE || 'https://depwn2021.ptg.co.th/';
  } else {
    // return process.env.NEXT_PUBLIC_API_BASE || 'https://www.ptg.co.th/';
    return process.env.NEXT_PUBLIC_API_BASE || 'https://depwn2021.ptg.co.th/';
  }
};

export const API_BASE_URL = getApiBaseUrl();

// Rewards portal base URL (dev/prod aware)
export const getRewardsBaseUrl = (): string => {
  const isDevelopment = process.env.NODE_ENV === 'development';
  if (isDevelopment) {
    return process.env.NEXT_PUBLIC_REWARDS_BASE_URL || 'https://deprewards.ptg.co.th';
  } else {
    return process.env.NEXT_PUBLIC_REWARDS_BASE_URL || 'https://rewards.ptg.co.th';
  }
};

export const REWARDS_BASE_URL = getRewardsBaseUrl();

// API endpoints
export const API_ENDPOINTS = {
  LOGIN: (uuid: string) => `${API_BASE_URL}approvalapiex/v1/auth/customer/userlogin/${uuid}`,
  // Add other endpoints as needed
} as const;

export const isDevMode = (): boolean => {
  return process.env.NODE_ENV === 'development';
};
