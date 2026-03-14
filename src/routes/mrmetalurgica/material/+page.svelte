<script>
    import { toast } from '@zerodevx/svelte-toast';
    import { Form } from "$lib/formBuilder";
    import { onMount } from "svelte";
    import FormBody from '$components/formBody.svelte';
    import { setNumber, sendWhatsapp } from '$lib/sendMessageWhatsapp';


    export let data;


    const formTitle = "Formulário de Materiais";

    const mantainerName = data?.mantainer?.name;
    setNumber(data?.mantainer?.contact);


    import banner from "./assets/banner.png";
    const reloadList = () => {     
        formContent = formContent;
    };

    let formContent = Form.Body(
        Form.Section({},
            Form.banner(banner, { alt: "MR Metalurgica" }),
            Form.space.margin("50px", "block"),
            Form.sectionTitle(formTitle),
            Form.text("Obrigado por escolher a MR Metalurgica para criar o seu projeto!<br><br>Preencha as informações abaixo com o máximo de detalhes possível para que possamos criar um projeto profissional e alinhado com o que você precisa."),
            Form.line,
            Form.text("Após finalizar o formulário, toque no botão do Whatsapp no fim da página para entrar em contato com nossa equipe.<br><br>Responderemos o mais rápido possivel."),
        ),    

        Form.Section({ title: "Modo de Leitura", mainSection: false }, 
            Form.darkModeSwitch,
        ),

        Form.Section({ title: "Informações Pessoais", }, 
            Form.line,
            Form.space,
            
            Form.inputTitle("Destinatário"),
            Form.mandatory,
            Form.text("O orçamento é para:"),
            Form.hint(`Entraremos em contato com o número inserido para elaborar o projeto.<br>Caso queira que tratemos diretamente com você, escolha "Para mim mesmo".`, "center").config({ignore: true}).formId("serviceForHint"),
            Form.input("select", { name: "serviceFor",
                data: ["single", "mandatory"],
                other: {
                    text: "Para outra pessoa",
                    input: "tel",
                    ignoreInput: true,
                    placeholder: "Contato do terceiro (apenas numeros)",
                    onSelect() {                
                        formContent.getById("serviceFor").other.ignoreInput = false;
                        formContent.getById("serviceForHint").ignore = false;
                        reloadList();
                    },
                    onDeselect() {
                        formContent.getById("serviceFor").other.ignoreInput = true;
                        formContent.getById("serviceForHint").ignore = true;
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
            Form.space.margin("50px", "block"),

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
            Form.space,
            
            Form.mandatory,
            Form.text("Endereço:"),
            Form.hint("Para tirarmos medidas (caso necessário) ou entregar o projeto", "center"),
            Form.input("textarea", { name: "address",
                errors(callback) {
                    if(!this.value || this.value?.length < 3)
                        callback("O endereço precisa ter pelo menos 3 letras");

                    if(this.value?.length > 300)
                        callback("O endereço é muito longo");
                                
                },
                placeholder: "Digite o endereço completo",
             }),
            Form.space.margin("50px", "block"),
            
            Form.inputTitle("Contato Alternativo"),
            Form.text("Email para contato:"),
            Form.hint("Para caso não seja possivel entrar em contato pelo Whatsapp ou ligações"),
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
            Form.text("Material para prateleiras:"),
            Form.input("select", { name: "shelfMaterial",
                data: ["mandatory", "block", "single"],
                errors(callback) {},
                other: {
                    text: "Meu projeto não precisa de prateleiras",
                    sendValue: "sem prateleiras",
                    img: banner,
                },
                items: [
                    { name: "MDF Madeirado", sendValue: "madeirado",
                        img: banner,
                        desc: "Custo base",
                    },
                    { name: "MDF Branco", sendValue: "mdf branco",
                        img: banner,
                        desc: "≈ 38% mais barato",
                    },
                    { name: "Madeira", sendValue: "madeira",
                        img: banner,
                        desc: "≈ 96% mais caro",
                    },
                    { name: "Vidro Temperado", sendValue: "vidro",
                        img: banner,
                        desc: "≈ 113% mais caro",
                    },
                    { name: "Acrílico", sendValue: "acrilico",
                        img: banner,
                        desc: "≈ 150% mais barato",
                    },
                    { name: "Tela Moeda", sendValue: "tela moeda",
                        img: banner,
                        desc: "≈ 79% mais barato<br>+ durabilidade",
                    },
                    { name: "Tela Treliça", sendValue: "tela trelica",
                        img: banner,
                        desc: "≈ 189% mais barato<br>- durabilidade",
                    },
                ]
            }),
            Form.line.margin("30px", "block"),
            Form.mandatory,
            Form.text("Tinta para a parte metalica:"),
            Form.input("select", { name: "ink",
                data: ["mandatory", "block", "single"],
                errors(callback) {},
                items: [
                    { name: "tipo1", sendValue: "tipo1",
                        img: banner,
                        desc: "Custo base",
                    },
                ]
            }),
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
        --bgColor: #fff1d4;
        --mainColor: #ffffff;

        --secondColor: #dbae54;
        --secondColorLighter: #e5b658;

        --mainDark: #6a6a6a;
        --secondDark: #c78f20;

        --mandatory: #dc2626;
        --error: var(--mandatory);
        --success: #16a34a;
    }

    :global(body.pyVariedades) {
        --bgColor: #202020;
        --mainColor: #343434;

        --secondColor: #dbae54;
        --secondColorLighter: #e5b658;

        --mainDark: #ffffff;
        --secondDark: #3b36a3;

        --mandatory: #ff4757;
        --error: var(--mandatory);
        --success: #2ed573;
    } 
    
</style>