<script>
    import { toast } from '@zerodevx/svelte-toast';
    import { Form } from "$lib/formBuilder";
    import { onMount } from "svelte";
    import FormBody from '$components/formBody.svelte';
    import { setNumber, sendWhatsapp } from '$lib/sendMessageWhatsapp';


    export let data;


    const formTitle = "Formulário de Serviços de Design";

    const mantainerName = data?.mantainer?.name;
    setNumber(data?.mantainer?.contact);



    const reloadList = () => {     
        formContent = formContent;
    };

    let formContent = Form.Body(        
        Form.Section({ title: formTitle },
            Form.text("Obrigado por escolher nossa equipe de design!<br>Preencha as informações abaixo com o máximo de detalhes possível para que possamos criar algo profissional e alinhado com sua marca."),
            Form.line,
            Form.text("Após finalizar o formulário, toque no botão do Whatsapp no fim da página para entrar em contato com a equipe de design.<br><br>Responderemos o mais rápido possivel."),
        ),    

        Form.Section({ title: "Modo de Leitura", mainSection: false }, 
            Form.darkModeSwitch,
        ),

        Form.Section({ title: "Informações Pessoais", }, 
            Form.line,
            Form.space,
            Form.inputTitle("Sobre o Cliente"),
            Form.mandatory,
            Form.text("Nome do cliente:"),
            Form.input("text", { name: "name",
                
                errors(callback) {
                    if(!this.value || this.value?.length < 3)
                        callback("O nome precisa ter pelo menos 3 letras");

                    if(this.value?.length > 100)
                        callback("O nome é muito longo");
                                
                },
                placeholder: "Digite o nome completo", maxWidth: "260px",
             }),
            Form.line.margin("30px", "block"),
            
            Form.mandatory,
            Form.text("O orçamento é para:"),
            Form.input("select", { name: "serviceFor",
                data: ["single", "mandatory"],
                other: {
                    text: "Para outra pessoa",
                    input: "tel",
                    ignoreInput: true,
                    placeholder: "Contato do terceiro (apenas numeros)",
                    onSelect() {                
                        formContent.getById("serviceFor").other.ignoreInput = false;
                        reloadList();
                    },
                    onDeselect() {
                        formContent.getById("serviceFor").other.ignoreInput = true;
                        reloadList();
                    }
                },
                errors(callback){
                    const selected = this.items.find(item => item.selected);
                    
                    if(selected.type == "other" && (!selected.sendValue || selected.value?.sendValue < 8)) {                
                        callback("Digite o contato do terceiro");
                    }          
                    
                },
                items: [
                    { name: "Para mim mesmo", sendValue: "pessoal" },
                ]
            }).formId("serviceFor"),
            Form.line.margin("30px", "block"),
            
            Form.text("Email para contato:"),
            Form.input("email", { name: "email",
                placeholder: "Digite o email",
                maxWidth: "260px",
                errors(callback) {
                    if(this.value && (this.value?.length < 8 || this.value?.length > 150)) {
                        callback("Digite um email valido");
                    }
                }
            }),
        ),

        Form.Section({ title: "Informações do Projeto" },
            Form.line,
            Form.inputTitle("Sobre o Projeto"),
            Form.mandatory,
            Form.text("Qual serviço deseja:"),
            Form.input("select", { name: "service",
                data: ["mandatory"],
                other: {
                    text: "Outros",
                    input: "textarea",
                    ignoreInput: true,
                    placeholder: "Outros serviços seperados por virgula",
                    onSelect() {
                        formContent.getById("service").other.text = "Outros:";
                        formContent.getById("service").other.ignoreInput = false;
                        reloadList();
                    },
                    onDeselect() {
                        formContent.getById("service").other.text = "Outros";
                        formContent.getById("service").other.ignoreInput = true;
                        reloadList();
                    }
                },
                errors(callback) {
                    const selected = this.items.find(item => item?.selected && item?.type == "other");
                    
                    if(selected && selected?.sendValue && selected?.sendValue?.length < 3) {
                        callback("A descrição para outros serviços precisa ter pelo menos 3 letras");
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
            }).formId("service"),
            Form.line.margin("30px", "block"),
            Form.mandatory,
            Form.text("Qual é o objetivo do projeto:"),
            Form.input("select", { name: "serviceObjective",
                data: ["mandatory", "additional", "mandatory"],
                other: {
                    text: "Outros",
                    input: "textarea",
                    ignoreInput: true,
                    placeholder: "Outros objetivos seperados por virgula",
                    onSelect() {
                        formContent.getById("serviceObjective").other.text = "Outros:";
                        formContent.getById("serviceObjective").other.ignoreInput = false;
                        reloadList();
                    },
                    onDeselect() {
                        formContent.getById("serviceObjective").other.text = "Outros";
                        formContent.getById("serviceObjective").other.ignoreInput = true;
                        reloadList();
                    }
                },
                errors(callback) {
                    const selected = this.items.find(item => item?.selected && item?.type == "other");
                    
                    if(selected && selected?.sendValue && selected?.sendValue?.length < 3) {
                        callback("A descrição para outros objetivos precisa ter pelo menos 3 letras");
                    }
                },
                items: [
                    { name: "Divulgar Produto/Serviços", sendValue: "divulgar produto/serviços" },
                    { name: "Lançamento", sendValue: "lançamento" },
                    { name: "Aumentar Vendas", sendValue: "aumentar vendas" },
                    { name: "Fortalecer Marca", sendValue: "fortalecer marca" },
                    { name: "Tráfego Pago", sendValue: "tráfego pago" },
                ]
            }).formId("serviceObjective"),
            Form.line.margin("30px", "block"),
            
            Form.text("Já possui uma Logomarca / Identidade Visual:"),
            Form.input("select", { name: "hasIdentity", data: ["single"],
                items: [
                    { name: "Sim", sendValue: "sim",
                        onSelect() { formContent.getListById("sendLogo").forEach(e => e.ignore = false); reloadList() },
                        onDeselect() { formContent.getListById("sendLogo").forEach(e => e.ignore = true); reloadList() }
                    },
                    { name: "Parcialmente", sendValue: "parcialmente",
                        onSelect() { formContent.getListById("sendLogo").forEach(e => e.ignore = false); reloadList() },
                        onDeselect() { formContent.getListById("sendLogo").forEach(e => e.ignore = true); reloadList() }
                    },
                    { name: "Nao", sendValue: "nao" },
                ]
            }),

            
            Form.space.config({ ignore: true }).formId("sendLogo"),
            Form.hint("Lembre de enviar os links ou arquivos de sua identidade visual ou ideias após responder o formulário", ["center", "strong"]).config({ ignore: true }).formId("sendLogo"),

            Form.line.margin("30px", "block"),
            Form.mandatory,
            Form.text("Descreva detalhadamente o que você precisa:"),
            Form.input("textarea", { name: "projectDescription",
                errors(callback) {
                    if(!this.value || (this.value?.length < 10 || this.value?.length > 200))
                        callback("A descrição do projeto precisa ter de 10 a 200 letras");
                },
                placeholder: "Descreva detalhadamente o que você precisa. Estilo, tamanho, onde e como usará e etc"
            }),
        ),

        Form.Section({ title: "Informações Adicionais" }, 
            Form.line,
            Form.inputTitle("Mais Detalhes"),
            Form.text("Cores que deseja usar:"),
            Form.hint("Até 5 cores que tenha em mente"),
            Form.hint("Selecione as caixas para trocar seu valor", "center"),
            Form.input("colorList", { name: "colors",
                data: ["addable"],
                max: 5,
            }),
            Form.line.margin("30px", "block"),
            Form.text("Referências, links ou @ de perfis:"),
            Form.input("textarea", { name: "references",
                errors(callback) {
                    if(this.value && (this.value?.length < 5 || this.value?.length > 200))
                        callback("Digite de 5 a 200 letras para as referências");
                },
                placeholder: "Referências, links de vídeo ou @ de perfis que ache interessante para o projeto",
            }),
        ),

        Form.Section({ mainSection: false },
            Form.submit("ENVIAR RESPOSRAS", {
                kind: "whatsapp",
                centered: true,
                onClick: () => formContent.submit(),
            }),
        ),
    );
    

    formContent.atError((input, message, hasErrors) => {
        const toastError = (message, delay = 0) => {
            setTimeout(() => {
                toast.push(`
                <div style="display: flex; align-items: center; gap: 0.5rem">
                    <span>🚫</span>
                    <span>${message}</span>
                </div>`,
                    {
                        duration: 5000,
                        theme: {
                            '--toastBorderRadius': '0 0 10px 10px',
                            '--toastBackground': 'var(--bgColor)',
                            '--toastBarBackground': 'var(--secondColor)'
                        }
                    }
                );
            }, ++delay*150);
        }

        const el = document.querySelector(`[name="${input.name}"]`);

        if(el && !hasErrors) el.scrollIntoView({ behavior: "smooth" });

        let delay = 0;
        toastError(message, ++delay);
    });

    
    
    formContent.onSubmit(form => {
        const values = form.values();
        console.log(values);

        const nameList = {
            name: "Cliente",
            serviceFor: "Serviço para",
            email: "Email",
            service: "Serviço",
            serviceObjective: "Objetivo do serviço",
            hasIdentity: "Possui identidade visual",
            projectDescription: "Descrição do Projeto",
            colors: "Cores",
            references: "Referências",
        }

        const message = values.map(({name, value, type}) => {
            return `> *${nameList[name]}*:\n${
                type == "colorList" ? "- "+(value?.map(c=>"`" + c.value+" - "+c.name + "`")?.join("\n- ") || "`sem informação`") :
                value instanceof Array ? "- "+(value.map(e=>"`" + e + "`").join("\n- ") || "`sem informação`") :
                "`"+ (value || "sem informação") +"`"
            }`;
        }).join("\n\n");


        const fullMessage = `*${mantainerName}*\n_*\`${formTitle}\`*_\n\n${message}`


        console.log(fullMessage);
        sendWhatsapp(fullMessage);
    });
    

    onMount(() => document.body.classList.add("pyVariedades"))
</script>

<svelte:head>
    <title> LHS Form | {data?.mantainer?.name} - {formTitle} </title>
</svelte:head>

<div class="container">
    <FormBody formContent={formContent.sections} />
</div>

<style>
    .container {
        background: var(--bgColor);
        overflow: overlay;
    }
    
    :global(body.pyVariedades:has(#darkModeSwitch:checked)) {
        --bgColor: #fff6ca;
        --mainColor: #ffffff;

        --secondColor: #2563eb;
        --secondColorLighter: #3b82f6;

        --mainDark: #1e293b;
        --secondDark: #1d4ed8;

        --mandatory: #dc2626;
        --error: var(--mandatory);
        --success: #16a34a;
    }

    :global(body.pyVariedades) {
        --bgColor: #312a34;
        --mainColor: #12182a;

        --secondColor: #6c5ce7;
        --secondColorLighter: #8577ff;

        --mainDark: #ffffff;
        --secondDark: #3b36a3;

        --mandatory: #ff4757;
        --error: var(--mandatory);
        --success: #2ed573;
    } 
    
</style>