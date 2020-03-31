import { FuncoesProvider } from './../../providers/funcoes/funcoes';
import { Usuario } from './../../model/usuario-model';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DetalheObjetoPage } from '../detalhe-objeto/detalhe-objeto';
import { Ambientes } from './../../model/ambientes-model';
import { Objeto } from '../../model/objeto-model';
import { Cliente } from '../../model/cliente-model';
import { Vistoria } from '../../model/vistoria-model';
import { Storage } from '@ionic/storage';


/**
 * Generated class for the DetalheAmbientePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-detalhe-ambiente',
  templateUrl: 'detalhe-ambiente.html',
})
export class DetalheAmbientePage {
  title: string;
  ambiente: Ambientes;
  listaAmbientes: Ambientes [] =[];
  user: Usuario;
  cliente: Cliente;  
  vistoria: Vistoria;
  constructor(public navCtrl: NavController, public navParams: NavParams, public funcoes: FuncoesProvider,
              public storage: Storage) {
   
    this.ambiente = this.navParams.get('ambiente');
    this.title = this.ambiente.Nome;
    this.user = this.navParams.get('usuario');
    this.cliente = this.navParams.get('cliente');
    this.vistoria = this.navParams.get('vistoria');
   
  }

  ionViewWillEnter() {
       
    this.ambiente = this.navParams.get('ambiente');
  
    for(let objeto of this.ambiente.Objetos) {
      if(!objeto.hasOwnProperty('qtdRespostas') && !objeto.hasOwnProperty('qtdFotos')){
        objeto.qtdRespostas = 0;
        objeto.qtdFotos = 0;
      }
    }

  }


  AbrirObjeto(objeto:Objeto) {
    /*if(objeto.qtdFotos > 0 || objeto.qtdRespostas > 0){
        this.funcoes.showAlert("Objeto já respondido!");
    }else{
      // Reset the content nav to have just this page
      // we wouldn't want the back button to show in this scenario
    this.navCtrl.push(DetalheObjetoPage,{'objeto':objeto,'ambiente': this.ambiente, 'usuario': this.user, 'cliente': this.cliente, 'vistoria': this.vistoria});
    }*/

    this.navCtrl.push(DetalheObjetoPage,{'objeto':objeto,'ambiente': this.ambiente, 'usuario': this.user, 'cliente': this.cliente, 'vistoria': this.vistoria});
   
  }
    
  

}
