document.querySelectorAll('[data-windows-download]').forEach((link, index) => {
  const wrapper = document.createElement('span');
  wrapper.className = 'windows-download-help';
  link.before(wrapper);
  wrapper.append(link);

  const tooltip = document.createElement('span');
  tooltip.id = `windows-download-tip-${index}`;
  tooltip.className = 'windows-download-tooltip';
  tooltip.setAttribute('role', 'tooltip');
  tooltip.hidden = true;
  tooltip.innerHTML = '<span class="windows-tip-title">Installing on Windows</span><span class="windows-tip-copy">The installer isn’t digitally signed, so you may see a warning.</span><span class="windows-tip-step">Browser: <strong>Keep</strong></span><span class="windows-tip-step">Windows: <strong>More info → Run anyway → Yes</strong></span>';
  link.setAttribute('aria-describedby', tooltip.id);
  wrapper.append(tooltip);

  const position = () => {
    const anchor = link.getBoundingClientRect();
    const box = tooltip.getBoundingClientRect();
    const center = anchor.left + anchor.width / 2;
    const left = Math.max(12, Math.min(center - box.width / 2, window.innerWidth - box.width - 12));
    const below = anchor.bottom + box.height + 12 < window.innerHeight;
    tooltip.style.left = `${left}px`;
    tooltip.style.top = `${below ? anchor.bottom + 12 : Math.max(12, anchor.top - box.height - 12)}px`;
    tooltip.style.setProperty('--tip-arrow-left', `${Math.max(20, Math.min(center - left, box.width - 20))}px`);
    tooltip.dataset.placement = below ? 'bottom' : 'top';
  };
  const show = () => { tooltip.hidden = false; position(); };
  const hide = () => { tooltip.hidden = true; };
  wrapper.addEventListener('pointerenter', show);
  wrapper.addEventListener('pointerleave', () => {
    if (!wrapper.contains(document.activeElement)) hide();
  });
  wrapper.addEventListener('focusin', show);
  wrapper.addEventListener('focusout', (event) => {
    if (!wrapper.contains(event.relatedTarget) && !wrapper.matches(':hover')) hide();
  });
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape') hide(); });
  document.addEventListener('pointerdown', (event) => { if (!wrapper.contains(event.target)) hide(); });
  window.addEventListener('resize', () => { if (!tooltip.hidden) position(); });
  window.addEventListener('scroll', () => { if (!tooltip.hidden) position(); }, true);
});
