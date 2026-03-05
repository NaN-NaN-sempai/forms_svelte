import { browser } from '$app/environment';

let defaultNumber = "5574981395580";

export function setNumber(number) {
    if(!number) return;
    defaultNumber = number.replace(/[^0-9]/g, '');    
}

export function getNumber() {
	if (!browser) return defaultNumber;

	const url = window.location.href;

    if (url.includes('?')) {
        const params = new URLSearchParams(window.location.search);

        if (params.has('whatsapp') && params.get('whatsapp').length >= 8) {
            return params.get('whatsapp');
        }
    }

	return defaultNumber;
}

export function sendWhatsapp(mensagem) {
	if (!browser) return;

	const linkWhatsApp =
		'https://api.whatsapp.com/send?phone=' +
		getNumber() +
		'&text=' +
		encodeURIComponent(mensagem);

	window.open(linkWhatsApp, '_blank');
}