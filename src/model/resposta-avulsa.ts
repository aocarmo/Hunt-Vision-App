
class Option {
    public conformant: boolean;
    public infoIfNotConformant: string;
    public text: string;
}

class Question {   
    askForObs?: boolean;
    askForPhotos?: boolean;
    id?: string;
    options?: Option[];
    text?: string;
    type?: string;          
  
        
}

class Image {
    url: string;
    width: number;
    height: number;
}

class Answer {
    id?: string;
    numericValue?: number;
    obs?: string;
    optionsValue?: boolean[];
    photos?: Image[];
    questionId?: string;    
    textualValue?: string;
    question?: Question;
                       

    }


export class RespostaAvulsa {
    
    public agentId: string;
    public objectId: string;
    public date: string;
    public answers: Answer[];

        


}