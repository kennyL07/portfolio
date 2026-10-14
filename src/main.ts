import './style.css'
import { resizeCanvas, setupPerlinNoiseBackground, updateNoise } from './perlinNoise.ts'
import { setupHeader } from './header.ts'

let counter = 1

setupPerlinNoiseBackground(document.querySelector<HTMLDivElement>('body')!)
const cleanupHeader = setupHeader(document.querySelector<HTMLElement>('header')!)
if (import.meta.hot) import.meta.hot.dispose(cleanupHeader)

window.addEventListener('resize', () => {
  resizeCanvas();
  updateNoise(counter);
});


setInterval(() => {
    updateNoise(counter)
    counter += 1
}, 100)
