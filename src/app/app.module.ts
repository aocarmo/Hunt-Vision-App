
import { VistoriasConcluidasPage } from './../pages/vistorias-concluidas/vistorias-concluidas';
import { DetalheVistoriaPage } from './../pages/detalhe-vistoria/detalhe-vistoria';
import {NgModule} from "@angular/core";
import {IonicApp, IonicModule, NavController} from "ionic-angular";
import {BrowserModule} from '@angular/platform-browser';
import {HttpClientModule} from '@angular/common/http';
import {IonicStorageModule} from '@ionic/storage';

import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import {Keyboard} from '@ionic-native/keyboard';


import {MyApp} from "./app.component";


import {HomePage} from "../pages/home/home";
import {LoginPage} from "../pages/login/login";

import { VistoriaPage } from "../pages/vistoria/vistoria";;

import { LoginProvider } from '../providers/login/login';
import { FuncoesProvider } from '../providers/funcoes/funcoes';
import { DetalheAmbientePage } from '../pages/detalhe-ambiente/detalhe-ambiente';
import { DetalheObjetoPage } from '../pages/detalhe-objeto/detalhe-objeto';
import { IonicSelectableModule } from 'ionic-selectable';
import { VistoriaProvider } from '../providers/vistoria/vistoria';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Network } from '@ionic-native/network';
import { ActionSheet, ActionSheetOptions } from '@ionic-native/action-sheet';
import { QrCodeScannerService } from '../providers/qr-code-scanner/qr-code-scanner-service';
import { CameraService } from '../providers/camera/camera-service';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { Diagnostic } from '@ionic-native/diagnostic';
import { FilePath } from '@ionic-native/file-path';
import { File } from '@ionic-native/file';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { ImagemModalPage } from '../pages/imagem-modal/imagem-modal';
import { AlterarSenhaPage } from '../pages/alterar-senha/alterar-senha';
import { FileOpener } from '@ionic-native/file-opener';
import { DocumentViewer } from '@ionic-native/document-viewer';
import { Device } from '@ionic-native/device';
import { NetworkProvider } from '../providers/network/network';

// import services
// end import services
// end import services

// import pages
// end import pages

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
    VistoriaPage,
    DetalheVistoriaPage,
    DetalheAmbientePage,
    DetalheObjetoPage,
    VistoriasConcluidasPage,
    ImagemModalPage,
    AlterarSenhaPage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicSelectableModule,
    IonicModule.forRoot(MyApp, {
      scrollPadding: false,
        scrollAssist: true,
        autoFocusAssist: true,
      backButtonText: 'Voltar',
      statusbarPadding: true
   
    }),
    IonicStorageModule.forRoot({
      name: '__ionic3_start_theme',
        driverOrder: ['indexeddb', 'sqlite', 'websql']
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage,
    VistoriaPage,
    DetalheVistoriaPage,
    DetalheAmbientePage,
    DetalheObjetoPage,
    VistoriasConcluidasPage,
    ImagemModalPage,
    AlterarSenhaPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Keyboard,
    LoginProvider,
    FuncoesProvider,
    VistoriaProvider,
    Camera,
    Network,
    ActionSheet,
    QrCodeScannerService,
    CameraService,
    BarcodeScanner,
    Diagnostic,
    FilePath,
    File,
    FileTransfer,
    DetalheObjetoPage,
    FileOpener,
    DocumentViewer,
    Device,
    NetworkProvider


  ]
})

export class AppModule {
}
