import { HomePage } from './../home/home';
import { AuthserviceProvider } from './../../providers/authservice/authservice';
import { Component } from '@angular/core';
import { NavController, LoadingController, Loading, AlertController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmailValidator } from '../../validators/email';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  loginForm: FormGroup;
  loading: Loading;
  email:string = "";
  password: string = "";

  constructor(public navCtrl: NavController,
              public authData: AuthserviceProvider,
              public formBuilder: FormBuilder,
              public alertCtrl: AlertController,
              public loadingCtrl: LoadingController) {

    this.loginForm = formBuilder.group({
      email: ['', Validators.compose([Validators.required, 
      EmailValidator.isValid])],
      password: ['', Validators.compose([Validators.minLength(6), 
      Validators.required])]
    });
  }

  goToResetPassword(){
  }
  
  createAccount(){
    this.signupUser();
  }

  loginUser(){
    if (!this.loginForm.valid){
      console.log(this.loginForm.value);
      let alert = this.alertCtrl.create({
        title: "Echec authentification",
        message: "Veuillez saisir un identifiant et un mot de passe valides",
        buttons: [
          {
            text: "Ok",
            role: 'cancel'
          }
        ]
      });
      alert.present();
    } else {
      this.authData.loginUser(this.loginForm.value.email, this.loginForm.value.password)
      .then( authData => {
        this.navCtrl.setRoot(HomePage);
      }, error => {
        this.loading.dismiss().then( () => {
          let alert = this.alertCtrl.create({
            title: "Echec authentification",
            message: error.message,
            buttons: [
              {
                text: "Ok",
                role: 'cancel'
              }
            ]
          });
          alert.present();
        });
      });
  
      this.loading = this.loadingCtrl.create({
        dismissOnPageChange: true,
      });
      this.loading.present();
    }
  }

  signupUser(){
    if (!this.loginForm.valid){
      console.log(this.loginForm.value);
    } else {
      this.authData.signupUser(this.loginForm.value.email, this.loginForm.value.password)
      .then(() => {
        this.navCtrl.setRoot(HomePage);
      }, (error) => {
        this.loading.dismiss().then( () => {
          var errorMessage: string = error.message;
            let alert = this.alertCtrl.create({
              message: errorMessage,
              buttons: [
                {
                  text: "Ok",
                  role: 'cancel'
                }
              ]
            });
          alert.present();
        });
      });

      this.loading = this.loadingCtrl.create({
        dismissOnPageChange: true,
      });
      this.loading.present();
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

}