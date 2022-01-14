import { Injectable } from '@angular/core';
import { ErrorService } from '../../Core/Business/error/error.service';
import { HttpErrorHandler } from '../../Core/Business/error/http-error-handler.service';
import { HttpErrorResponse, HttpClient } from '@angular/common/http';
import { map, retry } from 'rxjs/operators';
import { environment } from '../.././../environments/environment';
import { Constants } from '../../Core/Business/tools/constants/constants';
import { BaseHttpService } from 'src/app/Core/BaseHttp/base-http-service.service';


@Injectable({
  providedIn: 'root'
})
export class AuthService  extends BaseHttpService{
  
  public httpErrorHandler: HttpErrorHandler;
  public const: any;
  public theHeader: any;
  public errorHandle: any;
  public errorService: ErrorService;
  public EmailConnect = environment.emailBaseUrl;
  // public EmailConnect = "mailService/";

  constructor(public httpClient: HttpClient,
    public constants: Constants,
  ) {
    super()
    this.httpErrorHandler = new HttpErrorHandler(this.errorService);
  }



  loginUser(body, signature) {
    let connect = environment.BaseUrl + environment.BaseUrlExt + environment.login
    return this.post(connect, signature, body);
  }

  // sending the user an email for forgoot password
  SendForgotPasswordEmail(body) {
    
    // let connect = "mailService/" + environment.forgotPassword;
   let connect = this.EmailConnect + environment.forgotPassword;
    let header = this.constants.httpHeader()
    return this.httpClient.post(connect, body, { headers: header, responseType: 'json' })
      .pipe(map((data) => {
        return data;
      }),
        retry(3),
      );
  }

  // / sending the user's new password 
  ChangePasswordMethod(body, signature) {
    let connect = environment.BaseUrl + environment.BaseUrlExt +environment.ChangePasswordMethod
    let header = this.constants.httpHeader()
      .set('client_id', environment.encryption.client_id)
      .set('client_key', signature)
      .set('body', body);
   // console.log(body)
    return this.httpClient.post(connect, '', { headers: header, responseType: 'json' })
      .pipe(map((data) => {
        return data;
      }),
        retry(3),
      );
  }

  /** 
   * Register new company 
   */

  RegisterCompany(body, signature) {
    let connect = environment.BaseUrl + environment.BaseUrlExt +environment.register
    let header = this.constants.httpHeader()
      .set('client_id', environment.encryption.client_id)
      .set('client_key', signature)
      .set('body', body);
    console.log(body)
    return this.httpClient.post(connect, '', { headers: header, responseType: 'json' })
      .pipe(map((data) => {
        return data;
      }),
        retry(3),
      );
  }


  /**
   * 
   * @param body  
   * @param signature 
   * @returns 
   */
   getUserDetails(body, signature) {
    let connect = environment.BaseUrl + environment.BaseUrlExt +environment.register
    return this.get(connect, signature, body);
  }
}
