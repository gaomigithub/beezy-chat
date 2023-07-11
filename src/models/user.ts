export interface BeeToken {
  data: {
    access_token: string;
    expires_in: number;
    refresh_token: string;
    scope: string;
    token_type: "Bearer";
  };
}

export interface LoginUser {
  id: string;
  token: string;
}

export interface UserProfile {
  id: string;
}
