import { ToastController, normalizeURL } from 'ionic-angular';
import { Platform } from 'ionic-angular';
import { FilePath } from '@ionic-native/file-path';
import { File } from '@ionic-native/file';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Injectable } from '@angular/core';
import { Diagnostic } from '@ionic-native/diagnostic';


declare var cordova: any;

@Injectable()
export class CameraService {
  localImagem: string = null;
  private win: any = window;
  constructor(public camera: Camera, 
              private diagnostic: Diagnostic,
              public file: File,
              public filePath: FilePath,
              public platform:Platform,
              public toastCtrl: ToastController
              ) { }


  takePicture(sourceType: number): Promise<string> {
  
  
    let retorno = {
      status: "",
      pathImage: "",
      mensagem: ""
    };

    return new Promise(resolve => {
    
      this.diagnostic.isCameraAuthorized().then((data: any) => {
  
        if (data) {
  
          const options: CameraOptions = {
            quality: 50,
            //destinationType: this.camera.DestinationType.DATA_URL,
            encodingType: this.camera.EncodingType.JPEG,
            mediaType: this.camera.MediaType.PICTURE,
            sourceType: sourceType,
            //allowEdit: true,
            destinationType: this.camera.DestinationType.FILE_URI,
            correctOrientation:true,
            cameraDirection: 0
          }

          this.camera.getPicture(options).then((imageData) => {
  
            
            if (this.platform.is('android') && sourceType === this.camera.PictureSourceType.PHOTOLIBRARY) {
              this.filePath.resolveNativePath(imageData)
                .then(filePath => {
                 
                  let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
                  let currentName = imageData.substring(imageData.lastIndexOf('/') + 1, imageData.lastIndexOf('?'));
                  
                  this.copyFileToLocalDir(correctPath, currentName, this.createFileName()).then((data:any)=>{
                  
                    retorno.status = "true"; 
                    retorno.pathImage = data;
                   
                    resolve(JSON.stringify(retorno));
                  }).catch((err:any)=>{
                    retorno.status = "false";
                    retorno.mensagem = "Ocorreu um erro ao salvar a imagem: " +JSON.stringify(err);                 
                    resolve(JSON.stringify(err));
                  });

                });
            } else {
             
              
              var currentName = imageData.substr(imageData.lastIndexOf('/') + 1);
              var correctPath = imageData.substr(0, imageData.lastIndexOf('/') + 1);
         
              this.copyFileToLocalDir(correctPath, currentName, this.createFileName()).then((data:any)=>{
                
                retorno.status = "true"; 
                retorno.pathImage = data;
                resolve(JSON.stringify(retorno));
              }).catch((err:any)=>{
                
                retorno.status = "false";
                retorno.mensagem = "Ocorreu um erro ao salvar a imagem: " +JSON.stringify(err);                 
                resolve(JSON.stringify(err));
              });
            }  
         
          }, (err) => {
           
            retorno.status = "false";          
            if(JSON.stringify(err) == '"No Image Selected"'){
              retorno.mensagem = "Nenhuma imagem foi selecionada."
            }else  if(JSON.stringify(err) == '"has no access to assets"'){
              retorno.mensagem = "Nenhuma imagem foi selecionada."
            }else  if(JSON.stringify(err) == '"No camera available"'){
              retorno.mensagem = "Operação cancelada.";
            }         
            resolve(JSON.stringify(retorno));
          });

        } else {
 
 
          this.diagnostic.requestCameraAuthorization().then((data: string) => {
         
            if (data == "GRANTED" || data == "authorized") {
          
              this.takePicture(sourceType).then((data: string)=>{
                resolve(data);
              });
            } else {
          
              retorno.status = "false";
              retorno.mensagem = "Sem permissão para acessar a câmera, por favor conceda permissão ao HuntVision para acessar a câmera do seu dispositivo em configurações.";
              resolve(JSON.stringify(retorno));
            }
          }).catch((err: any) => {
          
            retorno.status = "false";
            retorno.mensagem = ("Ocorreu um erro ao scanear o QrCode: " + JSON.stringify(err));
            resolve(JSON.stringify(retorno));
          });
        }
      }).catch((err: any) => {
       
        retorno.status = "false";
        retorno.mensagem = JSON.stringify(err);
        resolve(JSON.stringify(retorno));
      });
    });
  }

 
// Create a new name for the image
private createFileName() {
  var d = new Date(),
  n = d.getTime(),
  newFileName =  n + ".jpg";
  return newFileName;
}
 
// Copy the image to a local folder
private copyFileToLocalDir(namePath, currentName, newFileName):Promise<any>  {
 
  return this.file.copyFile(namePath, currentName, cordova.file.dataDirectory, newFileName).then(success => {
   /* this.file.readAsDataURL(cordova.file.dataDirectory,newFileName).then((data:any)=>{
      alert(data); CONVERT UMA URL EM BASE 64
   });*/
   
    //this.localImagem = this.win.Ionic.WebView.convertFileSrc(cordova.file.dataDirectory + newFileName);
    this.localImagem = cordova.file.dataDirectory + newFileName
    
    return this.localImagem;
        
  }, error => {
    this.presentToast(JSON.stringify(error));
  });
}
 
private presentToast(text) {
  let toast = this.toastCtrl.create({
    message: text,
    duration: 3000,
    position: 'top'
  });
  toast.present();
}
 
// Always get the accurate path to your apps folder
public pathForImage(img) {
  if (img === null) {
    return '';
  } else {
    return cordova.file.dataDirectory + img;
  }
}
}
