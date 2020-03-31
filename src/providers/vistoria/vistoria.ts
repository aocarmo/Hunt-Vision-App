
import { RespostaAvulsa } from './../../model/resposta-avulsa';
import { Vistoria } from './../../model/vistoria-model';
import { LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Injectable, resolveForwardRef } from '@angular/core';
import { Constantes } from './../../constantes/constantes';
import 'rxjs/add/operator/map';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { Resposta } from '../../model/resposta-model';
import { FileTransferObject, FileTransfer } from '@ionic-native/file-transfer';
import { DomSanitizer } from '@angular/platform-browser';
import { LoginPage } from '../../pages/login/login';

/*
  Generated class for the VistoriaProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class VistoriaProvider {

  public prg: number = 0
  constructor(public http: HttpClient, public fileTransfer: FileTransfer, 
              public loadingCtrl: LoadingController, 
              private _sanitizer: DomSanitizer,
              public storage: Storage) {

  }

  obterAmbientes(idVistoria: string, token: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      })
    };

    return new Promise(resolve => {

      this.http.get(Constantes.OBTER_AMBIENTES + '?idVistoria=' + idVistoria, httpOptions).timeout(Constantes.TIMEOUT_RESQUEST).subscribe((data: any) => {

        resolve(data);


      }, err => {
        resolve(err);

      });
    });
  }

  obterObjetoId(idObjeto: string, token: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      })
    };

    return new Promise(resolve => {

      this.http.get(Constantes.OBTER_OBJETO + '?objectId=' + idObjeto, httpOptions).timeout(Constantes.TIMEOUT_RESQUEST).subscribe((data: any) => {

        resolve(data);


      }, err => {
        resolve(err);

      });
    });
  }

  obterClienteId(idCliente: string, token: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      })
    };

    return new Promise(resolve => {

      this.http.get(Constantes.OBTER_CLIENTE_ID + '?clienteId=' + idCliente, httpOptions).timeout(Constantes.TIMEOUT_RESQUEST).subscribe((data: any) => {

        resolve(data);


      }, err => {
        resolve(err);

      });
    });
  }

  obterAmbienteId(ambienteId: string, token: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      })
    };

    return new Promise(resolve => {

      this.http.get(Constantes.OBTER_AMBIENTE_ID + '?ambienteId=' + ambienteId, httpOptions).timeout(Constantes.TIMEOUT_RESQUEST).subscribe((data: any) => {

        resolve(data);


      }, err => {
        resolve(err);

      });
    });
  }

  obterVistoriaId(id: string, token: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      })
    };

    return new Promise(resolve => {

      this.http.get(Constantes.OBTER_VISTORIA_ID + '?id=' + id, httpOptions).timeout(Constantes.TIMEOUT_RESQUEST).subscribe((data: any) => {

        resolve(data);


      }, err => {
        resolve(err);

      });
    });
  }



  obterClientes(userId: string, token: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      })
    };

    return new Promise(resolve => {

      this.http.get(Constantes.OBTER_CLIENTES + '?userId=' + userId, httpOptions).timeout(Constantes.TIMEOUT_RESQUEST).subscribe((data: any) => {

        resolve(data);

      }, err => {
        resolve(err);

      });
    });
  }

  obterVistorias(idClient: string, ano: string, mes: string, token: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      })
    };

    return new Promise(resolve => {

      this.http.get(Constantes.OBTER_VISTORIAS + '?idClient=' + idClient + "&mes=" + mes + "&ano=" + ano, httpOptions).timeout(Constantes.TIMEOUT_RESQUEST).subscribe((data: any) => {

        resolve(data);

      }, err => {
        resolve(err);

      });
    });
  }


  salvarResposta(resposta: Resposta, token: string) {
 
    
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      })
    };

    return new Promise(resolve => {

      this.http.post(Constantes.SALVAR_RESPOSTA, resposta, httpOptions).timeout(Constantes.TIMEOUT_RESQUEST).subscribe(async (data: any) => {

        
       if(data.returnStatus){
        
          if(data.data.clientId != '' && data.data.clientId != null){
            
            await this.storage.get(data.data.clientId).then(async(vistorias :any) =>{
             
              
              let listaVistorias = vistorias;
             
              if(listaVistorias != null){
                
                for (let vistoria of listaVistorias) {
              
                  if(vistoria.inspections.length >0){
                   
                    if(vistoria.inspections[0].inspectionInstanceId == data.data.inspectionInstanceId){
                    
                      vistoria.inspections[0].status = data.data.status;
                     
                      
                    }
  
                  }

                }

              await this.storage.set(data.data.clientId,listaVistorias);

              }

            });
          }
          
        }
        resolve(data);

      }, err => {

        resolve(err);


      });
    });
  }

  //Sem a barra de prograssão - Obsoleto
  /* public uploadImage(questionId: string, urlFotosEnviar: Resposta['photos'], token: string) {
 
     // File for Upload
     let targetPath = "";
     let filename = "";
     let promises_array:Array<any> = [];       
     
     for (let foto of urlFotosEnviar) {
 
       targetPath = foto.url;
       filename = foto.url.replace(/^.*[\\\/]/, '');
   
       // File name only
       var options = {
         id: questionId,
         headers: { 'Authorization': 'Bearer ' + token },
         fileKey: "file",
         fileName: filename,
         chunkedMode: false,
         mimeType: "multipart/form-data",
         params: { 'fileName': filename }
       };
   
       const fileTransfer: FileTransferObject = this.fileTransfer.create();
       
       promises_array.push(fileTransfer.upload(targetPath, Constantes.UPLOAD_IMAGEM, options));
     
     }
 
     return Promise.all(promises_array);
   }*/

  public async uploadImageWithProgressBar(questionId: string, urlFotosEnviar: Resposta['photos'], token: string) {

    // File for Upload
    let targetPath = "";
    let filename = "";
    let promises_array: Array<any> = [];
    let loader = this.loadingCtrl.create({
      spinner: 'hide',
    });
    loader.present();

    for (let foto of urlFotosEnviar) {

      targetPath = foto.url;
      filename = foto.url.replace(/^.*[\\\/]/, '');

      // File name only
      var options = {
        id: questionId,
        headers: { 'Authorization': 'Bearer ' + token },
        fileKey: "file",
        fileName: filename,
        chunkedMode: false,
        mimeType: "multipart/form-data",
        params: { 'fileName': filename }
      };

      const fileTransfer: FileTransferObject = this.fileTransfer.create();
      await fileTransfer.onProgress((e) => {
        let prg = (e.lengthComputable) ? Math.round(e.loaded / e.total * 100) : -1;

        let interval = setInterval(() => {
          loader.data.content = this.getProgressBar(prg);

          if (prg == 100) {
            loader.dismiss();
            clearInterval(interval);
          }
        }, 10);


      });
      await fileTransfer.upload(targetPath, Constantes.UPLOAD_IMAGEM, options).then(async (data: any) => {
        promises_array.push(data);
      });

    }

    return promises_array;

  }

  getProgressBar(percentaje) {
    let html: string = 'Fazendo upload ' + percentaje + '%</br><progress value="' + percentaje + '" max="100"></progress>';
    return this._sanitizer.bypassSecurityTrustHtml(html);
  }

  public async downloadRelatorio(inspectionId: string, token: string,login: string, tipoRelatorio: string, dataVistoria: string) {
    
  
    
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      })
    };


    let dtInicial = "";
    let dtFinal = "";

    if (tipoRelatorio == "mensal"){

      let dtAtual = new Date().toLocaleString("pt-BR", { timeZone: "America/Bahia" }).split(' ');
      let dtSeparada = dtAtual[0].split("/");  
   
      let ultimoDiaMes = new Date(parseInt(dtSeparada[2]), parseInt(dtSeparada[1]), 0).getDate();
      dtInicial = dtSeparada[2] + "-" + parseInt(dtSeparada[1]) + "-01";
      dtFinal = dtSeparada[2] + "-" + parseInt(dtSeparada[1]) + "-" + ultimoDiaMes;

    }else {
      let dtSeparada = dataVistoria.split("/");  
      dtInicial = dtSeparada[0] + "-" + parseInt(dtSeparada[1]) + "-" + parseInt(dtSeparada[2]);

    }
   
  
    return new Promise(async resolve => {
 
     await this.http.get(Constantes.DOWNLOAD_PDF + '?login='+login+'&inspectionId=' + inspectionId + "&dtInicial=" + dtInicial + "&dtFinal=" + dtFinal, httpOptions).timeout(Constantes.TIMEOUT_RESQUEST).subscribe((data: any) => {
     
      console.log(Constantes.DOWNLOAD_PDF + '?login='+login+'&inspectionId=' + inspectionId + "&dtInicial=" + dtInicial + "&dtFinal=" + dtFinal);
      console.log(JSON.stringify(data));
        resolve(data);
        

      }, err => {
        resolve(err);

      });
    });
  }

  obterVistoriasPorDia(idUser: string, token: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      })
    };

    let dataLocal = new Date().toLocaleString("pt-BR", { timeZone: "America/Bahia" }).split(' ');
    let dtSeparada = dataLocal[0].split("/");  
    let dtAtual = dtSeparada[2] + "-" + parseInt(dtSeparada[1]) + "-" + parseInt(dtSeparada[0]);
   
    return new Promise(resolve => {

      this.http.get(Constantes.OBTER_VISTORIAS_DIA + '?idUser=' + idUser + "&dtAtual=" + dtAtual, httpOptions).timeout(Constantes.TIMEOUT_RESQUEST).subscribe((data: any) => {

        resolve(data);

      }, err => {
        resolve(err);

      });
    });
  }


  salvarVistoriaAvulsa(resposta: RespostaAvulsa, token: string) {
 
   let teste = JSON.stringify(resposta)
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      })
    };
  
    
    return new Promise(resolve => {

      this.http.post(Constantes.SALVAR_RESPOSTA_AVULSA, teste, httpOptions).timeout(Constantes.TIMEOUT_RESQUEST).subscribe(async (data: any) => {

       
       if(data.returnStatus){
        
          if(data.data.clientId != '' && data.data.clientId != null){
            
            await this.storage.get(data.data.clientId).then(async(vistorias :any) =>{
                           
             
              let listaVistorias : any[] = vistorias;
              let Vistoria :any = {};
              Vistoria.inspections  = [{}];
             
              Vistoria.date = data.data.date;              
              Vistoria.inspections[0].inspectionId = data.data.inspectionId;             
              Vistoria.inspections[0].date = data.data.date;            
              Vistoria.inspections[0].name = data.data.name;
              Vistoria.inspections[0].status = data.data.status;            
              Vistoria.inspections[0].inspectionInstanceId = data.data.inspectionInstanceId; 
              listaVistorias.push(Vistoria);
              
             
              if(listaVistorias != null){

                await this.storage.set(data.data.clientId,listaVistorias);

              }

            });
          }
          
        }
        
        
        resolve(data);

      }, err => {
        
        resolve(err);


      });
    });
  }


}
