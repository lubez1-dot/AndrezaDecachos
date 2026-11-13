const portrait = document.querySelector('[data-portrait]');
const frame = portrait.querySelector('.portrait-frame');
const images = [...frame.querySelectorAll('img')];
const controls = portrait.querySelector('.portrait-controls');
const buttons = [...controls.querySelectorAll('button')];
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const mouseInput = window.matchMedia('(any-hover: hover) and (any-pointer: fine)');

let selected = 0;
let visible = 0;

function showPortrait(index) {
  if (index === visible) return;

  images[visible].classList.remove('active');
  images[index].classList.add('active');
  buttons[visible].setAttribute('aria-pressed', 'false');
  buttons[index].setAttribute('aria-pressed', 'true');
  visible = index;
}

controls.hidden = false;
buttons.forEach((button, index) => {
  button.addEventListener('click', () => {
    selected = index;
    showPortrait(index);
  });
});

frame.addEventListener('pointermove', (event) => {
  if (event.pointerType !== 'mouse' || !mouseInput.matches || reducedMotion.matches) return;

  const bounds = frame.getBoundingClientRect();
  const x = Math.min(1, Math.max(0, (event.clientX - bounds.left) / bounds.width));
  const y = Math.min(1, Math.max(0, (event.clientY - bounds.top) / bounds.height));
  frame.style.setProperty('--x', `${(0.5 - x) * 17}px`);
  frame.style.setProperty('--y', `${(0.5 - y) * 17}px`);
  showPortrait(x < 0.32 ? 1 : x > 0.68 ? 2 : selected);
});

function resetPortrait() {
  frame.style.removeProperty('--x');
  frame.style.removeProperty('--y');
  showPortrait(selected);
}

frame.addEventListener('pointerleave', resetPortrait);
reducedMotion.addEventListener('change', resetPortrait);
