function setupProjectGallery(): void {
  const gallery = document.querySelector<HTMLElement>('.project-gallery');
  const main = gallery?.querySelector<HTMLButtonElement>('.gallery-main');
  const caption = gallery?.querySelector<HTMLElement>('.gallery-caption');
  const previous = gallery?.querySelector<HTMLButtonElement>('.gallery-previous');
  const next = gallery?.querySelector<HTMLButtonElement>('.gallery-next');
  const dialog = document.querySelector<HTMLDialogElement>('.gallery-lightbox');
  const enlarged = dialog?.querySelector('img');
  const close = dialog?.querySelector<HTMLButtonElement>('.gallery-close');
  if (!gallery || !main || !caption || !previous || !next || !dialog || !enlarged || !close) return;

  let mediaElement: HTMLImageElement | HTMLIFrameElement | null = null;

  const thumbnails = Array.from(gallery.querySelectorAll<HTMLButtonElement>('.gallery-thumbnail'));
  let selected = 0;

  const select = (index: number, reveal = false) => {
    const thumbnail = thumbnails[index];
    const preview = thumbnail?.querySelector('img');
    if (!preview) return; // Guard clause against missing inner thumbnail image assets

    const videoUrl = preview.getAttribute('data-url');
    const isVideo = videoUrl ? { src: videoUrl, title: preview.getAttribute('alt') || '' } : null;

    if (isVideo) {
      const iframe = document.createElement('iframe');
      iframe.src = isVideo.src;
      iframe.title = isVideo.title;
      iframe.style.width = '100%';
      iframe.style.height = '100%';
      iframe.setAttribute('frameborder', '0');
      iframe.setAttribute('allowfullscreen', 'true');
      mediaElement = iframe;
    } else {
      const img = document.createElement('img');
      img.src = preview.currentSrc || preview.src || '';
      img.alt = preview.alt || '';
      mediaElement = img;
    }

    main.replaceChildren(mediaElement);
    selected = index;
    caption.textContent = preview.alt || isVideo?.title || '';
    thumbnails.forEach((button, i) => button.classList.toggle('is-selected', i === index));
    
    previous.disabled = index === 0;
    next.disabled = index === thumbnails.length - 1;
    
    if (reveal) thumbnail.scrollIntoView({ block: 'nearest', inline: 'nearest' });
  };

  thumbnails.forEach((thumbnail, index) => {
    thumbnail.addEventListener('click', () => select(index, true));
  });
  previous.addEventListener('click', () => select(selected - 1, true));
  next.addEventListener('click', () => select(selected + 1, true));
  
  gallery.addEventListener('keydown', (event) => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    if (selected === 0 && event.key === 'ArrowLeft') return;
    if (selected === thumbnails.length - 1 && event.key === 'ArrowRight') return;
    
    event.preventDefault();
    select(selected + (event.key === 'ArrowLeft' ? -1 : 1), true);
  });

  main.addEventListener('click', () => {
    if (!mediaElement) return;

    if (mediaElement instanceof HTMLIFrameElement) {
      window.open(mediaElement.src, '_blank', 'noopener,noreferrer');
      return;
    }

    enlarged.src = mediaElement.currentSrc || mediaElement.src;
    enlarged.alt = mediaElement.alt;
    dialog.showModal();
  });

  close.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  });
  
  select(0);
}

setupProjectGallery();
