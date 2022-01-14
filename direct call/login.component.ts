import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { EncodeAESService } from "src/app/Core/Business/AES/aes";
import { FormMatters } from "src/app/Core/Business/formMatters/formMatters";
import { AlertService } from "src/app/Core/Business/tools/alert/alert.service";
import { Constants } from "src/app/Core/Business/tools/constants/constants";
import { StorageService } from "src/app/Core/Business/tools/storage/storge-service.service";
import { LoaderService } from "src/app/Services/loader/loader.service";
import { AuthService } from "../../../Services/AuthService/auth.service";
import { AuthUserDetails, UserDetails } from "src/app/Core/Business/models/UserDetails";
import { environment } from "src/environments/environment";
import { SignatureService } from "src/app/Services/signature/signature.service";
import { CompanyService } from 'src/app/Services/Company/company.service';
import { DateService } from 'src/app/Core/Business/Date/date.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  errorMessage = '';
  validationMessages;
  UserData;
public fieldTextType: boolean;

  /****
   * testing encryption
   */

  dateString: string;
  signature: string;


  constructor(public authservice: AuthService,
    private formBuilder: FormBuilder,
    private router: Router,
    public FValidations: FormMatters,
    public constants: Constants,
    public storageService: StorageService,
    public loaderService: LoaderService,
    public alertService: AlertService,
    public encodeAESService: EncodeAESService,
    public signatureService: SignatureService,
    public companyService: CompanyService,
    public dateService: DateService
  ) {

    this.loginForm = this.FValidations.LoginMethod();
    this.validationMessages = this.constants.forErrorMessages();
    this.loginForm.patchValue({
      email: "tayoraph@gmail.com",
      password: "tennis"
    });
  }

  ngOnInit(): void {
    this.getTodaydate();
    this.signature = environment.encryption.clientKey + this.dateString;

  }
/**
 * @todo to toggle pasword iput field from text to password
 */
  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }
  getTodaydate() {
    let today = new Date().getDate().toString();
    let month = (new Date().getMonth() + 1).toString();
    let year = new Date().getFullYear().toString();
    if (today.length == 1) {
      today = "0" + today;
    }
    if (month.length == 1) {
      month = "0" + month;
    }
    this.dateString = today + month + year;
  }




  /** login method */
  async login(value) {
    const user: AuthUserDetails = {
      username: value.email,
      password: value.password,
      Permissions: "Allowed",
    }
    this.loaderService.show();
    await this.authservice.loginUser(this.signatureService.encryptData(user), this.signatureService.GetSignature())
      .subscribe((res: any) => {
        let dec = res


        if (res.responseCode != "00") {
          if (res.responseCode == "10") {
            this.loaderService.hide();

            this.alertService.simpletoast("Info", res.responseMessage, "blue");
            this.GoToChangedPassword(user.username);
            return;
          }
          this.alertService.basicAlert("Error", res.responseMessage);

        } else {
          //this.GetUserDetails(this.signatureService.encryptData(user), this.signatureService.GetSignature())
          this.storageService.User.set("email", user.username);
          this.getCompanyDetails();



          this.loginForm.reset();
        }
        this.loaderService.hide();

        //this.loginResposne(res);
      })
  }


  ForgotPassword() {
    this.router.navigate(['forgotPassword']);
  }

  /**
   *  getting company details after successful  login
   * 
   */
  GetUserDetails(user, signature) {
    this.authservice.getUserDetails(user, signature).
      subscribe(res => {
        this.storageService.User.set('user', res);

      })
  }
  /** check if default password is changed or not */
  GoToChangedPassword(username) {
    var data = { useCase: "newSubscriber", ChangePassword: true, username: username };
    var enc = this.signatureService.GetPasswordEnc(JSON.stringify(data))
    this.router.navigate(['changePassword'], { queryParams: { mxG: enc } });
  }


  /**
   * Get  company details if company is not block
   */
  getCompanyDetails() {
    this.loaderService.show();

    let email = this.storageService.User.get("email");
    this.companyService.GetCurrentCompaniesDetails(email, this.signatureService.GetSignature())
      .subscribe((res: any) => {
        let company = res.Companies[0]
        this.storageService.User.set("CompanyDetails", company);
        if (res.ResponseCode =="00") {
          let daytime = this.dateService.CheckDayTime();
          this.alertService.simpletoast(daytime, `${(company.CompanyName !== null ? company.CompanyName : 'No Name')}`, this.constants.getCustomColorCodes().default)
          this.loaderService.hide();
          this.router.navigate(['dashboard']);
        } else {
          this.alertService.basicAlert("Notice", `Your company ${company.CompanyName} has been blocked, please reach out to selfpay Administrator`, this.constants.getCustomColorCodes().blue)
          this.router.navigate(['']);
        }
        this.loaderService.hide();

      })

  }
}

