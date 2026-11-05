function setupProjectGallery(): void {
  const gallery = document.querySelector<HTMLElement>('.project-gallery');
  const originalMain = gallery?.querySelector<HTMLElement>('.gallery-main');
  const caption = gallery?.querySelector<HTMLElement>('.gallery-caption');
  const previous = gallery?.querySelector<HTMLButtonElement>('.gallery-previous');
  const next = gallery?.querySelector<HTMLButtonElement>('.gallery-next');
  const dialog = document.querySelector<HTMLDialogElement>('.gallery-lightbox');
  const enlarged = dialog?.querySelector('img');
  const close = dialog?.querySelector<HTMLButtonElement>('.gallery-close');
  if (!gallery || !originalMain || !caption || !previous || !next || !dialog || !enlarged || !close) return;

  const main = originalMain instanceof HTMLButtonElement ? document.createElement('div') : originalMain;
  if (main !== originalMain) {
    main.className = originalMain.className;
    originalMain.replaceWith(main);
  }

  const thumbnails = Array.from(gallery.querySelectorAll<HTMLButtonElement>('.gallery-thumbnail'));
  let selected = 0;
  let mediaElement: HTMLImageElement | HTMLVideoElement | HTMLIFrameElement | null = null;

  const select = (index: number, reveal = false) => {
    const thumbnail = thumbnails[index];
    const preview = thumbnail?.querySelector('img');
    const videoPreview = thumbnail?.querySelector('video');
    if (!preview && !videoPreview) return;
    if (mediaElement instanceof HTMLVideoElement) mediaElement.pause();

    if (videoPreview) {
      const video = document.createElement('video');
      video.src = videoPreview.currentSrc || videoPreview.src;
      video.poster = videoPreview.poster;
      video.controls = true;
      video.playsInline = true;
      video.preload = 'metadata';

      const open = document.createElement('a');
      open.href = video.src;
      open.target = '_blank';
      open.rel = 'noopener noreferrer';
      open.textContent = 'Open video';

      const container = document.createElement('div');
      container.className = 'gallery-video';
      container.append(video, open);
      main.replaceChildren(container);
      mediaElement = video;
    } else if (preview?.dataset.url) {
      const iframe = document.createElement('iframe');
      iframe.src = preview.dataset.url;
      iframe.title = preview.alt;
      iframe.allowFullscreen = true;
      main.replaceChildren(iframe);
      mediaElement = iframe;
    } else if (preview) {
      const image = document.createElement('img');
      image.src = preview.currentSrc || preview.src;
      image.alt = preview.alt;

      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'gallery-image';
      button.append(image);
      button.addEventListener('click', () => {
        enlarged.src = image.currentSrc || image.src;
        enlarged.alt = image.alt;
        dialog.showModal();
      });
      main.replaceChildren(button);
      mediaElement = image;
    }

    selected = index;
    caption.textContent = thumbnail.dataset.caption || gallery.dataset.caption || preview?.alt || '';
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
    if (event.target instanceof HTMLVideoElement) return;
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    select(selected + (event.key === 'ArrowLeft' ? -1 : 1), true);
  });

  close.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  });

  select(0);
}

setupProjectGallery();
