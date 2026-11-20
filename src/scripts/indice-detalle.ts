// Resalta en el índice la sección visible.
const links = [...document.querySelectorAll<HTMLAnchorElement>('.product-toc a')];
const targets = links
  .map((link) => document.getElementById(decodeURIComponent(link.hash.slice(1))))
  .filter((el): el is HTMLElement => Boolean(el));

if (targets.length) {
  const setActive = () => {
    const offset = window.innerHeight * 0.3;
    let current = targets[0];
    for (const target of targets) {
      if (target.getBoundingClientRect().top - offset <= 0) current = target;
    }
    links.forEach((link) => link.classList.toggle('is-active', link.hash.slice(1) === current.id));
  };
  setActive();
  window.addEventListener('scroll', setActive, { passive: true });
}
