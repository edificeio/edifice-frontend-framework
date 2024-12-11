import { ISessionFramework } from './interfaces';
import { Session } from './Session';
import { transport } from '../transport/Framework';
import { ERROR_CODE } from '../globals';

export class SessionFramework implements ISessionFramework {
  session: Session = new Session();

  public initialize(): Promise<void> {
    return this.session.initialize();
    // TODO Finir le bootstrapping, voir infra-front/lib.ts
  }

  public login(
    email: string,
    password: string,
    rememberMe?: boolean,
    secureLocation?: boolean,
  ): Promise<void> {
    const data = new FormData();
    data.append('email', email);
    data.append('password', password);
    if (typeof rememberMe !== 'undefined') {
      data.append('rememberMe', '' + rememberMe);
    }
    if (typeof secureLocation !== 'undefined') {
      data.append('secureLocation', '' + secureLocation);
    }

    return transport.http
      .post<void>('/auth/login', data, {
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
      })
      .finally(() => {
        switch (transport.http.latestResponse.status) {
          case 200: // error, TODO look for error message in returned html...
            throw ERROR_CODE.MALFORMED_DATA;
          case 302: // success TODO redirects cannot be intercepted with axios in a browser !!!
          default:
            break;
        }
      });
  }

  logout(): Promise<void> {
    return transport.http.get<void>('/auth/logout').finally(() => {
      // void, always successful
    });
  }
}

/** The whole framework is a singleton. */
export const session: SessionFramework = new SessionFramework();
