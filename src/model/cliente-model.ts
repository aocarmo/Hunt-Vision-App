import { Vistoria } from './vistoria-model';

class Logo {
    public height: number;
    public url: string;
    public width: number;
}
export class Cliente {

    constructor(public address?:string,
                public cnpj?: string,
                public contactEmail?: string,
                public deleted?: boolean,
                public emails?: string,
                public id?: string,
                public legalName?:string,
                public logo?: Logo,
                public name?: string,
                public organizationId?: string,
                public phone?: string,
                public stActive?: boolean
                ){
    }

    
}