import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Constants } from 'projects/core/src/public-api';
import { BaseHttpService } from '../BaseHttp/base-http.service';
import { environment } from 'projects/insurer-portal/src/environments/environment';
import { User } from 'projects/storage/src/public-api';
import { AuthResponseData } from 'projects/models/src/public-api';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService  extends BaseHttpService{
  

  public const: any;
  public theHeader: any;
  public errorHandle: any;
 public BaseUrl = environment.BaseUrl;

  constructor(public httpClient: HttpClient,
    public constants: Constants,
  ) {
    super()
  }


 /**
   * @todo Authenticate User
   * @param email
   * @param password 
   * 
   */

  loginUser(body: User):Observable<AuthResponseData> {
    let connect = this.BaseUrl + environment.BaseUrlExt + environment.login
    return this.post<AuthResponseData>(connect, body);
  }



}
