import { Usuario } from './../../model/usuario-model';
import { Cliente } from './../../model/cliente-model';
import { Vistoria } from './../../model/vistoria-model';
import { DetalheVistoriaPage } from './../detalhe-vistoria/detalhe-vistoria';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the VistoriaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-vistoria',
  templateUrl: 'vistoria.html',
})
export class VistoriaPage {

  title: string;
  vistorias: Vistoria[];
  cliente: Cliente;
  user : Usuario;
  desabilitar: boolean =  false;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.title = this.navParams.get('title');
    this.vistorias = this.navParams.get('vistorias');
     this.cliente = this.navParams.get('cliente');
     this.user = this.navParams.get('usuario');
     
  }

  ionViewWillEnter() {
  //this.desabilitar =  this.title == "Agendadas" ? true : false;
  }
  ionViewWillLeave() {
    this.navCtrl.getPrevious().data.cliente =  this.cliente;
  }
  
  AbrirDetalhe(vistoria: Vistoria) {
   
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.navCtrl.push(DetalheVistoriaPage, {'vistoria': vistoria, 'cliente':this.cliente, 'usuario': this.user, 'tipo' : this.title});
  }
}
