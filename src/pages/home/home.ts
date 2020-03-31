import { RespostaAvulsa } from './../../model/resposta-avulsa';
import { NetworkProvider } from './../../providers/network/network';
import { LoginPage } from './../login/login';
import { Usuario } from './../../model/usuario-model';
import { VistoriaProvider } from './../../providers/vistoria/vistoria';
import { Vistoria } from './../../model/vistoria-model';
import { Cliente } from './../../model/cliente-model';
import { Component, NgZone } from "@angular/core";
import { NavController, PopoverController, NavParams, AlertController, Platform, LoadingController, ActionSheetController } from "ionic-angular";
import { IonicSelectableComponent } from 'ionic-selectable';
import { FuncoesProvider } from '../../providers/funcoes/funcoes';
import { VistoriaPage } from '../vistoria/vistoria';
import { Storage } from '@ionic/storage';
import { Resposta } from '../../model/resposta-model';
import { Network } from '@ionic-native/network';
import { Answer } from '../../model/answer';
import { FilePath } from '@ionic-native/file-path';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { FileOpener } from '@ionic-native/file-opener';
import { File } from '@ionic-native/file';
import { DocumentViewer, DocumentViewerOptions } from '@ionic-native/document-viewer';
import { DomSanitizer } from '@angular/platform-browser';
import { VistoriasConcluidasPage } from '../vistorias-concluidas/vistorias-concluidas';
import { QrCodeScannerService } from '../../providers/qr-code-scanner/qr-code-scanner-service';
import { Constantes } from '../../constantes/constantes';
import { Objeto } from '../../model/objeto-model';
import { DetalheObjetoPage } from '../detalhe-objeto/detalhe-objeto';

