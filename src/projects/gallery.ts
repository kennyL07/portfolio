function setupProjectGallery(): void {
  const gallery = document.querySelector<HTMLElement>('.project-gallery');
  const main = gallery?.querySelector<HTMLButtonElement>('.gallery-main');
  const image = main?.querySelector('img');
  const caption = gallery?.querySelector<HTMLElement>('.gallery-caption');
  const previous = gallery?.querySelector<HTMLButtonElement>('.gallery-previous');
  const next = gallery?.querySelector<HTMLButtonElement>('.gallery-next');
  const dialog = document.querySelector<HTMLDialogElement>('.gallery-lightbox');
  const enlarged = dialog?.querySelector('img');
  const close = dialog?.querySelector<HTMLButtonElement>('.gallery-close');
  if (!gallery || !main || !image || !caption || !previous || !next || !dialog || !enlarged || !close) return;

  const thumbnails = Array.from(gallery.querySelectorAll<HTMLButtonElement>('.gallery-thumbnail'));
  let selected = 0;

  const select = (index: number, reveal = false) => {
    const thumbnail = thumbnails[index];
    const preview = thumbnail?.querySelector('img');
    if (!preview) return;

    selected = index;
    image.src = preview.currentSrc || preview.src;
    image.alt = preview.alt;
    caption.textContent = preview.alt;
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
    event.preventDefault();
    select(selected + (event.key === 'ArrowLeft' ? -1 : 1), true);
  });

  main.addEventListener('click', () => {
    enlarged.src = image.currentSrc || image.src;
    enlarged.alt = image.alt;
    dialog.showModal();
  });
  close.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  });
  select(0);
}

setupProjectGallery();
