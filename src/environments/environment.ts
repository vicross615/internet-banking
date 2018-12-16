// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  AUX_BENEFICIARY: 'https://gtweb.gtbank.com/AUXILIARYWEBSERVICES/Api/Beneficiary',
  AUX_URL: 'https://gtweb.gtbank.com/AUXILIARYWEBSERVICES/api',
  BASE_URL: 'https://gtweb.gtbank.com/WebAPIs/Pub',
  AUTH_API: '/GTBAuthenticationService/api',
  CUST_SERV: '/GTBCustomerService/api',
  TRANSF_SERV: '/GTBTransferService/api',
  REQ_SERV: '/GTBRequestService/api',
  PAYMENTS_SERV: '/GTBBillPaymentService/api',
  CHANNEL: 'IBANK',
  CHANNEL_SHORTNAME: 'IBD',
  ENV_NAME: 'localhost:4200',
  ATM_LIMIT: 15000,
  PUB_ENC_KEY: ``,
  PUB_IBANK_ENC_KEY1: ``,
  PUB_IBANK_ENC_KEY: ``,
 
  PRIV_ENC_KEY: `-----BEGIN RSA PRIVATE KEY-----
  
  -----END RSA PRIVATE KEY-----`
};
