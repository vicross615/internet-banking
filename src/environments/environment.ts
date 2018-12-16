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
  PUB_ENC_KEY: `-----BEGIN PUBLIC KEY-----
  MIICITANBgkqhkiG9w0BAQEFAAOCAg4AMIICCQKCAgB0Upj4kRz5ImE224Udpi9Y
  U+xc7RALxpVtEByUR8JpN7bIwTyWBqnZDemxzfyG9xyOOh7PdTYPpdWzJ9f8x44L
  kENf8+4krOW4lw02mjwakP/1cG8WuHCyrH4P/VBdtalb9zbARij9bnselnbs4NMI
  6vWs/kzxXT+Jms6S4ncXkgb2FAP4LGPxJFSIngIqhnToHiFDwjaz8HTG3ec7LRv/
  ppbis7Cji2c/Iokj3rQ2DCOqoBZqQZEp4m+EwUeBGHGcExVKqDDf+ZF6JBFYOqJ1
  ZEFxAzYI7G6SyNaNShzBh59jKG6iL8XgDbwJ3q9/01XaS6JtksSKge3cm5/cjyC4
  sjvwyMlG9P0TI+o2XVH+9p+kahLdNFHEVD2SvrBZQJlKNc3EzDFTOnNxIgKCxs5P
  5K/E3/lWMe7tY4DOEDcuAqTZA0Vg89hW9OLarvD5VgxgDGu8l/nzmn8LblhgyKUd
  0chpeKHm6k0zPsZ50RjisiA18Tw2vJaijIrIQAUMJFZ5C4m1ezBS2G9QyXlLZ5Nb
  bj71opLGa31Dxz3q5tA3ttgZe7GvRndSm+lPqIxvGG0MPpW7U7oYwFsj+8aL87+R
  ZNJTOM89r4sgVSjiF3bOadETuGCngo+lk2G1ETQgOrftz+bIjVS235iWGXAC8nTS
  alVVrzcLvU/wxge//AcyAwIDAQAB
  -----END PUBLIC KEY-----`,
  // tslint:disable-next-line:max-line-length --- main one for Ibank
  PUB_IBANK_ENC_KEY1: `MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCbCoYy8tZ3XQ3c/Zf9gQ0/OoPZStsLNGAbOK/Ic9Ihh32Hplom/AFUKDQP1MTlusMRJYU4TnjwdCCzvh1xXZw9rF2Suo1tdTym4YtanVNtnzqLTbUTqZ3vM4kFuEYvT6C7NjDdeliHrxlgw31BodmzOyNE7PEvSbFNeuNib4KUmwIDAQAB`,

  PUB_IBANK_ENC_KEY: `MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCX8M+NflZcez4/0FrjY2WW3SK/85ypfPmaNVOFy9Jn9796ypBQNoT4yOIZ61EgwLA47ILOjD/7HVxRCJNTTwUiqU7Ce2QKEZ6FELIre+j4RfJ4ux9mAxk3U9wjaxxqDTbDvgdyGp2sKlLONRJYcsC/i8L4YekqM8LdlhhGaIfVcQIDAQAB`,
  
  PRIV_ENC_KEY: `-----BEGIN RSA PRIVATE KEY-----
  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
  -----END RSA PRIVATE KEY-----`
};
