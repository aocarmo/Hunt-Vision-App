import { Permissoes } from './permissoes-model';
export class InformacaoUsuario {

    constructor(public Email: string,
                public Name: string,
                public Nickname: string,
                public Permissoes: Permissoes,
                public Phone: string,
                public Role: string,
                ){
    }

    
}