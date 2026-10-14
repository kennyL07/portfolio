import { setupLogo } from './logo.ts';

export function setupHeader(header: HTMLElement): () => void {
    const barInner = document.createElement('div');
    barInner.className = 'wrap bar-inner';
    header.appendChild(barInner);

    const logoPill = document.createElement('a');
    logoPill.className = 'pill logo';
    logoPill.href = "index.html"
    const logoMark = document.createElement('span');
    logoMark.className = 'logo-mark';
    logoMark.setAttribute('aria-hidden', 'true');
    logoPill.appendChild(logoMark);
    const name = document.createElement('span');
    name.textContent = 'k3nny.dev';
    logoPill.appendChild(name);
    barInner.appendChild(logoPill);

    const stopLogoAnimation = setupLogo(logoMark);
    return () => {
        stopLogoAnimation();
        barInner.remove();
    };
}
