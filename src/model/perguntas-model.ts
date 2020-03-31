import { Answer } from './answer';
import { Resposta } from './resposta-model';
import { SafeUrl } from '@angular/platform-browser';

class Options {
    public conformant: boolean;
    public infoIfNotConformant: string;
    public text: string;
}

class FotoObjeto {
    fotoExibir: SafeUrl;
    fotoPath: string;
  }
export class Perguntas {
    public resposta?: any;   
    public fotosExibir: FotoObjeto[];   
    constructor(public answer?: Answer,
                public askForObs?: boolean, 
                public askForPhotos?: boolean,      
                public id?: string,
                public options?: Options[],
                public text?: string, 
                public type?: string,            
              
                ){
                    
     }



    
}