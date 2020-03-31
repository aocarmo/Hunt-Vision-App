import { Constantes } from './../../constantes/constantes';
import { Usuario } from './../../model/usuario-model';
import { Storage } from '@ionic/storage';
import { HomePage } from './../home/home';
import { FuncoesProvider } from './../../providers/funcoes/funcoes';
import { LoginProvider } from './../../providers/login/login';
import {Component} from "@angular/core";
import {NavController, AlertController, ToastController, MenuController, LoadingController} from "ionic-angular";


import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { NetworkProvider } from '../../providers/network/network';


@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  public onLoginForm: FormGroup;
  public usuario : Usuario;
  constructor(public nav: NavController, 
              public forgotCtrl: AlertController, 
              public menu: MenuController, 
              public toastCtrl: ToastController, 
              public loginProvider: LoginProvider,
              public loadingController: LoadingController,
              public funcoes: FuncoesProvider,
              private _fb: FormBuilder,
              private storage:Storage,
              public networkProvider: NetworkProvider

              ) {
    this.menu.swipeEnable(false);
  }

  ngOnInit() {
    this.onLoginForm = this._fb.group({
      usuario: ['', Validators.compose([
        Validators.required
      ])],
      senha: ['', Validators.compose([
        Validators.required
      ])]
    });
  }


  // login and go to home page
  login() {
    if (this.networkProvider.previousStatus == 0) {

    let loading = this.funcoes.showLoading("Autenticando...");
 
    this.loginProvider.doLogin(this.onLoginForm.value.usuario,this.onLoginForm.value.senha).then((data:any)=>{
    
      loading.dismiss();
    
      if(data.status){   
        
        this.usuario = new Usuario(data.token,data.dados.id,data.dados.nome,data.dados.login,data.dados.isAdmin,data.dados.avatar,data.dados.info,data.dados.organizationId);
        this.nav.setRoot(HomePage,{"usuario":this.usuario});       
      }else{      
       
        this.funcoes.showAlert(data.mensagem);
      }
    }).catch((err:any)=>{
     
      loading.dismiss();
      alert("Ocorreu um erro ao realizar o login: "+ JSON.stringify(err));
    });

    }else{
      this.funcoes.showAlert(Constantes.INTERNET_INDISPONIVEL);
    }
   
  
  }

 
  forgotPass() {

    if (this.networkProvider.previousStatus == 0) {

      let forgot = this.forgotCtrl.create({
        title: 'Esqueceu a senha?',
        message: "Insira seu e-mail para receber uma nova senha.",
        inputs: [
          {
            name: 'email',
            placeholder: 'Email',
            type: 'email'
          },
        ],
        buttons: [
          {
            text: 'Cancelar',
            handler: data => {
              console.log('Cancel clicked');
            }
          },
          {
            text: 'Enviar',
            handler: data => {
            
              if(data.email != "" ){
                let loading = this.funcoes.showLoading("Aguarde...")
                this.loginProvider.redefinirSenha(data.email).then((data:any)=>{
                  loading.dismiss();
             
                  let toast = this.toastCtrl.create({
                    message: data.mensagem,
                    duration: 3000,
                    position: 'top',
                    cssClass: 'dark-trans',
                    closeButtonText: 'OK',
                    showCloseButton: true
                  });
                  toast.present();
    
                }).catch((err:any)=>{
                  loading.dismiss();
                  let toast = this.toastCtrl.create({
                    message: 'Ocorreu um erro.' + JSON.stringify(err),
                    duration: 3000,
                    position: 'top',
                    cssClass: 'dark-trans',
                    closeButtonText: 'OK',
                    showCloseButton: true
                  });
                  toast.present();
                });
              }else{
               
                let toast = this.toastCtrl.create({
                  message: 'Informe um e-mail para redefinir a senha.',
                  duration: 3000,
                  position: 'top',
                  cssClass: 'dark-trans',
                  closeButtonText: 'OK',
                  showCloseButton: true
                });
                toast.present();
              }
            }
          }
        ]
      });
      forgot.present();

    }else{
      this.funcoes.showAlert(Constantes.INTERNET_INDISPONIVEL);
    }
   
  }

}
