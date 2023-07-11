export interface IAuthService {
  login: () => Promise<string>;
  logout: () => void;
  getToken: () => Promise<string | undefined>;
}
