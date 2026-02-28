<script>
    import { form } from "$app/server";
    import FormBody from "../components/formBody.svelte";

    class Section {
        constructor(config  = {}, ...children) {
            const defaultConfig = {
                mainSection: true
            }

            config = Object.assign(defaultConfig, config);

            Object.assign(this, config);

            console.log(config, children);
            
            this.children = children;
            
        }
    }
    class Form {
        constructor(type) {
            this.type = type;
            this.disabled = false;
            this.readonly = false;

            if(type == "hr" || type == "br") {
                this.marginSize = "20px";
                this.marginType = "block";
                
                this.margin = (size = "20px", type = "block") => {
                    this.marginSize = size;
                    this.marginType = type;

                    return this;
                }
            }
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

        static text = (text) => {
            let inst = new this("text");
            inst.text = text;

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
            if(!type) 
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
                for(const key of keyList) {
                    if(config[key] != undefined) {                    
                        inst[key] = config[key];
                        
                    } else if(key.includes(" ~> ")) {
                        const [to, from] = key.split(" ~> ");

                        console.log(from, config, config[from]);
                        

                        if(config[from] != undefined){
                            console.log("exists", config[from]);
                            
                        }
                    }
                }
            }

            transfer("name", "data", "readonly", "disabled", "ignore")

            if(type == "select") {
                transfer("other", "items", "number");

            } else if(["textarea", "text", "number"].includes(type)) {
                transfer("placeholder", "value", "onInput");
            }
            
            return inst;
        }

        static get mandatory() {
            return new this("mandatory");
        }

    }



    const formContent = [        
        Form.Section({ title: "Formulário" }, 
            Form.text("Marque as opções que você deseja e toque no botão do Whatsapp no final da página."),
        ),    

        Form.Section({ title: "Modo de Leitura", mainSection: false }, 
            Form.darkModeSwitch,
        ),

        Form.Section({ title: "Informações da Capa", }, 
            Form.line,
            Form.space,
            Form.input("textarea", { name: "myText", placeholder: "Nome" }),
            Form.inputTitle("Acabamentos"),
            Form.mandatory,
            Form.text("Informe a laminação da capa e contracapa:"),
            Form.input("select", { data: ["block" , "mandatory", "additional"],
                name: "acabamento",
                ignore: true,
                items: [{
                    name: "Brilho Comum",
                    img: "https://luishenrique.space/forms/acabamentos/assets/Images/acabamentos/brilhoComum.jpg",
                    desc: "(Gratuito)",

                    sendValue: "Brilho Comum",
                    
                    favorite: false,
                    selected: true,
                },

                {
                    name: "Fosco Comum",
                    sendValue: "Fosco Comum",
                    img: "https://luishenrique.space/forms/acabamentos/assets/Images/acabamentos/fosco.jpg",
                    desc: "(Gratuito)",
                    favorite: false,
                },

                {
                    name: "Brilho Especial HI-TAC",
                    sendValue: "Brilho HI-TAC",
                    img: "https://luishenrique.space/forms/acabamentos/assets/Images/acabamentos/brilhoComumHITAC.jpg",
                    desc: "(R$ 6.00)",
                    favorite: false,

                    onSelect: () => {
                        console.log("onSelect");
                    },
                    onDeselect: () => {
                        console.log("onDeselect");
                    }
                }]
            }),
            Form.input("select", { data: ["mandatory",  "additional"],
                name: "acabamento",
                other: {
                    text: "Outro",
                    input: "text",
                    placeholder: "Digite aqui"

                },
                items: [{
                    name: "Brilho Comum",
                    desc: "(Gratuito)",

                    sendValue: "Brilho Comum",
                    
                    favorite: false,
                    selected: true,
                },

                {
                    name: "Fosco Comum",
                    sendValue: "Fosco Comum",
                    desc: "(Gratuito)",
                    favorite: false,
                },

                {
                    name: "Brilho Especial HI-TAC",
                    sendValue: "Brilho HI-TAC",
                    desc: "(R$ 6.00)",
                    favorite: false,

                    onSelect: () => {
                        console.log("onSelect");
                    },
                    onDeselect: () => {
                        console.log("onDeselect");
                    }
                }]
            }),
        ),

        Form.Section({title: "Adicionais"}, 
        
            Form.input("select", { data: ["block", "single", "additional"],
                name: "destaque",
                items: [
                    {
                        name: "Bolso Canguru",
                        sendValue: "Bolso Canguru",
                        img: "https://luishenrique.space/forms/acabamentos/assets/Images/adicionais/bolso/bolso.jpg",
                        desc: "(Gratuito)",
                        favorite: false,
                    },
                    {
                        name: "Folha de Fotos",
                        sendValue: "Folha de Fotos",
                        img: "https://luishenrique.space/forms/acabamentos/assets/Images/adicionais/bolso/fotos.jpg",
                        desc: "(R$ 7.00)",
                        favorite: false,
                    },
                    {
                        name: "Os Dois<br>(Usamos um arame diferente)",
                        sendValue: "Folha de Fotos",
                        img: "https://luishenrique.space/forms/acabamentos/assets/Images/adicionais/bolso/bolsoEFoto.png",
                        desc: "(R$ 14.00)",
                        favorite: false,
                    },
                ]
            }),

            Form.line.margin("50px"),
            Form.inputTitle("Elásticos"),
            Form.text("Essas são as opções de Elásticos que temos:"),
            Form.space,
            Form.text('<span>As opções com <span class="favorite"></span> são as favoritas dos nossos clientes!</span>'),
            Form.input("select", { data: ["block", "single", "additional"],
                name: "elastico",
                items: [
                    {
                        name: "Preto ou Branco",
                        sendValue: "Folha de Fotos",
                        img: "https://luishenrique.space/forms/acabamentos/assets/Images/adicionais/elastico/pretoOuBranco.gif",
                        desc: "(R$ 12.00)",
                        favorite: true,
                    }
                ]
            }),
        ),


    ];
    
</script>

<div class="container">
    <FormBody {formContent} />
</div>

<style>
    .container {
        background: var(--bgColor);
        overflow: overlay;
    }
</style>