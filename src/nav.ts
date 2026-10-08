import { animate, svg, spring } from 'animejs'

export function setupNavButton(button: HTMLButtonElement) {
  const nav = document.getElementById('sidenav')!
  const links = document.getElementById('nav-links')!
  const root = document.documentElement

  const surface = button.querySelector<SVGPathElement>('.nav-surface')!
  const lines = ['top', 'middle', 'bottom'].map(
    name => button.querySelector<SVGPathElement>(`.nav-${name}`)!
  )

  const square = button.querySelector<SVGPathElement>('#nav-square')!
  const circle = button.querySelector<SVGPathElement>('#nav-circle')!

  const mobile = matchMedia('(max-width: 47.99rem)')

  const paths = {
    closed: ['M24 28L64 28', 'M24 44L64 44', 'M24 60L64 60'],
    open: ['M26 26L62 62', 'M44 44L44 44', 'M26 62L62 26'],
  }

  let isOpen = false
  let animations: ReturnType<typeof animate>[] = []

  function setNav(open: boolean, immediate = false) {
    // animations.forEach(animation => animation.cancel())
    animations = []

    if (!open && links.contains(document.activeElement)) {
      button.focus()
    }

    isOpen = open
    root.dataset.navOpen = String(open)
    links.hidden = !open

    const target = open ? circle : square
    const targetPaths = paths[open ? 'open' : 'closed']

    if (immediate) {
      surface.setAttribute('d', target.getAttribute('d')!)

      lines.forEach((line, index) => {
        line.setAttribute('d', targetPaths[index]!)
      })

      lines[1]!.style.opacity = open ? '0' : '1'
      return
    }

    animations.push(
      animate(surface, {
        d: svg.morphTo(target),
        ease: 'inOut',
        duration: 500,
      })
    )

    lines.forEach((line, index) => {
      animations.push(
        animate(line, {
          d: targetPaths[index]!,
          ...(index === 1 ? { opacity: open ? 0 : 1 } : {}),
          ease: spring({ stiffness: 95, damping: 13 }),
          duration: 500,
        })
      )
    })
  }

  button.addEventListener('click', () => setNav(!isOpen))

  document.addEventListener('click', event => {
    if (
      mobile.matches &&
      isOpen &&
      event.target instanceof Node &&
      !nav.contains(event.target)
    ) {
      setNav(false)
    }
  })

  links.addEventListener('click', event => {
    if (
      mobile.matches &&
      event.target instanceof Element &&
      event.target.closest('a')
    ) {
      setNav(false)
    }
  })

  mobile.addEventListener('change', () => setNav(false))

  setNav(!mobile.matches, true)
}