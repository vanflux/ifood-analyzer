import { getCookie } from "./get-cookie";

export interface IfoodAuthSession {
  account_id: string,
  access_token: string,
}

export function getAuthSession(): IfoodAuthSession | undefined {
  const account_id = getCookie('aAccountId');
  const access_token = getCookie('aAccessToken');
  return account_id && access_token ? { account_id, access_token } : undefined;
}
