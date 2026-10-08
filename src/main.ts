import './style.css'
import { setupNavButton } from './nav.ts'
import { applyRandomTheme } from './theme.ts'

applyRandomTheme()

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
<aside id="nav-rail" class="nav-rail">
  <button
    id="closebtn"
    type="button"
  >
    <svg viewBox="0 0 88 88">
      <defs>
        <path
          id="nav-square"
          d="M24 4H64C75 4 84 13 84 24V64C84 75 75 84 64 84H24C13 84 4 75 4 64V24C4 13 13 4 24 4Z"
        />
        <path
          id="nav-circle"
          d="M44 4C66.091 4 84 21.909 84 44C84 66.091 66.091 84 44 84C21.909 84 4 66.091 4 44C4 21.909 21.909 4 44 4Z"
        />
      </defs>

      <path
        class="nav-surface"
        d="M24 4H64C75 4 84 13 84 24V64C84 75 75 84 64 84H24C13 84 4 75 4 64V24C4 13 13 4 24 4Z"
      />

      <g
        fill="none"
        stroke="currentColor"
        stroke-width="4"
        stroke-linecap="round"
      >
        <path class="nav-top" d="M24 28L64 28" />
        <path class="nav-middle" d="M24 44L64 44" />
        <path class="nav-bottom" d="M24 60L64 60" />
      </g>
    </svg>
  </button>

  <nav id="nav-links" hidden>
    <a href="#about" class="nav-link">About Me</a>
    <a href="#projects" class="nav-link">Projects</a>
    <a href="#contact" class="nav-link">Contact</a>
  </nav>
</aside>

`

setupNavButton(document.querySelector<HTMLButtonElement>('#closebtn')!)