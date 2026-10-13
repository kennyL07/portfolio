import './style.css'
import heroImg from './assets/hero.png'
import typescriptLogo from './assets/typescript.svg'
import viteLogo from './assets/vite.svg'
import { setupCounter } from './counter.ts'
import { setupPerlinNoiseBackground, updateNoise } from './perlinNoise.ts'

let counter = 1

setupPerlinNoiseBackground(document.querySelector<HTMLDivElement>('body')!)

setInterval(() => {
    updateNoise(counter)
    counter += 1
}, 100)