import { Constantes } from './../../constantes/constantes';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Platform, LoadingController } from 'ionic-angular';
import { Vistoria } from '../../model/vistoria-model';
import { Cliente } from '../../model/cliente-model';
import { Usuario } from '../../model/usuario-model';
import { VistoriaProvider } from './../../providers/vistoria/vistoria';
import { FuncoesProvider } from '../../providers/funcoes/funcoes';
import { Storage } from '@ionic/storage';
import { Network } from '@ionic-native/network';
import { FilePath } from '@ionic-native/file-path';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { FileOpener } from '@ionic-native/file-opener';
import { File } from '@ionic-native/file';
import { DocumentViewer, DocumentViewerOptions } from '@ionic-native/document-viewer';
import { DomSanitizer } from '@angular/platform-browser';
import { NetworkProvider } from '../../providers/network/network';

/**
 * Generated class for the VistoriasConcluidasPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-vistorias-concluidas',
  templateUrl: 'vistorias-concluidas.html',
})
export class VistoriasConcluidasPage {

  title: string;
  vistorias: Vistoria[];
  cliente: Cliente;
  user: Usuario;
  desabilitar: boolean = false;

  constructor(public navCtrl: NavController,
    public vistoriaProvider: VistoriaProvider,
    public navParams: NavParams,
    public funcoes: FuncoesProvider,
    public storage: Storage,
    public network: Network,
    public alertCtrl: AlertController,
    public platform: Platform,
    public documentViewer: DocumentViewer,
    public filePath: FilePath,
    public fileTransfer: FileTransfer,
    public fileOpener: FileOpener,
    public file: File,
    public loadingController: LoadingController,
    private _sanitizer: DomSanitizer,
    public networkProvider: NetworkProvider
  ) {
    this.title = this.navParams.get('title');
    this.vistorias = this.navParams.get('vistorias');
    this.cliente = this.navParams.get('cliente');
    this.user = this.navParams.get('usuario');

  }


 async ionViewWillLeave() {
  
  this.navCtrl.getPrevious().data.cliente =  this.cliente;

}




  async abrirRelatorio(inspectionId: string, dataVistoria: string) {
    
    
    if (this.networkProvider.previousStatus == 0) {
      this.vistoriaProvider.downloadRelatorio(inspectionId, this.user.Token, this.user.Login, "diario",dataVistoria).then((data: any) => {

        let loading = this.loadingController.create({
          spinner: 'hide',
        });
        loading.present();
        var urlPdf = data.data[0]; 
        let fileName = urlPdf.split("/").pop();
        let path = null;

        const ft = this.fileTransfer.create();
        ft.onProgress((e) => {
          let prg = (e.lengthComputable) ? Math.round(e.loaded / e.total * 100) : -1;
          let interval = setInterval(() => {
            loading.data.content = this.getProgressBar(prg);

            if (prg == 100) {
              loading.dismiss();
              clearInterval(interval);
            }
          }, 10);
        });

        if (this.platform.is('ios')) {

          const opt: DocumentViewerOptions = {
            title: fileName
          };
          path = this.file.dataDirectory + fileName;

         /* ft.download(urlPdf, path).then((data: any) => {
            loading.dismiss();
            let url = data.toNativeURL();
            this.documentViewer.viewDocument(url, 'application/pdf', opt);

          });*/

          ft.download(urlPdf, path).then((data: any) => {
            //   let url = data.toURL();resolveLocalFileSystemUR

            this.file.resolveLocalFilesystemUrl(path).then((entry: any) => {
              console.log(JSON.stringify(entry.toURL()));
              this.fileOpener.open(entry.toURL(), 'application/pdf').then((data: any) => {
                loading.dismiss();
              }).catch((err: any) => {

              });
            });

          });

        } else {

          path = this.file.dataDirectory + fileName;

          ft.download(urlPdf, path).then((data: any) => {      
            this.file.resolveLocalFilesystemUrl(path).then((entry: any) => {
              var options = {             
                email : {
                    enabled : true
                },
                print : {
                    enabled : true
                },
                openWith : {
                    enabled : true
                },               
                search : {
                    enabled : true
                },
               
            }
           //   this.documentViewer.viewDocument(entry.nativeURL,'application/pdf',options);

              this.fileOpener.open(entry.toURL(), 'application/pdf').then((data: any) => {
                loading.dismiss();
              }).catch((err: any) => {
              });
              
            });
          });
        }
      });
    } else {
      this.funcoes.showAlert(Constantes.INTERNET_INDISPONIVEL);
    }

  }

  getProgressBar(percentaje) {
    let html: string = 'Fazendo download ' + percentaje + '%</br><progress value="' + percentaje + '" max="100"></progress>';
    return this._sanitizer.bypassSecurityTrustHtml(html);
  }
}
