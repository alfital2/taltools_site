const screenshotTabs = [...document.querySelectorAll('.screenshot-tabs [role="tab"]')];
const selectScreenshot = (selected) => {
  screenshotTabs.forEach((tab) => {
    const active = tab === selected;
    tab.setAttribute('aria-selected', String(active));
    tab.tabIndex = active ? 0 : -1;
    document.getElementById(tab.getAttribute('aria-controls')).hidden = !active;
  });
};
screenshotTabs.forEach((tab, index) => {
  tab.addEventListener('click', () => selectScreenshot(tab));
  tab.addEventListener('keydown', (event) => {
    let next;
    if (event.key === 'ArrowRight') next = (index + 1) % screenshotTabs.length;
    if (event.key === 'ArrowLeft') next = (index - 1 + screenshotTabs.length) % screenshotTabs.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = screenshotTabs.length - 1;
    if (next === undefined) return;
    event.preventDefault();
    selectScreenshot(screenshotTabs[next]);
    screenshotTabs[next].focus();
  });
});

const screenshotDialog = document.querySelector('.screenshot-dialog');
const screenshotZoom = screenshotDialog.querySelector('.screenshot-zoom');
document.querySelectorAll('.screenshot-open').forEach((button) => {
  button.addEventListener('click', () => {
    const source = button.querySelector('img');
    const enlarged = screenshotDialog.querySelector('img');
    enlarged.src = source.src;
    enlarged.alt = source.alt;
    document.getElementById('screenshot-dialog-title').textContent = button.dataset.screenshotTitle;
    screenshotDialog.showModal();
    document.documentElement.style.overflow = 'hidden';
    screenshotZoom.scrollTo(0, 0);
  });
});
screenshotDialog.querySelector('button').addEventListener('click', () => screenshotDialog.close());
screenshotDialog.addEventListener('click', (event) => {
  const box = screenshotDialog.getBoundingClientRect();
  if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) screenshotDialog.close();
});
screenshotDialog.addEventListener('close', () => { document.documentElement.style.overflow = ''; });
