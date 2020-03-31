import { InformacaoUsuario } from "./informacao-usuario-model";
class Avatar {
    public height: number;
    public url: string;
    public width: number;
}

export class Usuario {

    constructor(public Token?:string, 
                public Id?: string,
                public Nome?: string,     
                public Login?:string,
                public IsAdmin?: boolean,
                public Avatar?: Avatar,
                public Info?: InformacaoUsuario,
                public OrganizationId?: string
                ){
    }

    
}