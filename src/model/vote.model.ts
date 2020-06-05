export class Vote {
    class: string;
    weight: number;

    constructor(params?: Vote) {
        Object.assign(this, params);
    }
}
