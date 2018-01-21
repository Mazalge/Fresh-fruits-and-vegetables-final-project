interface AuthConfig {
    clientID: string;
    domain: string;
    callbackURL: string;
  }
  
  export const AUTH_CONFIG: AuthConfig = {
    clientID: 'VglpbGNKfxy2tx2u9UiIdjJfGrRkg7BV',
    domain: 'finalp.auth0.com',
    callbackURL: 'http://localhost:4200/callback'
  };