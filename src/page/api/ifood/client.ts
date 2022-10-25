import { getAuthSession } from "./utils/get-auth-session";

const WSV3_ACCESS_KEY = '69f181d5-0046-4221-b7b2-deef62bd60d5';
const WSV3_SECRET_KEY = '9ef4fb4f-7a1d-4e0d-a9b1-9b82873297d8';

export class IfoodClient {
  async makeCall<T>(method: string, url: string, body: any): Promise<T> {
    const session = getAuthSession();
    return fetch(url, {
      method,
      body: method.toLowerCase() === 'get' ? undefined : JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
        access_key: WSV3_ACCESS_KEY,
        secret_key: WSV3_SECRET_KEY,
        ...(session && {
          account_id: session.account_id,
          Authorization: session.access_token,
        }),
      },
    }).then(x => x.json());
  }
}

