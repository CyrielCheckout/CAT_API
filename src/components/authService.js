// authService.js
import OktaAuth from '@okta/okta-auth-js';
import oktaConfig from './okta-config';

const oktaAuth = new OktaAuth(oktaConfig);

export default {
  startOAuth() {
    var oktaSignIn = `${oktaConfig.issuer}?client_id=${oktaConfig.clientId}&nonce=${this.nonce()}&redirect_uri=${oktaConfig.redirectUri}&response_type=token&state=${this.nonce()}&scope=${oktaConfig.scope}`;
        oktaSignIn = encodeURI(oktaSignIn);
        window.location.href = oktaSignIn;
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
