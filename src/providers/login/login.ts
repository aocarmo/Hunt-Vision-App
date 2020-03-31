import { Storage } from '@ionic/storage';
import { Injectable, resolveForwardRef } from '@angular/core';
import { Constantes } from './../../constantes/constantes';
import 'rxjs/add/operator/map';
import { HttpHeaders ,HttpClient} from '@angular/common/http';
import { Usuario } from '../../model/usuario-model';
import { Observable, Subject } from 'rxjs';
import {JwtHelper} from "angular2-jwt";

/*
  Generated class for the LoginProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class LoginProvider {

  private logger = new Subject<boolean>();
  loggedIn: boolean;
  public usuario : Usuario;
  jwtHelper = new JwtHelper();
  private token: string = null;

  constructor(public http: HttpClient,
              public storage: Storage) {
    console.log('Hello LoginProvider Provider');
  }

  doLogin(usuario: string, senha:string)  {

    const httpOptions = {
      headers: new HttpHeaders({
       'Content-Type':  'application/json'   
      })
    };    

    let jsonLogin =  {
      "login": usuario,
      "senha": senha
    }
    
    return new Promise(resolve => {

      this.http.post(Constantes.API_LOGIN,jsonLogin,httpOptions).timeout(Constantes.TIMEOUT_RESQUEST).subscribe(async(data:any) => {
      
     
       if(data.status){     
        await  this.authSuccess(data.token);
        this.usuario = new Usuario(data.token,data.dados.id,data.dados.nome,data.dados.login,data.dados.isAdmin,data.dados.avatar,data.dados.info,data.dados.organizationId);
        this.storage.set("usuario", this.usuario).then((data:any)=>{
                    
          this.loggedIn = true;
          this.logger.next(this.loggedIn);    
          
      
        }).catch((err:any)=>{
          alert("Ocorreu um erro ao salvar o usuário:" + JSON.stringify(err));
        });
      }

        resolve(data);
             
      }, err => {
      
        resolve(err);
     
       
      });
    });
  }

  isLoggedIn(): Observable<boolean> {
    return this.logger.asObservable();
  }



  permanecerLogado(condicao: boolean){
    this.loggedIn = condicao;
    this.logger.next(this.loggedIn);    
  }

  doLogout(): Promise<void>{
    return this.storage.remove(Constantes.STORAGE_USER).then(async data =>{    
      await this.storage.remove(Constantes.STORAGE_TOKEN);
      this.loggedIn = false;
      this.logger.next(this.loggedIn);
    });   
    
  }

  alterarSenha(idUsuario:string, senhaAtual: string, novaSenha:string, token: string) {

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      })
    };
    
    let jsonAlterarSenha =  {
      "idUsuario": idUsuario,
      "senhaAtual": senhaAtual,
      "novaSenha": novaSenha
    }

    return new Promise(resolve => {

      this.http.post(Constantes.ALTERAR_SENHA, jsonAlterarSenha, httpOptions).timeout(Constantes.TIMEOUT_RESQUEST).subscribe((data: any) => {


        resolve(data);

      }, err => {
        
        resolve(err);


      });
    });
  }

  redefinirSenha(email: string) {
    const httpOptions = {
      headers: new HttpHeaders({
       'Content-Type':  'application/json'   
      })
    };   
    return new Promise(resolve => {

      this.http.get(Constantes.REDEFINIR_SENHA + '?email=' + email,httpOptions).timeout(Constantes.TIMEOUT_RESQUEST).subscribe((data: any) => {

        resolve(data);

      }, err => {
        resolve(err);

      });
    });
  }

  public async authSuccess(token) {
    
    this.token = token;
    await this.storage.set(Constantes.STORAGE_TOKEN, token);
    this.usuario = this.jwtHelper.decodeToken(token); 
    await this.storage.set(Constantes.STORAGE_USER, this.usuario);

  }

  authenticated(token:string) {
  
      return this.jwtHelper.isTokenExpired(token);
    
  }

  getToken() {
    return this.token;
  }

}
