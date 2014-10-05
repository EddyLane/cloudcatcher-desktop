class Test {

    constructor(options) {
        this.model = options.model;
        this.template = options.template;
    }

    fuck() {
        return 'ruas';
    }

    shit() {
        return 'yo';
    }

    render() {
        return _.template(this.template, this.model.toObject());
    }
}