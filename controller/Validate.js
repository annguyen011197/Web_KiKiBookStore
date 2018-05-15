class Validate {
    constructor() {
        this.url = new RegExp("^(http|https)://", "i")
    }

    checkURL(string){
        return this.url.test(string)
    }
}

module.exports = new Validate()
