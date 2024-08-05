// authService.js
import OktaAuth from '@okta/okta-auth-js';
import oktaConfigSandbox from './okta-config-sandbox';
import oktaConfigProd from './okta-config-prod';
import { PRODUCTION } from '../constants';

const oktaAuth = new OktaAuth(oktaConfigSandbox);

export default {
  startOAuth(env) {
    console.log(env)
    if (env === PRODUCTION) {
      var oktaSignIn = `${oktaConfigProd.issuer}?client_id=${oktaConfigProd.clientId}&nonce=${this.nonce()}&redirect_uri=${oktaConfigProd.redirectUri}&response_type=token&state=${this.nonce()}&scope=${oktaConfigProd.scope}`;
      oktaSignIn = encodeURI(oktaSignIn);
      window.location.href = oktaSignIn;
    } else {
      var oktaSignIn = `${oktaConfigSandbox.issuer}?client_id=${oktaConfigSandbox.clientId}&nonce=${this.nonce()}&redirect_uri=${oktaConfigSandbox.redirectUri}&response_type=token&state=${this.nonce()}&scope=${oktaConfigSandbox.scope}`;
      oktaSignIn = encodeURI(oktaSignIn);
      window.location.href = oktaSignIn;
    }
  },

  nonce() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  },

  getAccessToken() {
    var url = new URL(window.location.href.replace("#access","?access"));
    return url.searchParams.get("access_token");
  }
  
};
