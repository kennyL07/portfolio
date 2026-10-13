export function setupHeader(header: HTMLElement): void {
    const barInner = document.createElement('div');
    barInner.className = 'wrap bar-inner';
    header.appendChild(barInner);

    const logoPill = document.createElement('div');
    logoPill.className = 'pill logo';
    const name = document.createElement('span');
    name.textContent = 'Kennyson Le';
    logoPill.appendChild(name);
    barInner.appendChild(logoPill);
    
}