import './style.css'
import { resizeCanvas, setupPerlinNoiseBackground, updateNoise } from './perlinNoise.ts'
// import { setupHeader } from './header.ts'

let counter = 1

setupPerlinNoiseBackground(document.querySelector<HTMLDivElement>('body')!)

const title = document.querySelector<HTMLElement>('#intro-title')
if (title) {
  const sectionAlignment = new ResizeObserver(() => {
    document.documentElement.style.setProperty('--section-inset', `${title.getBoundingClientRect().left}px`)
  })
  sectionAlignment.observe(title)
  if (title.parentElement) sectionAlignment.observe(title.parentElement)
  if (import.meta.hot) import.meta.hot.dispose(() => sectionAlignment.disconnect())
}

// const cleanupHeader = setupHeader(document.querySelector<HTMLElement>('header')!)
// if (import.meta.hot) import.meta.hot.dispose(cleanupHeader)

window.addEventListener('resize', () => {
  resizeCanvas();
  updateNoise(counter);
});

// window.addEventListener('mousemove', (e) => {
//     updateNoise(counter, e);
// })

setInterval(() => {
    updateNoise(counter)
    counter += 1
}, 100)
