export class FormList {
    constructor(...sections) {
        this.sections = sections;

        this._atError = () => { };
        this._submit = () => { };
        this._anySubmit = () => { };
        this._invalidSubmit = () => { };
    }

    getById(id) {
        return this.flatMap().find(f => f.formId == id);
    }

    getListById(id) {
        return this.flatMap().filter(f => f.formId == id);
    }

    atError(atError = () => { }) {
        this._atError = atError;
    }

    onSubmit(submit = () => { }) {
        this._submit = submit;
    }

    onAnySubmit(submit = () => { }) {
        this._anySubmit = submit;
    }

    onInvalid(invalid = () => { }) {
        this._invalidSubmit = invalid;
    }

    submit() {
        let hasErrors = false;

        const executeError = (input, message) => {
            this._atError(input, message, hasErrors);

            hasErrors = true;
        }

        this.inputs().forEach((e) => {
            e.errors?.((message) => executeError(e, message));
            e._errors?.((message) => executeError(e, message));
        })

        this._anySubmit(this);

        if (hasErrors) return this._invalidSubmit(this);

        this._submit(this);
    }

    flatMap() {
        return this.sections.flatMap(f => f.children);
    };

    inputs() {
        const list = this.flatMap();

        return list.filter(f => f.type == "input");
    }

    values() {
        return this.inputs().map(input => {
            let value = input.value;

            if(input.inputType == "select") {                
                value = input.items.filter(({selected}) => selected).map(e=>e.sendValue);

            } else if (input.inputType == "colorList") {
                value = input.list;
            }

            return {
                name: input.name,
                value: value,
            }
        })
    }
}
export class Section {
    constructor(config = {}, ...children) {
        const defaultConfig = {
            mainSection: true
        }

        config = Object.assign(defaultConfig, config);

        Object.assign(this, config);

        this.children = children;

    }
}
export class Form {
    constructor(type) {
        this.type = type;
        this.disabled = false;
        this.readonly = false;
        if (type == "hr" || type == "br") {
            this.marginSize = "20px";
            this.marginType = "block";

            this.margin = (size = "20px", type = "block") => {
                this.marginSize = size;
                this.marginType = type;

                return this;
            }
        }
    }

    formId(id) {
        this.formId = id;
        return this;
    }

    static List = (...sections) => new FormList(...sections);

    config = (obj) => {
        Object.assign(this, obj);

        return this;
    }

    static Section = (...ags) => new Section(...ags);

    static sectionTitle = (text) => {
        let inst = new this("section title");
        inst.text = text;

        return inst;
    }

    static inputTitle = (text) => {
        let inst = new this("input title");
        inst.text = text;

        return inst;
    }

    static text = (text, config = []) => {
        let inst = new this("text");
        inst.text = text;

        inst.textConfig = config;

        return inst;
    }

    static hint = (text, config = []) => {
        let inst = new this("hint");
        inst.text = text;

        inst.textConfig = config;

        return inst;
    }

    static submit = (text, config = { onClick() { } }) => {
        let inst = new this("submit");
        inst.text = text;

        inst.config = config;

        return inst;
    }

    static get line() {
        return new this("hr");
    }

    static get space() {
        return new this("br");
    }

    static get darkModeSwitch() {
        return new this("darkModeSwitch");
    }


    static input = (type = "text", config = {}) => {
        if (!type)
            throw new Error("type is required");

        const defaultConfig = {
            disabled: false,
            readonly: false,
            ignore: false,
        }

        config = Object.assign(defaultConfig, config);

        let inst = new this("input");

        inst.inputType = type;

        const transfer = (...keyList) => {
            for (const key of keyList) {
                if (config[key] != undefined) {
                    inst[key] = config[key];

                } else if (key.includes(" ~> ")) {
                    const [to, from] = key.split(" ~> ");
                }
            }
        }

        config.source = inst;

        transfer("name", "data", "readonly", "disabled", "selected", "ignore", "source", "errors")

        if (type == "select") {
            transfer("other", "items", "number");

        } else if (["textarea", "text", "number", "email", "password", "tel", "color", "colorList"].includes(type)) {
            transfer("placeholder", "value", "onInput", "minified", "pattern", "maxWidth", "list", "max", "min", "step");
        }

        if (type == "colorList")
            inst.list = inst.list || [];

        if (type == "email") {
            inst._errors = function (callback) {
                const isValidEmail = (email) =>
                    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);


                if (this.value && !isValidEmail(this.value))
                    callback("O email inserido é inválido");
            }
        }

        return inst;
    }

    static get mandatory() {
        return new this("mandatory");
    }

}

if (import.meta.hot) {
    import.meta.hot.dispose(() => {
        Form.list = [];
    });
}