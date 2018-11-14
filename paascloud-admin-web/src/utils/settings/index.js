const gbs = {
  host: 'http://paascloud.net',
  lockr_prefix: 'PASSCLOUD_PAAS_',
  secret_key: '^#rwd6Ffz$X5alRN',
  domain: '.paascloud.net',
  api_host: 'http://api.paascloud.net',
  secret: {
    key_str: '^#rwd6Ffz$X5alRN',
    iv_str: '^#rwd6Ffz$X5alRN'
  }
};
const cbs = {};

if (process.env.NODE_ENV === 'production') {
  gbs.domain = '.paascloud.net';
  gbs.api_host = 'http://api.paascloud.net';
} else {
  gbs.domain = '.paascloud.net';
  gbs.lockr_prefix += 'DEV_';
  gbs.api_host = 'http://dev-api.paascloud.net:7979';
}
const enums = {
  USER: {
    LOGIN_NAME: 'LOGIN_NAME',
    MENU_LIST: 'MENU_LIST',
    AUTH_TOKEN: 'AUTH_TOKEN',
    REFRESH_TOKEN: 'REFRESH_TOKEN',
    REMEMBER_ME: 'REMEMBER_ME',
    REDIRECT_URI: 'REDIRECT_URI'
  },
  BROWSER: {
    BROWSER_WIDTH: 'BROWSER_WIDTH',
    BROWSER_HEIGHT: 'BROWSER_HEIGHT',
    LEFT_MENU_WIDTH: 'LEFT_MENU_WIDTH',
    RIGHT_CONTENT_WIDTH: 'RIGHT_CONTENT_WIDTH',
    MAIN_CONTENT_HEIGHT: 'MAIN_CONTENT_HEIGHT',
    MENU_FLAG: 'MENU_FLAG'
  },
  ADDRESS: {
    DISTRICT: 'ADDRESS_DISTRICT'
  },
  KAPTCHA_CODE: 'KAPTCHA_CODE'
};

export {
  gbs,
  cbs,
  enums
};
