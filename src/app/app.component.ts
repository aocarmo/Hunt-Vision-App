import { Usuario } from './../model/usuario-model';
import { LoginProvider } from './../providers/login/login';
import { FuncoesProvider } from './../providers/funcoes/funcoes';
import { Component, ViewChild } from "@angular/core";
import { Platform, Nav, Events } from "ionic-angular";
import { Constantes } from './../constantes/constantes';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Keyboard } from '@ionic-native/keyboard';
import { Storage } from '@ionic/storage';
import { HomePage } from "../pages/home/home";
import { LoginPage } from "../pages/login/login";
import { AlterarSenhaPage } from '../pages/alterar-senha/alterar-senha';
import { NetworkProvider } from '../providers/network/network';
import { Network } from '@ionic-native/network';

export interface MenuItem {
    title: string;
    component: any;
    icon: string;
    user: Usuario;
}

@Component({
  templateUrl: 'app.html'
})

export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = LoginPage;

  appMenuItems: Array<MenuItem>;

  user: Usuario = new Usuario(); 
  objUsuario: any;

  constructor(
    public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public keyboard: Keyboard,
    private storage:Storage,
    private funcoesProvider:FuncoesProvider,
    public loginProvider: LoginProvider,
    public networkProvider: NetworkProvider,    
    public events: Events,
    public network: Network,
    

  ) {

       //Verifica fica escutando se existe usuario logado para exibir dados no menu
       this.loginProvider.isLoggedIn().subscribe((data: boolean) => {
       
        if (data) {  
         
          this.storage.get(Constantes.STORAGE_USER).then((data: any) => {
                   
            this.user =data;  
           
            this.appMenuItems = [
              {title: 'Início', component: HomePage, icon: 'home', user:this.user  },
              {title: 'Alterar a senha', component: AlterarSenhaPage, icon: 'key', user:this.user  }
                                         
            ];
  
          });
  
        }
      });
  
      this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {

      this.statusBar.styleDefault();
      if(this.platform.is('android')){
        this.statusBar.overlaysWebView(false);
      }else{
        this.statusBar.overlaysWebView(true);
      }
      

      this.networkProvider.initializeNetworkEvents();

      // Offline event
      this.events.subscribe('network:offline', () => {
          //alert('network:offline ==> '+this.network.type);    
      });

      // Online event
      this.events.subscribe('network:online', () => {
         // alert('network:online ==> '+this.network.type);        
   });
    
      // Okay, so the platform is ready and our plugins are available.

      this.storage.get(Constantes.STORAGE_USER).then((data: any) => {
        //Verifica se existe usuario logado com informações salvas no local storage, caso exista manda para tela inicial
      
        
         if (data != null) {
          this.splashScreen.hide();
        
          //Informa a obeservable que o usuario permanece logado
        
          this.user = data;
          
          if(!this.loginProvider.authenticated(this.user.Token)){
            this.loginProvider.permanecerLogado(true);           
            this.nav.setRoot(HomePage, { 'usuario': this.user });
          }else{     

            this.funcoesProvider.showAlert('Seu login expirou, por favor faça login novamente.');                       
            this.logout();
          }
         } else {
         
           //this.rootPage ='page-login';
           // Okay, so the platform is ready and our plugins are available.
           //*** Control Splash Screen
           // this.splashScreen.show();
           // this.splashScreen.hide();
           //*** Control Status Bar
           this.splashScreen.hide();
         
         
            //*** Control Keyboard
          //this.keyboard.disableScroll(true);
 
         }
 
       });
 
    });
  }

  openPage(page, usuario:Usuario) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component,{'usuario': page.user});
  }

 

 async logout() {

    this.loginProvider.doLogout().then(async data => {
      await this.storage.clear();
      this.nav.setRoot(LoginPage);
    }).catch((err:any)=>{
      this.funcoesProvider.showAlert("Ocorreu um erro ao fazer o logoff" + JSON.stringify(err));
   });

  }

}
