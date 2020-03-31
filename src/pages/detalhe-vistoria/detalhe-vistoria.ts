import { FuncoesProvider } from './../../providers/funcoes/funcoes';
import { VistoriaProvider } from './../../providers/vistoria/vistoria';
import { Ambientes } from './../../model/ambientes-model';
import { Vistoria } from './../../model/vistoria-model';
import { DetalheAmbientePage } from './../detalhe-ambiente/detalhe-ambiente';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Cliente } from '../../model/cliente-model';
import { Usuario } from '../../model/usuario-model';
import { QrCodeScannerService } from '../../providers/qr-code-scanner/qr-code-scanner-service';
import { Objeto } from '../../model/objeto-model';
import { Storage } from '@ionic/storage';
import { Constantes } from '../../constantes/constantes';
import { NetworkProvider } from '../../providers/network/network';

/**
 * Generated class for the DetalheVistoriaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-detalhe-vistoria',
  templateUrl: 'detalhe-vistoria.html',
})
export class DetalheVistoriaPage {

  vistoria: Vistoria;
  cliente: Cliente;
  qtdObjetos: number = 0;
  user: Usuario;
  tipo: string = "";


  ambientes: Ambientes[] = [];
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public vistoriaProvider: VistoriaProvider,
    public funcoes: FuncoesProvider,
    public qrCodeScannerService: QrCodeScannerService,
    public storage: Storage,
    public networkProvider: NetworkProvider
    
  ) {
    this.vistoria = this.navParams.get('vistoria');
    this.cliente = this.navParams.get('cliente');
    this.user = this.navParams.get('usuario');
    this.tipo = this.navParams.get('tipo');



  }

  async ionViewWillEnter() {

    await this.atualizarAmbientes();

  }

  AbrirDetalhe(title: string, ambiente: Ambientes) {

    this.navCtrl.push(DetalheAmbientePage, { 'title': title, 'ambiente': ambiente, 'usuario': this.user, 'cliente': this.cliente, 'vistoria': this.vistoria });
  }

  ObterAmbientes() {
   
    this.vistoriaProvider.obterAmbientes(this.vistoria.inspectionInstanceId, this.user.Token).then((data: any) => {
    
  
      
      if (data.returnStatus) {
        this.storage.set(this.vistoria.inspectionInstanceId, data.data);
      }

    });
  }


  async atualizarAmbientes() {
    this.ambientes = [];
    let loading = this.funcoes.showLoading("Aguarde...");
  
    await this.storage.get(this.vistoria.inspectionInstanceId).then(async (ambientes: any) => {

      if (ambientes != null) {

        for (let i = 0; i < ambientes.length; i++) {
          let ambiente: any = null;
          let objetos: Objeto[];
          objetos = ambientes[i][1];

          ambiente = new Ambientes(ambientes[i][0], objetos);
          this.ambientes.push(ambiente);

        }

        loading.dismiss();

        if (this.networkProvider.previousStatus == 0) {
          this.ObterAmbientes();
        }

      } else {

        if (this.networkProvider.previousStatus == 0) {

          await this.vistoriaProvider.obterAmbientes(this.vistoria.inspectionInstanceId, this.user.Token).then((data: any) => {
            if (data.returnStatus) {
           
              this.storage.set(this.vistoria.inspectionInstanceId, data.data);

              for (let i = 0; i < data.data.length; i++) {
                let ambiente: any = null;
                let objetos: Objeto[];
                objetos = data.data[i][1];

                ambiente = new Ambientes(data.data[i][0], objetos);
                this.ambientes.push(ambiente);
              }
              loading.dismiss();
            } else {
              loading.dismiss();
             
            }

          }).catch((err: any) => {
            loading.dismiss();
            this.funcoes.showAlert("Ocorreu um erro ao obter os ambientes: " + JSON.stringify(err));
          });

        } else {
          loading.dismiss();
          this.funcoes.showAlert("Você não possui dados offiline. " + Constantes.INTERNET_INDISPONIVEL);
        }

      }
 
    });

  }

  /*obterClientes() {

    this.vistoriaProvider.obterClientes(this.user.Id, this.user.Token).then((data: any) => {

      if (data.returnStatus) {
        this.storage.set(Constantes.STORAGE_CLIENTES, data.data);
      }

    }).catch((err: any) => {

    });
  };*/



  lerQrCode() {
    this.qrCodeScannerService.lerQrcode();
  }


}
