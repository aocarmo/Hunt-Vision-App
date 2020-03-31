import { Perguntas } from './perguntas-model';

export class Objeto {
    public qtdFotos: number;
    public qtdRespostas: number;
    constructor( public address?: string,
                public clientId?: string,     
                public deleted?: boolean,
                public environmentId?:string, 
                public id?: string,
                public location?: string,     
                public name?:string, 
                public num?: number,
                public questions?: Perguntas[] 

                ){

              
    }

    
}