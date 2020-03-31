import { RespostaAvulsa } from './../../model/resposta-avulsa';
import { HomePage } from './../home/home';
import { Device } from '@ionic-native/device';
import { Answer } from './../../model/answer';
import { AlertController } from 'ionic-angular';
import { VistoriaProvider } from './../../providers/vistoria/vistoria';
import { Resposta } from './../../model/resposta-model';
import { Ambientes } from './../../model/ambientes-model';
//import { FotoObjeto } from './detalhe-objeto';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { FuncoesProvider } from './../../providers/funcoes/funcoes';
import { Network } from '@ionic-native/network';
import { Perguntas } from './../../model/perguntas-model';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController, ModalController, normalizeURL, Platform } from 'ionic-angular';
import { Objeto } from '../../model/objeto-model';
import { ActionSheet, ActionSheetOptions } from '@ionic-native/action-sheet';
import { Constantes } from './../../constantes/constantes';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { File } from '@ionic-native/file';
import { Storage } from '@ionic/storage';




import {
  FormGroup,
  FormControl,
  FormBuilder,
  FormArray, Validators

} from '@angular/forms';
import { CameraService } from '../../providers/camera/camera-service';
import { ImagemModalPage } from '../imagem-modal/imagem-modal';
import { Cliente } from '../../model/cliente-model';
import { Usuario } from '../../model/usuario-model';
import { Vistoria } from '../../model/vistoria-model';
import { NetworkProvider } from '../../providers/network/network';
declare var cordova: any;
export interface FotoObjeto {
  fotoExibir: SafeUrl;
  fotoPath: string;
}
/**
 * Generated class for the DetalheObjetoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-detalhe-objeto',
  templateUrl: 'detalhe-objeto.html',
})

export class DetalheObjetoPage {
  langs;
  langForm;
  title: string;
  perguntas: Perguntas[];
  option: boolean;
  infoIfNotConformant: string = null;
  mensagensNaoConforme: any = [];
  fotosExibir: FotoObjeto[] = [];
  private win: any = window;
  public objeto: Objeto;
  ambiente: Ambientes;
  cliente: Cliente;
  user: Usuario;
  photos: Resposta["photos"] = [];
  vistoria: Vistoria;
  answer: Answer;
  avulsa:boolean = false;
  respostaAvulsa: RespostaAvulsa;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public camera: CameraService,
    public network: Network,
    private actionSheet: ActionSheet,
    public funcoes: FuncoesProvider,
    private sanitizer: DomSanitizer,
    public fileTransfer: FileTransfer,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public file: File,
    public modalCtrl: ModalController,
    public platform: Platform,
    public vistoriaProvider: VistoriaProvider,
    private fb: FormBuilder,
    private alert: AlertController,
    public storage: Storage,
    public device:Device,
     public networkProvider: NetworkProvider


  ) {


    this.objeto = this.navParams.get('objeto');
    this.title = this.objeto.name;
    this.perguntas = this.objeto.questions;    
    this.ambiente = this.navParams.get('ambiente');
    this.user = this.navParams.get('usuario');
    this.cliente = this.navParams.get('cliente');
    this.vistoria = this.navParams.get('vistoria');
    this.avulsa = this.navParams.get('avulsa');
    this.respostaAvulsa = this.navParams.get('respostaAvulsa');
   
    

    this.langForm = this.createGroup();

  }

  //Criando campos dinamiicos
  createGroup() {
    const group = this.fb.group({});

    let i = 0;
    for (let pergunta of this.perguntas) {
      //Caso ja exista alguma foto permite altera-la
     if(!pergunta.hasOwnProperty("fotosExibir")){
      pergunta.fotosExibir = [];
      
     }
     
      
      group.addControl(pergunta.id, this.fb.control('', Validators.required));

      //Caso seja obrigatorio pedir observação
      if (pergunta.askForObs) {
        group.addControl(pergunta.id + "_obs", this.fb.control('', Validators.required));
      } else {
        group.addControl(pergunta.id + "_obs", this.fb.control(''));
      }


    }
    return group;
  }




 async ionViewWillLeave() {
  
    //Atualizando o ambiente
    this.objeto.questions = this.perguntas;

    for (let objeto of this.ambiente.Objetos) {
      if (objeto.id == this.objeto.id) {
        objeto = this.objeto;
      }
    }
   
    this.navCtrl.getPrevious().data.ambiente = this.ambiente;


  }

  //Exibir a mensagem de não conformidade
  verficarConformidade(mensagemNaoConformidade: string, perguntaId:string) {
  
    
    if (mensagemNaoConformidade != null && mensagemNaoConformidade != "") {
      
      let existMsg = false;
      for (let mensagem of this.mensagensNaoConforme) {
        
        if(mensagem.id == perguntaId){
          existMsg = true;
        }

      }
      if(!existMsg){
        let teste = {
          id : perguntaId,
          msg : mensagemNaoConformidade
  
        }
        this.mensagensNaoConforme.push(teste);
  
      }
    
    }else{

      for (let mensagem of this.mensagensNaoConforme) {

        if(mensagem.id == perguntaId){
                  
          let index = this.mensagensNaoConforme.indexOf(mensagem);
          this.mensagensNaoConforme.splice(index,1);
        }
       
      }
      
    }

  }

  async verificarFotosObrigatorias(event) {
    let loading = this.funcoes.showLoading("Salvando...");

    let salvar: boolean = true;
  
    for (let pergunta of this.perguntas) {
      if (pergunta.askForPhotos && pergunta.fotosExibir.length == 0) {
        this.funcoes.showAlert(pergunta.text + " \n Fotos obrigatórias");
        salvar = false;
      }
    }
   
    
    
    if (salvar) {
   
      this.doSubmit(event).then((status : any)=>{
        loading.dismiss();

        if(status == "concluded"){
         
          let alert = this.alert.create({
            title: 'A vistoria foi concluída. Deseja editar alguma resposta?',
            buttons: [
              {
                text: 'Sim',
                handler: data => {
                  this.navCtrl.pop();
                }
              },
              {
                text: 'Não',
                handler: data => {
                  this.navCtrl.setRoot(HomePage, {"idCliente" : this.cliente.id,"usuario":this.user, "cliente" : this.cliente});
                }
              }

            ]
          });
          alert.present();
        }else{
          let alert = this.alert.create({
            title: 'Resposta(s) salva(s).',
            buttons: [
              {
                text: 'OK',
                handler: data => {
                  this.navCtrl.pop();
                }
              }
            ]
          });
          alert.present();
        }

       
      });
     

      /*await this.doSubmit(event).then((data: any) => {
        
        loading.dismiss();

        console.log(JSON.stringify(data));
        
        let alert = this.alert.create({
          title: 'Resposta(s) salva(s).',
          buttons: [
            {
              text: 'OK',
              handler: data => {
                this.navCtrl.pop();
              }
            }
          ]
        });
        alert.present();

      });*/

    }
      loading.dismiss();
    

  }

  async doSubmit(event) {


    let promises_array: Array<any> = [];
    let qtdRespostas = 0;
    let qtdfotos = 0;
    let statusVistoria = "";
    let respostasAvulsas :Resposta [] = [];

    let z = 0;
    for (let pergunta of this.perguntas) {
     
      
      //Esvazia oarray de fotos
      this.photos = [];

      let optionsValue: boolean[] = [];

      if (pergunta.type != 'numeric' && pergunta.type != 'textual') {
      
        //Setando os options
        for (let i = 0; i < pergunta.options.length; i++) {
          if (pergunta.options[i].text == this.langForm.value[pergunta.id]) {
            optionsValue[i] = true;
          } else {
            optionsValue[i] = false;
          }
        }
      } else {
        optionsValue = null;
      }

      
      //Setando as fotos
      for (let foto of pergunta.fotosExibir) {

        this.photos.push({
          'height': 500,
          'url': foto.fotoPath,
          'width': 800
        });
      }

      //Setando a quantidade de fotoa total
      qtdfotos = qtdfotos + pergunta.fotosExibir.length;

      let data: any = new Date().toLocaleString("pt-BR", { timeZone: "America/Bahia" });
       
      let fotostemp = pergunta.fotosExibir;

      let resposta = new Resposta(this.user.Id,
        this.cliente == null ? this.vistoria.clientId : this.cliente.id,
        data,
        pergunta.id,
        this.vistoria.inspectionId,
        this.vistoria.inspectionInstanceId != "0" ? this.vistoria.inspectionInstanceId : "",
        pergunta.type == 'numeric' ? this.langForm.value[pergunta.id] : null,
        this.objeto.id,
        this.langForm.value[pergunta.id + "_obs"],
        optionsValue,
        this.photos,
        pergunta.id,
        pergunta.type == 'textual' ? this.langForm.value[pergunta.id] : null);
      delete pergunta.fotosExibir;
      resposta.question = pergunta;
      pergunta.fotosExibir = fotostemp;
      

      //Setando as respostas
      for (let i = 0; i < this.objeto.questions.length; i++) {
        if (this.objeto.questions[i].id == resposta.questionId) {
          qtdRespostas = qtdRespostas + 1;
        }
      }
    //Somente se nao for avulsa
    if(!this.avulsa){
        //Setando os objetos
        for (let objeto of this.ambiente.Objetos) {
          if (objeto.id == this.objeto.id) {

            objeto.qtdFotos = qtdfotos;
            objeto.qtdRespostas = qtdRespostas;

          }
        }
    } 
    
      //Caso ahaja conexao salva online
      if (this.networkProvider.previousStatus == 0)  {
        
        //Envia primeiro as fotos para obter a url
        if (resposta.photos.length > 0) {

          //Metodo para fazer o upload das imagens com barra de progressão
          await this.vistoriaProvider.uploadImageWithProgressBar(resposta.questionId, resposta.photos, this.user.Token).then((data: any) => {
            
            let i = 0;
            for (let response of data) {

              let retorno = JSON.parse(response.response);

              if (retorno.returnStatus) {
                resposta.photos[i].url = retorno.data[0];
                i++;
              }

            }
          //  promises_array.push(await this.salvar(resposta));
           

          }).catch((err: any) => {

            this.funcoes.showAlert("Ocorreu um erro ao salvar imagens: " + JSON.stringify(err));
          });

      

        } /*else {
         // promises_array.push(await this.salvar(resposta));

        }*/

        //Verifica se é avulsa
        if(!this.avulsa){

          await this.salvar(resposta).then((save:any)=>{
          
            statusVistoria =  save.data.status;
             
           });

        }else{      
          
          respostasAvulsas.push(resposta);
        }
        

      } else {       
        await this.salvarOffline(resposta);
      }

    }
    if(this.avulsa && respostasAvulsas != []){
      await this.salvarAvulsa(respostasAvulsas).then((save:any)=>{
      
        statusVistoria =  save.data.status + "avulsa";
        
      }).catch((err:any)=>{
  
      });
    }
 
    return statusVistoria;

  }

  salvar(resposta: Resposta): Promise<any> {

    this.answer = new Answer(resposta.date,
      resposta.numericValue,
      resposta.textualValue,
      resposta.optionsValue,
      resposta.photos,
      resposta.obs);

      //Salvo as resposta na pergunta
    for (let pergunta of this.perguntas) {
      if(pergunta.id == resposta.questionId){
          pergunta.answer = this.answer 
      }
    }

    resposta.question.answer = this.answer;

  return new Promise(async resolve => {
     await this.vistoriaProvider.salvarResposta(resposta, this.user.Token).then((data: any) => {
    
        resolve(data);        
      }).catch((err: any) => {
        resolve(err);
      });
    });

  }

  salvarAvulsa(respostas: Resposta[]): Promise<any> {
    
    this.respostaAvulsa.answers = [];
    for (let resposta of respostas) {
    
      delete resposta.question['fotosExibir'];
      delete resposta.question.answer;
      
      
      this.answer = new Answer(resposta.date,
        resposta.numericValue,
        resposta.textualValue,
        resposta.optionsValue,
        resposta.photos,
        resposta.obs);
        
        this.answer.question = resposta.question;
      
        this.respostaAvulsa.answers.push(this.answer);
  
    }

  
  return new Promise(async resolve => {
     await this.vistoriaProvider.salvarVistoriaAvulsa(this.respostaAvulsa, this.user.Token).then((data: any) => {
    
        resolve(data);        
      }).catch((err: any) => {
        resolve(err);
      });
    });

  }



  tirarFoto(perguntaId: string): void {

    

      let buttonLabels = ['Tirar Foto'];

      const options: ActionSheetOptions = {
        title: 'Como gostaria de obter a imagem?',
        subtitle: 'Escolha uma opção',
        buttonLabels: buttonLabels,
        addCancelButtonWithLabel: 'Cancelar',
        // addDestructiveButtonWithLabel: 'Delete',
        // androidTheme: this.actionSheet.ANDROID_THEMES.THEME_HOLO_DARK,
        destructiveButtonLast: true
      };

      this.actionSheet.show(options).then((buttonIndex: number) => {

        this.camera.takePicture(buttonIndex).then((data: string) => {

          //Transformando o retorno em objeto para validar o retorno
          let retorno = JSON.parse(data);

          let loading = this.funcoes.showLoading("Armazenando a foto...");

          if (retorno.status == "true") {

            for (let pergunta of this.perguntas) {
              if (pergunta.id == perguntaId) {

                pergunta.fotosExibir.push(
                  {
                    fotoExibir: this.sanitizer.bypassSecurityTrustUrl(this.win.Ionic.WebView.convertFileSrc(retorno.pathImage)),
                    fotoPath: retorno.pathImage

                  });
              }
            }

            loading.dismiss();
            
          } else {
            loading.dismiss();
            this.funcoes.showAlert(retorno.mensagem);
            
          }

        });

      });

  
  }


  removerFoto(e, foto: FotoObjeto, perguntaId: string) {

    let options: ActionSheetOptions = {
      title: 'Deseja excluir a imagem?',
      buttonLabels: [],
      addCancelButtonWithLabel: 'Cancelar',
      addDestructiveButtonWithLabel: 'Excluir',
      destructiveButtonLast: true
    };

    this.actionSheet.show(options).then((buttonIndex: number) => {

      if (buttonIndex == 1) {
        let loading = this.funcoes.showLoading("Excluindo imagem...");
        let nomeArquivo = foto.fotoPath.replace(/^.*[\\\/]/, '');
        let i = 0;

        for (let pergunta of this.perguntas) {
          if (pergunta.id == perguntaId) {


            for (let fotoArray of pergunta.fotosExibir) {

              if (foto.fotoPath == fotoArray.fotoPath) {

                pergunta.fotosExibir.splice(i, 1);

                this.file.removeFile(cordova.file.dataDirectory, nomeArquivo).then((data: any) => {

                  loading.dismiss();
                }).catch((err: any) => {
                  loading.dismiss();
                  this.funcoes.showAlert("Ocorreu um erro ao excluir a imagem: " + JSON.stringify(err));
                });
              }
              i++;
            }
          }
        }

      }

    });

  }

  public abrirImagem(foto: SafeUrl) {
    let loading = this.funcoes.showLoading("");
    var data = { fotoURL: foto };
    var modalPage = this.modalCtrl.create(ImagemModalPage, data);
    loading.dismiss();
    modalPage.present();
  }

  //Salva a resposta no local storage
  public async salvarOffline(resposta: Resposta) {


    //Cria o array de resposta que será incrementado com cada resposta
    let respostasOff: Resposta[] = [];
    //Busca no local storage se ja existe algum armazenamento de resposta para o usuario logado
    await this.storage.get(this.user.Id).then(async (data: any) => {

      if (data != null) {
        
        //Variavel para verificar se é uma resposta nova
        let respIsNew = true;
        //Seta o array de respostas salvo no local storage  em uma variavel de array de respostas
        respostasOff = data;
     
        //Loop para verificar se a resposta informada é nova
        for (let respOff of respostasOff) {
          if (respOff.questionId == resposta.questionId) {
            respIsNew = false;
          }
        }
        //Caso seja nova inseri no local storage junto com as que ja estavam armazenadas
        if (respIsNew) {
        
          respostasOff.push(resposta);
          await this.storage.set(this.user.Id, respostasOff).then((data: any) => {
          }).catch((err: any) => {
            alert("Ocorreu um erro ao armazenar a resposta:" + JSON.stringify(err));
          });
        }

      } else {        
        //Caso seja a primeira resposta somenta salva no local storage.
        respostasOff.push(resposta);
        await this.storage.set(this.user.Id, respostasOff).then((data: any) => {
        }).catch((err: any) => {
          alert("Ocorreu um erro ao armazenar a resposta :" + JSON.stringify(err));
        });
      }

    });

  }


}
