import { Answer } from './answer';


class Options {
    public conformant?: boolean;
    public infoIfNotConformant?: string;
    public text?: string;
}

class Question {

    public answer?: Answer;
    public askForObs?: boolean;
    public askForPhotos?: boolean;
    public id?: string;
    public options?: Options[];
    public text?: string;
    public type?: string   
}

class Image {
    url: string;
    width: number;
    height: number;
}



export class Resposta {
    public question?: Question;
    constructor(public agentId?: string,
                public clientId?: string,
                public date?: Date,
                public id?:string,   
                public inspectionId?: string,
                public inspectionInstanceId?: string,
                public numericValue?: number,
                public objectId?:string, 
                public obs?:string,   
                public optionsValue?: boolean[],
                public photos?: Image[],
               // public question?: Question,
                public questionId?:string,     
                public textualValue?: string

                ){
    }

    
}