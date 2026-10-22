// Small helpers shared by the components that use GSAP.
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { html } from './html.js';

export const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Fades its children in and lifts them slightly when they first appear. */
export function FadeIn({ children }) {
  const wrapper = useRef(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    gsap.from(wrapper.current, { opacity: 0, y: 6, duration: 0.25, ease: 'power1.out' });
  }, []);

  return html`<div ref=${wrapper}>${children}</div>`;
}
