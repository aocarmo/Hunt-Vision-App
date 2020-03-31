import { ToastController } from 'ionic-angular';
import { Usuario } from './../../model/usuario-model';
import { Injectable } from '@angular/core';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { FuncoesProvider } from '../funcoes/funcoes';
import { Constantes } from './../../constantes/constantes';
import { App } from "ionic-angular";
import { Diagnostic } from '@ionic-native/diagnostic';


/*
  Generated class for the QrCodeScannerProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class QrCodeScannerService {

  constructor(private barcodeScanner: BarcodeScanner,
    public funcoes: FuncoesProvider,
    public http: HttpClient,
    public toastCtrl: ToastController,
    public app: App,
    private diagnostic: Diagnostic
    //     public nav: NavController
  ) {

  }

   doScanQrCode(): Promise<string> {

    let retorno = {
      status: "",
      qrCodeContent: ""
    };

    return new Promise(resolve => {

      this.barcodeScanner.scan().then((barcodeData: any) => {

        retorno.status = "true";
        retorno.qrCodeContent = barcodeData;
        resolve(JSON.stringify(retorno));

      }).catch(err => {
        retorno.status = "false";
        retorno.qrCodeContent = err;
        resolve(JSON.stringify(retorno));

      });

    });
  }

  /*
  registarCarimbo(access_token: string, hash: string, usuario_id: number) {

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded'
      })
    };

    let json = {
      "access_token": access_token,
      "hash": hash,
      "usuario_id": usuario_id
    };

    let urlParams = this.funcoes.JSON_to_URLEncoded(json, null);

    return new Promise(resolve => {

      this.http.post(Constantes.API_REGISTRAR_CARIMBO, urlParams, httpOptions).timeout(Constantes.TIMEOUT_RESQUEST).subscribe(data => {

        resolve(data);

      }, err => {
        resolve(err);
      });
    });
  }*/

  lerQrcode(): Promise<any> {
    
    let loading = this.funcoes.showLoading("Aguarde...");
  
    return new Promise(resolve => {
     this.diagnostic.isCameraAuthorized().then(async (data: any) => {

      if (data) {
       await this.doScanQrCode().then((data: string) => {
       
          let retorno = JSON.parse(data);

          if (retorno.status == "true") {
            loading.dismiss();
            //alert("DEU CERTO O QRCODE :"+JSON.stringify(retorno));
            if (!retorno.qrCodeContent.cancelled) {
               resolve(data);
            } else {
            
                loading.dismiss();
            }

          } else {
            loading.dismiss();
            this.funcoes.showAlert("Ocorreu um erro ao scanear o QrCode: " + JSON.stringify(retorno.qrCodeContent));
          }

        }).catch((err: any) => {
          loading.dismiss();
          this.funcoes.showAlert("Ocorreu um erro ao scanear o QrCode: " + JSON.stringify(err));
        });
       
      }else{

        this.diagnostic.requestCameraAuthorization().then((data:string)=>{
          loading.dismiss();
          console.log(JSON.stringify(data));
          
          if(data == "GRANTED" || data == "authorized" ){          
            this.lerQrcode();
          }else{           
            this.funcoes.showAlert("Sem permissão para acessar a câmera, por favor conceda permissão ao HuntVision para acessar a câmera do seu dispositivo em configurações.");
          }
        }).catch((err:any)=>{
          loading.dismiss();
          this.funcoes.showAlert("Ocorreu um erro ao scanear o QrCode: " + JSON.stringify(err));
        });
       
      }
    
    }).catch((err: any) => {
      loading.dismiss();
      this.funcoes.showAlert("Ocorreu um erro ao scanear o QrCode: " + JSON.stringify(err));
    });

  });

  }


}
