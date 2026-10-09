document.querySelectorAll('[data-windows-download]').forEach((link, index) => {
  const wrapper = document.createElement('span');
  wrapper.className = 'windows-download-help';
  link.before(wrapper);
  wrapper.append(link);

  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'windows-download-info';
  button.setAttribute('aria-label', 'Windows installation help');
  button.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7v2"/></svg>';

  const tooltip = document.createElement('span');
  tooltip.id = `windows-download-tip-${index}`;
  tooltip.className = 'windows-download-tooltip';
  tooltip.setAttribute('role', 'tooltip');
  tooltip.hidden = true;
  tooltip.innerHTML = 'The installer isn’t digitally signed. If your browser warns you, choose <strong>Keep</strong>. In Windows, choose <strong>More info → Run anyway</strong>, then <strong>Yes</strong> to allow installation and firewall access.';
  link.setAttribute('aria-describedby', tooltip.id);
  button.setAttribute('aria-describedby', tooltip.id);
  wrapper.append(button, tooltip);

  let pinned = false;
  const position = () => {
    const anchor = button.getBoundingClientRect();
    const box = tooltip.getBoundingClientRect();
    tooltip.style.left = `${Math.max(12, Math.min(anchor.right - box.width, window.innerWidth - box.width - 12))}px`;
    tooltip.style.top = `${anchor.bottom + box.height + 8 < window.innerHeight ? anchor.bottom + 8 : Math.max(12, anchor.top - box.height - 8)}px`;
  };
  const show = () => { tooltip.hidden = false; position(); };
  const hide = () => { tooltip.hidden = true; pinned = false; };
  wrapper.addEventListener('pointerenter', show);
  wrapper.addEventListener('pointerleave', () => {
    if (!pinned && !wrapper.contains(document.activeElement)) hide();
  });
  wrapper.addEventListener('focusin', show);
  wrapper.addEventListener('focusout', (event) => {
    if (!wrapper.contains(event.relatedTarget) && !wrapper.matches(':hover')) hide();
  });
  button.addEventListener('click', () => {
    pinned = !pinned;
    if (pinned) show(); else hide();
  });
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape') hide(); });
  document.addEventListener('pointerdown', (event) => { if (!wrapper.contains(event.target)) hide(); });
  window.addEventListener('resize', () => { if (!tooltip.hidden) position(); });
  window.addEventListener('scroll', () => { if (!tooltip.hidden) position(); }, true);
});