declare var $cordovaFileOpener2: any;
class Port {
  public id: string;
  public name: string;
}

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {
  public clientes: Cliente[];
  public cliente: Cliente = null;
  public ports: Port[] = [];
  public port: Port;
  public user: Usuario;
  public vistoriasPendentes: Vistoria[] = [];
  public vistoriasAgendadas: Vistoria[] = [];
  public vistoriasAvulsas: Vistoria[] = [];
  public vistoriasConcluidas: Vistoria[] = [];
  public qtdRespostasOff = null;
  answer: Answer;
  public prg: any;
  public dataAtual: string;

  constructor(public nav: NavController,
    public popoverCtrl: PopoverController,
   
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
    public actionSheetCtrl: ActionSheetController,
    public qrCodeScannerService: QrCodeScannerService,
    public zone: NgZone,
    public networkProvider: NetworkProvider

  ) {

    this.user = this.navParams.get('usuario');
    let dtAtual = new Date().toLocaleString("pt-BR", { timeZone: "America/Bahia" }).split(' ');
    this.dataAtual = dtAtual[0];

  }


  ionViewDidEnter() {  
 
    this.storage.get(this.user.Id).then((data: any) => {

      if (data != null) {
        let respostasOff = data;
        if (respostasOff.length > 0) {
          this.qtdRespostasOff = respostasOff.length;
        }
      }

    });
  }

  portChange(event: {
    component: IonicSelectableComponent,
    value: any
  }) {

    for (let cliente of this.clientes) {
      if (cliente.id == event.value.id) {
        this.cliente = cliente;
      }
    }
    this.atualizarVitoriasCliente(event.value.id)
   
  }

 

  async ionViewWillEnter() {

    await this.atualizarClientes();
    let objCliente = this.navParams.get('cliente');
    this.zone.run(async () => {
      await this.atualizarVitoriasCliente(objCliente.id);
    });

  
    if(objCliente.id != null && objCliente.id != ""){
      for (let cliente of this.clientes) {
        if (cliente.id == objCliente.id) {
          this.cliente = cliente;
        }
      }   
    
     
    }


  }

  async atualizarClientes() {
    let loading = this.funcoes.showLoading("Aguarde...");
    //Zerando as variáveis para limpar a tela
    this.cliente = null;
    this.vistoriasPendentes = [];
    this.vistoriasAgendadas = [];
    this.vistoriasAvulsas = [];
    this.vistoriasConcluidas = [];
    this.ports = [];
    this.clientes = [];


    await this.storage.get(Constantes.STORAGE_CLIENTES).then(async (clientes: any) => {

      if (clientes != null) {
     
        this.clientes = clientes;

        for (let i = 0; i < this.clientes.length; i++) {
          this.port = new Port();
          this.port.id = this.clientes[i].id;
          this.port.name = this.clientes[i].name;
          this.ports.push(this.port);

        }
        this.port = null;//Para nao deixar o ultimo marcado por padrão     
        loading.dismiss();

        if (this.networkProvider.previousStatus == 0) {
          this.obterClientes();
        }

      } else {

        if (this.networkProvider.previousStatus == 0) {

          //Obten os clientes
          await this.vistoriaProvider.obterClientes(this.user.Id, this.user.Token).then((data: any) => {

            if (data.returnStatus) {

              this.storage.set(Constantes.STORAGE_CLIENTES, data.data);

              this.clientes = data.data;
              for (let i = 0; i < this.clientes.length; i++) {
                this.port = new Port();
                this.port.id = this.clientes[i].id;
                this.port.name = this.clientes[i].name;
                this.ports.push(this.port);

              }
              this.port = null;//Para nao deixar o ultimo marcado por padrão     
              loading.dismiss();
            } else {
              this.funcoes.showAlert("Ocorreu uma falha ao carregar os clientes.")
              loading.dismiss();
            }

          }).catch((err: any) => {
            loading.dismiss();
         //  alert("Ocorreu um erro ao obter os clientes: " + JSON.stringify(err));
          });
        } else {
          loading.dismiss();
          this.funcoes.showAlert(Constantes.INTERNET_INDISPONIVEL);
        }

      }
      this.obterVitoriasDoDia();

    });

  }

  obterClientes() {

     this.vistoriaProvider.obterClientes(this.user.Id, this.user.Token).then((data: any) => {
      
      if (data.returnStatus) {
        this.storage.set(Constantes.STORAGE_CLIENTES, data.data);
      } 

    }).catch((err: any) => {    
   
    });
  };

  AbrirVistorias(title: string) {

    switch (title) {
      case "Pendentes":
        this.nav.push(VistoriaPage, { 'title': title, 'vistorias': this.vistoriasPendentes, 'cliente': this.cliente, 'usuario': this.user });
        break;
      case "Agendadas":
        this.nav.push(VistoriaPage, { 'title': title, 'vistorias': this.vistoriasAgendadas, 'cliente': this.cliente, 'usuario': this.user });
        break;
      case "Avulsas":
        this.nav.push(VistoriaPage, { 'title': title, 'vistorias': this.vistoriasAvulsas, 'cliente': this.cliente, 'usuario': this.user });
        break;
      case "Concluídas":
        this.nav.push(VistoriaPage, { 'title': title, 'vistorias': this.vistoriasConcluidas, 'cliente': this.cliente, 'usuario': this.user });
        break;

    };

  }
  AbrirVistoriasConcluidas(title: string) {

    this.nav.push(VistoriasConcluidasPage, { 'title': title, 'vistorias': this.vistoriasConcluidas, 'cliente': this.cliente, 'usuario': this.user });
  }


  async atualizarVitoriasCliente(idCliente: string) {
    let loading = this.funcoes.showLoading("Obtendo vistorias...");
    //Zerando as variáveis para limpar a tela
    this.vistoriasPendentes = [];
    this.vistoriasAgendadas = [];
    this.vistoriasAvulsas = [];
    this.vistoriasConcluidas = [];


    await this.storage.get(idCliente).then(async (vistorias: any) => {

      
      
      if (vistorias != null) {
     
        for (let todasVistorias of vistorias) {

          for (let inspection of todasVistorias.inspections) {
            let data = inspection.date.date.split(" ");
            inspection.date.date = data[0].replace("-", "/").replace("-", "/");
            
            if(inspection.inspectionInstanceId != 0 || inspection.inspectionInstanceId != ""){
              if (inspection.status == "scheduled") {

                this.vistoriasAgendadas.push(inspection);
  
              } else if (inspection.status == "pending") {
                this.vistoriasPendentes.push(inspection);
  
              } else if (inspection.status == "concluded") {
  
                this.vistoriasConcluidas.push(inspection);
  
              }
            }

       
          }
        }

        loading.dismiss();
      
        if (this.networkProvider.previousStatus == 0) {
          this.obterVitoriasCliente(idCliente);
        }

      } else {

        if (this.networkProvider.previousStatus == 0) {

          let dtAtual = new Date().toLocaleString("pt-BR", { timeZone: "America/Bahia" }).split(' ');
          let dtSeparada = dtAtual[0].split("/");

          this.vistoriaProvider.obterVistorias(idCliente, dtSeparada[2], dtSeparada[1], this.user.Token).then((data: any) => {
      
            if (data.returnStatus) {
              
              this.storage.set(idCliente, data.data);

              for (let todasVistorias of data.data) {
      
                for (let inspection of todasVistorias.inspections) {
                  let data = inspection.date.date.split(" ");
                  inspection.date.date = data[0].replace("-", "/").replace("-", "/");
      
                  if(inspection.inspectionInstanceId != 0 || inspection.inspectionInstanceId != ""){
                    if (inspection.status == "scheduled") {
      
                      this.vistoriasAgendadas.push(inspection);
        
                    } else if (inspection.status == "pending") {
                      this.vistoriasPendentes.push(inspection);
        
                    } else if (inspection.status == "concluded") {
        
                      this.vistoriasConcluidas.push(inspection);
        
                    }
                  }
                }
              }
      
              loading.dismiss();
            } else {
              loading.dismiss();
              this.funcoes.showAlert(data.mensagem);
            }
      
          }).catch((err: any) => {
            loading.dismiss();
            alert("Ocorreu um erro obter as vistorias: " + JSON.stringify(err));
          });
         
        } else {
          loading.dismiss();
          this.funcoes.showAlert(Constantes.INTERNET_INDISPONIVEL);
        }

      }  

    });

  }


  obterVitoriasCliente(idCliente: string) {

    let dtAtual = new Date().toLocaleString("pt-BR", { timeZone: "America/Bahia" }).split(' ');
    let dtSeparada = dtAtual[0].split("/");

    this.vistoriaProvider.obterVistorias(idCliente, dtSeparada[2], dtSeparada[1], this.user.Token).then((data: any) => {

      if (data.returnStatus) {
             
        this.storage.set(idCliente, data.data);    
      } 
    });

  }

  //Metodo para enviar as respostas offline
  public async  sincronizarRespostasOffline() {

    if (this.networkProvider.previousStatus == 0) {

      let loading = this.funcoes.showLoading("Sincronizando...");

      //Cria o array de resposta que será incrementado com cada resposta
      let respostas: Resposta[] = [];
      //Busca no local storage se ja existe algum armazenamento de resposta para o usuario logado
      await this.storage.get(this.user.Id).then(async (data: any) => {

        if (data != null) {

          //Seta o array de respostas salvo no local storage  em uma variavel de array de respostas
          respostas = data;
          //Loop para verificar se a resposta informada é nova
          for (let resposta of respostas) {

            //Envia primeiro as fotos para obter a url
            if (resposta.photos.length > 0) {

              //Metodo para fazer o upload das imagens com barra de progressão
              await this.vistoriaProvider.uploadImageWithProgressBar(resposta.questionId, resposta.photos, this.user.Token).then(async (data: any) => {

                let i = 0;
                for (let response of data) {

                  let retorno = JSON.parse(response.response);

                  if (retorno.returnStatus) {
                    resposta.photos[i].url = retorno.data[0];
                    i++;
                  }

                }
           
              }).catch((err: any) => {
                loading.dismiss();
                this.funcoes.showAlert("Ocorreu um erro ao salvar imagens: " + JSON.stringify(err));
              });
            }
            
            await this.salvar(resposta);

          }

          await this.storage.remove(this.user.Id).then(async (data: any) => {
            loading.dismiss();
            this.funcoes.showAlert("Vistorias sincronizadas com sucesso.");
            this.qtdRespostasOff = null;

          });

        } else {
          loading.dismiss();
          this.funcoes.showAlert("Não existem vistorias para sincronizar.");
        }

      });

    } else {
      this.funcoes.showAlert("O dispositivo está sem conexão, favor conectar a internet e tentar novamente");
    }


  }

  async salvar(resposta: Resposta): Promise<any> {

    this.answer = new Answer(resposta.date,
      resposta.numericValue,
      resposta.textualValue,
      resposta.optionsValue,
      resposta.photos,
      resposta.obs);

    resposta.question.answer = this.answer;


    await new Promise(resolve => {
      this.vistoriaProvider.salvarResposta(resposta, this.user.Token).then(async (data: any) => {
        resolve(data);
      }).catch((err: any) => {
        resolve(err);
      });
    });

  }


  obterVitoriasDoDia() {
    let loading = this.funcoes.showLoading("Obtendo vistorias para hoje...");

    this.vistoriaProvider.obterVistoriasPorDia(this.user.Id, this.user.Token).then((data: any) => {

      if (data.returnStatus == "true") {

        this.vistoriasAgendadas = data.data;
        loading.dismiss();
      } else {
        loading.dismiss();
      }

    }).catch((err: any) => {
      loading.dismiss();
      alert("Ocorreu um erro obter as vistorias: " + JSON.stringify(err));
    });


  }

  lerQrCode() {

    let actionSheet = this.actionSheetCtrl.create({
      title: 'O que deseja fazer?',
      buttons: [
        {
          text: 'Ver Vistorias',
          handler: () => {
            this.qrCodeScannerService.lerQrcode().then((data: any) => {

              let qrCodeRetorno = JSON.parse(data);

              if (qrCodeRetorno.status == "true") {

                let inspectionId = qrCodeRetorno.qrCodeContent.text.split('/')[1];

                this.abrirRelatorio(inspectionId);
              }



            }).catch((err: any) => {

            });
          }
        },
        {
          text: 'Fazer Vistoria',
          handler: () => {

          //  this.fazerVistoriaAvulsa("5730661a-6315-42bd-9d3d-bb2fb0fec2e2/b7Ie9CyRfPFxeJA/0lBwWd4qJ0Lk6zG");
            this.qrCodeScannerService.lerQrcode().then((data: any) => {

              let qrCodeRetorno = JSON.parse(data);

              if (qrCodeRetorno.status == "true") {
                this.fazerVistoriaAvulsa(qrCodeRetorno.qrCodeContent.text);
              }



            }).catch((err: any) => {

            });
          }
        },
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {

          }
        }
      ]
    });

    actionSheet.present();
  }


  async abrirRelatorio(inspectionId: string) {


    if (this.networkProvider.previousStatus == 0) {
      this.vistoriaProvider.downloadRelatorio(inspectionId, this.user.Token, this.user.Login, "mensal", "").then((data: any) => {

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


  async fazerVistoriaAvulsa(qrCode: string) {

   
    
    let loading = this.funcoes.showLoading("Aguarde...");

    if (this.networkProvider.previousStatus == 0) {

      let dtAtual = new Date().toLocaleString("pt-BR", { timeZone: "America/Bahia" });
      let respostaAvulsa : RespostaAvulsa = new RespostaAvulsa();
      respostaAvulsa.date = dtAtual;
      respostaAvulsa.agentId = this.user.Id;

      let inspectionId = qrCode.split('/')[1].trim(); 
      let objectId = qrCode.split('/')[2].trim();    
      respostaAvulsa.objectId = objectId

      let objeto: Objeto;
      let vistoria: Vistoria = new Vistoria();

      /*   await this.vistoriaProvider.obterAmbienteId(ambienteId,this.user.Token).then((data:any)=>{
           ambiente = data.data;
         });*/

      await this.vistoriaProvider.obterObjetoId(objectId, this.user.Token).then((data: any) => {
        objeto = data.data;
      });

      await this.vistoriaProvider.obterVistoriaId(inspectionId, this.user.Token).then((data: any) => {

        vistoria.clientId = data.data[0].clientId;
        vistoria.inspectionId = data.data[0].id;
        vistoria.inspectionInstanceId = "0";

      });
      loading.dismiss();

      //console.log(JSON.stringify(objeto.address));
      this.nav.push(DetalheObjetoPage, { 'vistoria': vistoria, 'usuario': this.user, 'objeto': objeto, 'ambiente': null, 'cliente': null, 'avulsa': true, 'respostaAvulsa' : respostaAvulsa });

    } else {
      loading.dismiss();
      this.funcoes.showAlert(Constantes.INTERNET_INDISPONIVEL);
    }

  }




}


