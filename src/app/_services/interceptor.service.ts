import { Injectable } from '@angular/core';
import { HttpInterceptor } from '@angular/common/http';
import * as JsEncryptModule from 'jsencrypt';
import { environment } from '../../environments/environment';



@Injectable()
export class InterceptorService implements HttpInterceptor {
  private PUB_KEY = environment.PUB_ENC_KEY;
  private PRIV_KEY = environment.PRIV_ENC_KEY;

  constructor( ) {
  }

  intercept (req, next) {
    const encrypt = new JsEncryptModule.JSEncrypt();
    encrypt.setPublicKey(this.PUB_KEY);
    const encrypted = encrypt.encrypt(JSON.stringify(req.body));
    console.log('encrypted');
    console.log(encrypted);
    const decrypt = new JsEncryptModule.JSEncrypt();
    decrypt.setPrivateKey(this.PRIV_KEY);
    const uncrypted = decrypt.decrypt(encrypted);
    console.log('uncrypted');
    console.log(JSON.parse(uncrypted));
    console.log(req);
    console.log(req.body);
    return next.handle(req);
  }

  
}
