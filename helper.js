class Logging {
    constructor() {
        this.servedActions = 0;
    }

    updateAction() {
        this.servedActions++;
    }

    get servedAction() {
        return this.servedActions;
    }
};
