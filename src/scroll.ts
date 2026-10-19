export function setupScrollBar(element: HTMLElement): () => void {
    const track = element.querySelector<HTMLElement>('.scrollbar-track');
    const pill = track?.querySelector<HTMLElement>('.scrollbar-pill');
    if (!track || !pill) return () => {};

    const page = document.scrollingElement ?? document.documentElement;
    let frame = 0;
    let pointerId: number | null = null;
    let dragOffset = 0;
    let thumbHeight = 0;
    let travel = 0;
    let maxScroll = 0;

    const update = () => {
        frame = 0;
        const viewportHeight = document.documentElement.clientHeight;
        maxScroll = Math.max(0, page.scrollHeight - viewportHeight);
        track.hidden = maxScroll === 0;
        if (track.hidden) return;

        const trackHeight = track.clientHeight;
        thumbHeight = Math.min(trackHeight, Math.max(32, trackHeight * viewportHeight / page.scrollHeight));
        travel = trackHeight - thumbHeight;
        const scrollTop = Math.max(0, Math.min(maxScroll, page.scrollTop));
        pill.style.height = `${thumbHeight}px`;
        pill.style.transform = `translateY(${scrollTop / maxScroll * travel}px)`;
        track.setAttribute('aria-valuemax', String(maxScroll));
        track.setAttribute('aria-valuenow', String(Math.round(scrollTop)));
    };

    const scheduleUpdate = () => {
        if (!frame) frame = requestAnimationFrame(update);
    };

    const scrollTo = (top: number) => {
        // Follow pointer and keyboard input immediately, even with smooth scrolling enabled.
        window.scrollTo({ top: Math.max(0, Math.min(maxScroll, top)), behavior: 'instant' });
        scheduleUpdate();
    };

    const moveThumb = (clientY: number) => {
        if (travel <= 0) return;
        const top = clientY - track.getBoundingClientRect().top - dragOffset;
        scrollTo(top / travel * maxScroll);
    };

    const onPointerDown = (event: PointerEvent) => {
        if (!event.isPrimary || event.button !== 0 || pointerId !== null) return;
        update();
        if (track.hidden) return;
        event.preventDefault();
        track.focus({ preventScroll: true });
        dragOffset = event.target === pill
            ? event.clientY - pill.getBoundingClientRect().top
            : thumbHeight / 2;
        pointerId = event.pointerId;
        track.setPointerCapture(pointerId);
        track.classList.add('is-dragging');
        moveThumb(event.clientY);
    };

    const onPointerMove = (event: PointerEvent) => {
        if (event.pointerId === pointerId) moveThumb(event.clientY);
    };

    const stopDragging = () => {
        const activePointer = pointerId;
        pointerId = null;
        track.classList.remove('is-dragging');
        if (activePointer !== null && track.hasPointerCapture(activePointer)) {
            track.releasePointerCapture(activePointer);
        }
    };

    const onPointerEnd = (event: PointerEvent) => {
        if (event.pointerId === pointerId) stopDragging();
    };

    const onKeyDown = (event: KeyboardEvent) => {
        let top = page.scrollTop;
        switch (event.key) {
            case 'ArrowDown': top += 40; break;
            case 'ArrowUp': top -= 40; break;
            case 'PageDown': top += document.documentElement.clientHeight; break;
            case 'PageUp': top -= document.documentElement.clientHeight; break;
            case 'Home': top = 0; break;
            case 'End': top = maxScroll; break;
            default: return;
        }
        event.preventDefault();
        scrollTo(top);
    };

    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', scheduleUpdate);
    track.addEventListener('pointerdown', onPointerDown);
    track.addEventListener('pointermove', onPointerMove);
    track.addEventListener('pointerup', onPointerEnd);
    track.addEventListener('pointercancel', onPointerEnd);
    track.addEventListener('lostpointercapture', onPointerEnd);
    track.addEventListener('keydown', onKeyDown);
    const observer = new ResizeObserver(scheduleUpdate);
    observer.observe(element);
    observer.observe(document.documentElement);
    update();

    return () => {
        stopDragging();
        cancelAnimationFrame(frame);
        observer.disconnect();
        window.removeEventListener('scroll', scheduleUpdate);
        window.removeEventListener('resize', scheduleUpdate);
        track.removeEventListener('pointerdown', onPointerDown);
        track.removeEventListener('pointermove', onPointerMove);
        track.removeEventListener('pointerup', onPointerEnd);
        track.removeEventListener('pointercancel', onPointerEnd);
        track.removeEventListener('lostpointercapture', onPointerEnd);
        track.removeEventListener('keydown', onKeyDown);
    };
}
