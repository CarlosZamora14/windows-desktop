const desktop = document.querySelector('.wallpaper');

function placeMenu(e, parentSelector, templateSelector, childSelector, nextToParent = false, containerSelector = '') {
  if ('content' in document.createElement('template')) {
    let parent = document.querySelector(parentSelector);
    const template = document.querySelector(templateSelector);
    const clone = template.content.cloneNode(true);
    const menu = clone.querySelector(childSelector);

    if (!nextToParent) {
      let parentBounding = parent.getBoundingClientRect();

      parent.appendChild(clone);
      const menuBounding = menu.getBoundingClientRect();
      if (menuBounding.width + e.pageX <= parentBounding.width) {
        menu.style.left = `${e.pageX}px`;
      } else {
        menu.style.right = `${parentBounding.width - e.pageX}px`;
      }

      if (menuBounding.height + e.pageY <= parentBounding.height) {
        menu.style.top = `${e.pageY}px`;
      } else {
        menu.style.bottom = `${parentBounding.height - e.pageY}px`;
      }
    } else {
      parent = e.target;
      parent.appendChild(clone);
      let parentBounding = parent.getBoundingClientRect();
      const menuBounding = menu.getBoundingClientRect();

      const container = document.querySelector(containerSelector);
      const containerBounding = container.getBoundingClientRect();

      if (menuBounding.width + parentBounding.right <= containerBounding.width) {
        menu.style.left = 'calc(100% - 0.5rem)';
      } else {
        menu.style.right = 'calc(100% - 3px)';
      }

      if (menuBounding.height + parentBounding.top <= containerBounding.height) {
        menu.style.top = '-2px';
      } else {
        menu.style.bottom = '-2px';
      }
    }
  }
}

function closeMenus() {
  const menu = document.querySelector('.contextmenu');
  const submenu = document.querySelector('.subcontextmenu');
  if (submenu) {
    submenu.parentElement.removeChild(submenu);
  }

  if (menu) {
    menu.parentElement.removeChild(menu);
  }
}

function popMenu(e) {
  closeMenus();

  placeMenu(e, '.wallpaper', '#right-click-options', '.right-click-window');
}

desktop.addEventListener('contextmenu', (e) => {
  e.preventDefault();
  popMenu(e);
});

desktop.addEventListener('click', e => {
  if (e.target.dataset['name'] === 'folder') {
    addDesktopIcon('./assets/images/folder-img.png', 'New folder', '.wallpaper');
    closeMenus();
  } else if (e.target === desktop) {
    closeMenus();
  }
});

desktop.addEventListener('mouseover', e => {
  const grandparent = e.target?.parentElement?.parentElement;
  if (grandparent) {
    if (grandparent.classList.contains('contextmenu')) {
      const listitems = grandparent.querySelectorAll('li');
      listitems.forEach(element => {
        element.classList.remove('active');
      });
      const submenu = document.querySelector('.subcontextmenu');
      if (submenu) {
        submenu.parentElement.removeChild(submenu);
      }
    }
  }
  if (e.target.dataset['name'] === 'new') {
    e.target.classList.add('active');
    const submenu = document.querySelector('.subcontextmenu');
    if (submenu) {
      submenu.parentElement.removeChild(submenu);
    }
    placeMenu(e, '.right-click-window', '#right-click-options-new', '.right-click-window-new', true, '.wallpaper');
  } else if (e.target.dataset['name'] === 'arrange-icons') {
    e.target.classList.add('active');
    const submenu = document.querySelector('.subcontextmenu');
    if (submenu) {
      submenu.parentElement.removeChild(submenu);
    }
    placeMenu(e, '.right-click-window', '#right-click-options-arrange', '.right-click-window-arrange', true, '.wallpaper');
  }
});

function addDesktopIcon(imagePath, name, containerSelector) {
  if ('content' in document.createElement('template')) {
    const container = document.querySelector(containerSelector);
    const template = document.querySelector('#desktop-icon__template');
    const clone = template.content.cloneNode(true);
    const icon = clone.querySelector('.desktop-icon__container');
    icon.querySelector('.desktop-icon__img').src = imagePath;
    icon.querySelector('.desktop-icon__name').innerText = name;

    container.appendChild(clone);
  }
}
