import { Constantes } from './../../constantes/constantes';
import { HomePage } from './../home/home';
import { LoginProvider } from './../../providers/login/login';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Usuario } from '../../model/usuario-model';
import { FuncoesProvider } from '../../providers/funcoes/funcoes';
import { NetworkProvider } from '../../providers/network/network';

/**
 * Generated class for the AlterarSenhaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@IonicPage()
@Component({
  selector: 'page-alterar-senha',
  templateUrl: 'alterar-senha.html',
})
export class AlterarSenhaPage {
  public alterarSenhaForm: FormGroup;
  public type = 'password';
  public showPass = false;
  public user: Usuario;
  constructor(public navCtrl: NavController, public navParams: NavParams, private _fb: FormBuilder,   public loginProvider: LoginProvider,   public funcoes: FuncoesProvider, private alertCtrl: AlertController,   
              public networkProvider: NetworkProvider) {

  this.user = this.navParams.get('usuario');     
  }

  ngOnInit() {
    this.alterarSenhaForm = this._fb.group({
      senhaAtual: ['', Validators.compose([
        Validators.required
      ])],
      novaSenha: ['', Validators.compose([
        Validators.required
      ])],
      reSenha: ['', Validators.compose([
        Validators.required
      ])]
    });
  }

  showPassword() {
    this.showPass = !this.showPass;
 
    if(this.showPass){
      this.type = 'text';
    } else {
      this.type = 'password';
    }
  }

  alterarSenha(){

    if (this.networkProvider.previousStatus == 0) {

    let loading = this.funcoes.showLoading("Alterando...");
    this.loginProvider.alterarSenha(this.user.Id,this.alterarSenhaForm.get('senhaAtual').value,this.alterarSenhaForm.get('novaSenha').value,this.user.Token)
      .then((data:any)=>{
        loading.dismiss();     
        
        if(data.status){

          let alert = this.alertCtrl.create({
            title: data.mensagem,         
            buttons: [       
              {
                text: 'Ok',
                handler: () => {
                 this.navCtrl.setRoot(HomePage,{'usuario': this.user});
                }
              }
            ]
          });
          alert.present();

        }else{

          this.funcoes.showAlert(data.mensagem);

        }

      }).catch((err:any)=>
      {
        loading.dismiss();
        this.funcoes.showAlert(JSON.stringify(err));
      
      });
    }else{
      this.funcoes.showAlert(Constantes.INTERNET_INDISPONIVEL);
    }
    
  }

}
