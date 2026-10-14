import { animate, svg, utils } from 'animejs';

const center = 32;
const circleRadius = 27;
const starRadius = circleRadius * 1;
const innerRadius = starRadius * .8;

function generatePoints() {
  const total = 6;
  const isOdd = (n: number) => n % 2;
  let points = '';
  for (let i = 0, l = isOdd(total) ? total + 1 : total; i < l; i++) {
    const r = isOdd(i) ? starRadius : innerRadius;
    const a = (2 * Math.PI * i / l) - Math.PI / 2;
    const x = center + utils.round(r * Math.cos(a), 0);
    const y = center + utils.round(r * Math.sin(a), 0);
    points += `${x},${y} `;
  }
  return points;
}

function shapePoints(isCircle: boolean): string {

  if (isCircle) {
    return Array.from({ length: 64 }, (_, i) => {
      const angle = -Math.PI / 2 + i * Math.PI / 32;
      return `${(center + circleRadius * Math.cos(angle)).toFixed(5)},${(center + circleRadius * Math.sin(angle)).toFixed(5)}`;
    }).join(" ")
  }

  return generatePoints()
}

export function setupLogo(mark: HTMLElement): () => void {
  mark.innerHTML = `
    <svg viewBox="0 0 64 64" aria-hidden="true" focusable="false">
      <polygon class="logo-shape" fill="currentColor"></polygon>
      <defs>
        <polygon class="logo-star-target"></polygon>
        <polygon class="logo-circle-target"></polygon>
      </defs>
    </svg>
  `;
  const logoSvg = mark.querySelector('svg')!;
  const hoverTarget = mark.closest('a') ?? mark;
  const [shape, starTarget, circleTarget] = utils.$(mark.querySelectorAll('polygon'));
  const starPoints = shapePoints(false);
  const circlePoints = shapePoints(true);
  utils.set([shape!, starTarget!], { points: starPoints });
  utils.set(circleTarget!, { points: circlePoints });

  let currentAnimation: ReturnType<typeof animate> | undefined;
  let disposed = false;
  let hovered = false;

  function morphShape(toCircle: boolean): void {
    if (disposed) return;
    currentAnimation?.cancel();

    currentAnimation = animate(shape!, {
      points: svg.morphTo(toCircle ? circleTarget! : starTarget!),
      ease: 'inOutCirc',
      duration: 200,
      autoplay: !document.hidden,
      onComplete: () => {
        utils.set(shape!, { points: toCircle ? circlePoints : starPoints });
      }
    });
  }

  const startAnimation = (event: PointerEvent) => {
    if (event.pointerType === 'touch' || hovered || disposed) return;
    hovered = true;
    morphShape(true);
  };

  const stopAnimation = () => {
    if (!hovered || disposed) return;
    hovered = false;
    morphShape(false);
  };

  const updateVisibility = () => {
    if (document.hidden) currentAnimation?.pause();
    else if (hovered && !hoverTarget.matches(':hover')) stopAnimation();
    else currentAnimation?.play();
  };

  hoverTarget.addEventListener('pointerenter', startAnimation);
  hoverTarget.addEventListener('pointerleave', stopAnimation);
  hoverTarget.addEventListener('pointercancel', stopAnimation);
  document.addEventListener('visibilitychange', updateVisibility);

  return () => {
    disposed = true;
    currentAnimation?.cancel();
    hoverTarget.removeEventListener('pointerenter', startAnimation);
    hoverTarget.removeEventListener('pointerleave', stopAnimation);
    hoverTarget.removeEventListener('pointercancel', stopAnimation);
    document.removeEventListener('visibilitychange', updateVisibility);
    logoSvg.remove();
  };
}
