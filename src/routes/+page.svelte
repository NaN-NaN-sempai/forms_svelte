<script>
    import { form } from "$app/server";
    import { text } from "@sveltejs/kit";
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

            transfer("name", "data", "readonly", "disabled", "selected", "ignore")

            if(type == "select") {
                transfer("other", "items", "number");

            } else if(["textarea", "text", "number", "email", "password", "tel"].includes(type)) {
                transfer("placeholder", "value", "onInput", "minified", "pattern", "maxWidth");
            }
            
            return inst;
        }

        static get mandatory() {
            return new this("mandatory");
        }

    }

    const sendLogo = [
        Form.space.config({ ignore: true }),
        Form.text("Lembre de enviar os links ou arquivos de sua identidade visual ou ideias após responder o formulário", ["center", "strong"]).config({ ignore: true }),
    ]
    
    const serviceForInput = Form.input("select", { name: "serviceFor",
        data: ["single", "mandatory"],
        other: {
            text: "Para outra pessoa",
            input: "tel",
            ignoreInput: true,
            placeholder: "Contato do terceiro",
            onSelect() {
                serviceForInput.other.ignoreInput = false;
                formContent = formContent;
            },
            onDeselect() {
                serviceForInput.other.ignoreInput = true;
                formContent = formContent;
            }
        },
        items: [
            { name: "Para mim mesmo", sendValue: "pessoal" },
        ]
    });

    const serviceInput = Form.input("select", { name: "service",
        data: ["mandatory"],
        other: {
            text: "Outros",
            input: "textarea",
            ignoreInput: true,
            placeholder: "Outros serviços seperados por virgula",
            onSelect() {
                serviceInput.other.text = "Outros:";
                serviceInput.other.ignoreInput = false;
                formContent = formContent;
            },
            onDeselect() {
                serviceInput.other.text = "Outros";
                serviceInput.other.ignoreInput = true;
                formContent = formContent;
            }
        },
        items: [
            { name: "Logomarca", sendValue: "logo" },
            { name: "Identidade Visual", sendValue: "identidade visual" },
            { name: "Painéis para Rede Sociais", sendValue: "painéis rede social" },
            { name: "Artes para Stories", sendValue: "stories" },
            { name: "Ilustrações", sendValue: "ilustrações" },
            { name: "Animações", sendValue: "animações" },
            { name: "Design para Site / Landing Page", sendValue: "site" },
            { name: "Edição de Imagem", sendValue: "edição imagem" },
            { name: "Edição de Video", sendValue: "edição video" },
        ]
    });

    let formContent = [        
        Form.Section({ title: "Formulário de Serviços de Design" }, 
            Form.text("Obrigado por escolher nossa equipe de design!<br>Preencha as informações abaixo com o máximo de detalhes possível para que possamos criar algo profissional e alinhado com sua marca."),
            Form.line,
            Form.text("Após finalizar o formulário, toque no botão do Whatsapp no fim da página para entrar em contato com a equipe de design.<br><br>Responderemos o mais rápido possivel."),
        ),    

        Form.Section({ title: "Modo de Leitura" }, 
            Form.darkModeSwitch,
        ),

        Form.Section({ title: "Informações Pessoais", }, 
            Form.line,
            Form.space,
            Form.inputTitle("Sobre o Cliente"),
            Form.mandatory,
            Form.text("Nome do cliente:"),
            Form.input("text", { name: "name", placeholder: "Digite o nome completo", maxWidth: "260px" }),
            Form.line.margin("30px", "block"),
            Form.mandatory,
            Form.text("O orçamento é para:"),
            serviceForInput,
            Form.line.margin("30px", "block"),
            Form.text("Email para contato:"),
            Form.input("email", { name: "email", placeholder: "Digite o email", maxWidth: "260px"  }),
        ),

        Form.Section({ title: "Informações do Projeto" },
            Form.line,
            Form.inputTitle("Sobre o Projeto"),
            Form.mandatory,
            Form.text("Qual serviço deseja:"),
            serviceInput,
            Form.line.margin("30px", "block"),
            Form.mandatory,
            Form.text("Qual é o objetivo do projeto:"),
            Form.input("select", { name: "serviceObjective",
                data: ["mandatory", "additional", "mandatory"],
                other: {
                    text: "Outros",
                },
                items: [
                    { name: "Divulgar Produto/Serviços", sendValue: "divulgar produto/serviços" },
                    { name: "Lançamento", sendValue: "lançamento" },
                    { name: "Aumentar Vendas", sendValue: "aumentar vendas" },
                    { name: "Fortalecer Marca", sendValue: "fortalecer marca" },
                    { name: "Tráfego Pago", sendValue: "tráfego pago" },
                ]
            }),
            Form.line.margin("30px", "block"),
            
            Form.text("Já possui uma Logomarca / Identidade Visual:"),
            Form.input("select", { name: "hasIdentity", data: ["single"],
                items: [
                    { name: "Sim", sendValue: "sim",
                        onSelect() { sendLogo.forEach(e => e.ignore = false); formContent = formContent },
                        onDeselect() { sendLogo.forEach(e => e.ignore = true); formContent = formContent }
                    },
                    { name: "Nao", sendValue: "nao" },
                    { name: "Parcialmente", sendValue: "Parcialmente",
                        onSelect() { sendLogo.forEach(e => e.ignore = false); formContent = formContent },
                        onDeselect() { sendLogo.forEach(e => e.ignore = true); formContent = formContent }
                    },
                ]
            }),

            ...sendLogo,

            Form.line.margin("30px", "block"),
            Form.mandatory,
            Form.text("Descreva detalhadamente o que você precisa:"),
            Form.input("textarea", { name: "projectDescription", placeholder: "Descreva detalhadamente o que você precisa. Estilo, tamanho, onde e como usará e etc" }),
        ),

        Form.Section({ title: "Informações Adicionais" }, 
            Form.line,
            Form.inputTitle("Mais Detalhes"),
            Form.text("Cores que deseja usar:"),
            Form.input("textarea", { name: "colors", placeholder: "Cores, temas, paletas e gradientes que tenha em mente" }),
            Form.line.margin("30px", "block"),
            Form.text("Referências, links ou @ de perfis:"),
            Form.input("textarea", { name: "references", placeholder: "Referências, links de vídeo ou @ de perfis que ache interessante para o projeto" }),

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