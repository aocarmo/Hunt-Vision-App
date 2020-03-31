import { Cliente } from './cliente-model';


class Agent {
     public name: string;
}
class Data {
    public date: string;
    public timezone_type: number;
    public timezone: string;
}
export class Vistoria {

    constructor(public inspectionId?:string, 
                public date?: Data,
                public name?: string,
                public agent?: Agent,
                public status?: string,
                public inspectionInstanceId?: string,
                public clientId?: string
                ){
    }

    
}