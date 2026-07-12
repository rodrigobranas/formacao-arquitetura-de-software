export default class Name {
    private value: string;

    constructor (name: string) {
        if (!name || !name.match(/[a-zA-ZàáâãäçéêëíîïóôõöúûüÀÁÂÃÄÇÉÊËÍÎÏÓÔÕÖÚÛÜ]+ [a-zA-ZàáâãäçéêëíîïóôõöúûüÀÁÂÃÄÇÉÊËÍÎÏÓÔÕÖÚÛÜ]+/)) throw new Error("Invalid name");
        this.value = name;
    }

    getValue () {
        return this.value;
    }

}
