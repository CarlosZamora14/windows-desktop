const desktop = document.querySelector('.wallpaper');

function popMenu(e) {
  const menu = document.querySelector('.right-click-window');
  if (menu) {
    menu.parentElement.removeChild(menu);
  }
  console.log(e);
  if ('content' in document.createElement('template')) {
    const template = document.getElementById('right-click-options');
    const clone = template.content.cloneNode(true);
    const menu = clone.querySelector('.right-click-window');

    const desktopBounding = desktop.getBoundingClientRect();

    desktop.appendChild(clone);
    const menuBounding = menu.getBoundingClientRect();

    if (menuBounding.width + e.pageX <= desktopBounding.width) {
      menu.style.left = `${e.pageX}px`;
    } else {
      menu.style.right = `${desktopBounding.width - e.pageX}px`;
    }

    if (menuBounding.height + e.pageY <= desktopBounding.height) {
      menu.style.top = `${e.pageY}px`;
    } else {
      menu.style.bottom = `${desktopBounding.height - e.pageY}px`;
    }
  }
}

desktop.addEventListener('contextmenu', (e) => {
  e.preventDefault();
  popMenu(e);
})