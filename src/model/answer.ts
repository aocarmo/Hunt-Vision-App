

class Image {
    url: string;
    width: number;
    height: number;
}

export class Answer {
    public question?: any;
    constructor(
                public date?: Date,
                public numericValue?: number,
                public textualValue?: string,
                public optionsValue?: boolean[],
                public photos?: Image[],
                public obs?: string       
                ){
    }

    
}