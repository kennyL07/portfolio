import './style.css'
import { resizeCanvas, setupPerlinNoiseBackground, updateNoise } from './perlinNoise.ts'
import { setupHeader } from './header.ts'

let counter = 1

setupPerlinNoiseBackground(document.querySelector<HTMLDivElement>('body')!)
setupHeader(document.querySelector<HTMLDivElement>('header')!)

window.addEventListener('resize', () => {
  resizeCanvas();
  updateNoise(counter);
});


setInterval(() => {
    updateNoise(counter)
    counter += 1
}, 100)
