// Environment detection and API configuration
export const getApiBaseUrl = (): string => {
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  if (isDevelopment) {
    return process.env.NEXT_PUBLIC_API_BASE || 'https://depwn2021.ptg.co.th/';
  } else {
    return process.env.NEXT_PUBLIC_API_BASE || 'https://www.ptg.co.th/';
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
