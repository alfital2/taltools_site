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
  tooltip.innerHTML = 'The installer isn’t digitally signed. If your browser warns you, choose <strong>Keep</strong>. In Windows, choose <strong>More info → Run anyway</strong>, then <strong>Yes</strong> to allow installation and firewall access.';
  link.setAttribute('aria-describedby', tooltip.id);
  wrapper.append(tooltip);

  const position = () => {
    const anchor = link.getBoundingClientRect();
    const box = tooltip.getBoundingClientRect();
    tooltip.style.left = `${Math.max(12, Math.min(anchor.right - box.width, window.innerWidth - box.width - 12))}px`;
    tooltip.style.top = `${anchor.bottom + box.height + 8 < window.innerHeight ? anchor.bottom + 8 : Math.max(12, anchor.top - box.height - 8)}px`;
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
