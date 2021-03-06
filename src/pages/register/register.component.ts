import { LoginPage } from "./../login/login.component";
import { Component } from "@angular/core";
import { NavController, NavParams, MenuController, LoadingController } from "ionic-angular";
import { SharedProvider } from "../../shared/shared.provider";
import { FormBuilder, FormGroup, FormControl, Validators } from "@angular/forms";
import { AuthService } from "../../core/auth.service";
import { User } from "../../model/user";

@Component({
  selector: "page-register",
  templateUrl: "register.component.html"
})

export class RegisterPage {
  user = {} as User;
  isRegisterSubmitted = false;
  public registerForm: FormGroup;

  constructor(public shared: SharedProvider, public menuCtrl: MenuController, public fb: FormBuilder,
    private auth: AuthService, public loadingCtrl: LoadingController, public navCtrl: NavController, public navParams: NavParams) {
    this.menuCtrl.enable(false, 'myMenu');
    this.BindData();
  }

  BindData() {
    this.registerForm = this.fb.group({
      'email': new FormControl('', [Validators.required, Validators.email]),
      'password': new FormControl('', [Validators.required, Validators.minLength(6)])
    });
  }

  async register(objUser: User, isValid: boolean) {
    this.isRegisterSubmitted = true;
    if (isValid) {
      const loading = this.loadingCtrl.create({
        content: 'Please Wait',
        spinner: 'crescent'
      });
      loading.present();
      try {
        await this.auth.signUp(objUser);
        this.isRegisterSubmitted = false;
        loading.dismiss();
        this.navCtrl.setRoot(LoginPage, {}, { animate: true, direction: 'forward' });
      } catch (error) {
        console.log(error);
        loading.dismiss();
        switch (error.code) {
          case 'auth/invalid-email':
            this.shared.Toast.show('Please enter a valid email address.');
            break;
          case 'auth/weak-password':
            this.shared.Toast.show('Enter strong password.');
            break;
          case 'auth/email-already-in-use':
            this.shared.Toast.show('This email has already been used for another account.');
            break;
          default:
            this.shared.Toast.show(error.message)
            break;
        }
      }
    }
  }

  login() {
    this.navCtrl.setRoot(LoginPage);
  }
}
