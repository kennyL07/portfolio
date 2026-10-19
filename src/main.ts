import './style.css'
import { resizeCanvas, setupPerlinNoiseBackground, updateNoise } from './perlinNoise.ts'
import { setupHeader } from './header.ts'
import { setupScrollBar } from './scroll.ts'

let counter = 1

setupPerlinNoiseBackground(document.querySelector<HTMLDivElement>('body')!)
const cleanupScrollBar = setupScrollBar(document.body)

const cleanupHeader = setupHeader(document.querySelector<HTMLElement>('header')!)
if (import.meta.hot) import.meta.hot.dispose(() => {
  cleanupHeader()
  cleanupScrollBar()
})

window.addEventListener('resize', () => {
  resizeCanvas();
  updateNoise(counter, null);
});

// window.addEventListener('mousemove', (e) => {
//     updateNoise(counter, e);
// })

setInterval(() => {
    updateNoise(counter, null)
    counter += 1
}, 100)
