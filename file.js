import gallery from './gallery-items.js';

const ref = {
  galleryRef: document.querySelector('.js-gallery'),
  modalRef: document.querySelector('.lightbox'),
  btnModalRef: document.querySelector('button[data-action="close-lightbox"]'),
  bigImgRef: document.querySelector('.lightbox__image'),
  overlayRef: document.querySelector('.lightbox__overlay'),
};

const { galleryRef, bigImgRef, modalRef, btnModalRef, overlayRef } = ref;

galleryRef.addEventListener('click', handleModalOpen);
btnModalRef.addEventListener('click', handleModalClose);
overlayRef.addEventListener('click', handleBackdropCloseModal);
bigImgRef.addEventListener('click', handleChangeClick);

let index = -1;

function createElements({ original, preview, description }) {
  const liElement = document.createElement('li');
  liElement.classList.add('gallery__item');

  const referense = document.createElement('a');
  referense.classList.add('gallery__link');
  referense.href = original;

  const imgRef = document.createElement('img');
  imgRef.classList.add('gallery__image');
  imgRef.src = preview;
  imgRef.setAttribute('data-source', original);
  imgRef.setAttribute('data-index', (index += 1));
  imgRef.alt = description;

  referense.appendChild(imgRef);
  liElement.appendChild(referense);

  return liElement;
}

function handleNewElements(images) {
  return images.map(createElements);
}

function handleRenderElements(newElements) {
  galleryRef.append(...newElements);
}

handleRenderElements(handleNewElements(gallery));

function handleModalOpen(event) {
  event.preventDefault();
  window.addEventListener('keydown', handlePressKeys);

  const { target } = event;
  const { dataset } = target;

  if (target.nodeName !== 'IMG') {
    return;
  }
  const hrefImg = dataset.source;
  const indexCount = dataset.index;

  modalRef.classList.add('is-open');
  bigImgRef.src = hrefImg;
  bigImgRef.alt = target.alt;
  bigImgRef.setAttribute('data-index', indexCount);
}

function handleModalClose() {
  modalRef.classList.remove('is-open');
  bigImgRef.src = '';
  bigImgRef.alt = '';
  window.removeEventListener('keydown', handlePressKeys);
}

function handleBackdropCloseModal({ target, currentTarget }) {
  if (target === currentTarget) {
    handleModalClose();
  }
}
function handleChangeClick({ target }) {
  const { dataset } = target;
  const currentIndexImg = Number(dataset.index);

  if (currentIndexImg + 1 === gallery.length) {
    target.src = gallery[0].original;
    target.alt = gallery[0].description;
    dataset.index = 0;
    return;
  }

  target.src = gallery[currentIndexImg + 1].original;
  target.alt = gallery[currentIndexImg + 1].description;
  dataset.index = currentIndexImg + 1;
}

function handlePressKeys(event) {
  if (event.code === 'Escape') {
    handleModalClose();
  }
  const { dataset } = bigImgRef;
  const index = Number(dataset.index);

  if (event.code === 'ArrowRight') {
    if (index + 1 === gallery.length) {
      bigImgRef.src = gallery[0].original;
      bigImgRef.alt = gallery[0].description;
      dataset.index = 0;
      return;
    }
    bigImgRef.src = gallery[index + 1].original;
    bigImgRef.alt = gallery[index + 1].description;
    dataset.index = index + 1;
  }

  if (event.code === 'ArrowLeft') {
    if (index - 1 < 0) {
      bigImgRef.src = gallery[8].original;
      bigImgRef.alt = gallery[8].description;
      dataset.index = 8;
      return;
    }
    bigImgRef.src = gallery[index - 1].original;
    bigImgRef.alt = gallery[index - 1].description;
    dataset.index = index - 1;
  }
}
