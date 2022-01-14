import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Constants, FormValidation } from 'projects/core/src/public-api';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';
import { AuthService } from 'projects/services/src/lib/Authentication/auth.service';
import {  appLoader, AppState, GetAllSubscribedInsurers, loaderStatus, login, loginSuccess, MyUserDetails, User, userDetails } from 'projects/storage/src/public-api';
import { Store } from '@ngrx/store';


@Component({
  selector: 'lib-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.scss']
})
export class LogInComponent implements OnInit {
  loginForm!: FormGroup;
  public fieldTextType!: boolean;
  public errorMessage = '';
  public validationMessages! : any;
  public  eye = faEye;  
  public  eyeslash = faEyeSlash;  

  constructor(
    public formValidation: FormValidation, 
    public constants : Constants,
    private router: Router,
    public authService: AuthService,
    private store : Store<AppState>) { 
   
   
    }

  ngOnInit(): void {
    this.loginForm = this.formValidation.LoginMethod();
    this.validationMessages = this.constants.formValidationErrorMessages();
    // sample login 
    this.loginForm.patchValue({
      email: "test@test.com",
      password: "password"  
    });
  }


  /**
 * @todo to toggle pasword iput field from text to password
 */
   toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }

  /** @Param Reactive form Values
   * @todo Log  user into the app
   */

  login(value:User){
    this.store.dispatch(appLoader({loaderStatus : true})); // note that dispactch is a function that gets an argumement depending on the odel used
    this.store.dispatch(login({user:value}))
    console.log(this.store.select(loginSuccess({user:value})))
  }

}
