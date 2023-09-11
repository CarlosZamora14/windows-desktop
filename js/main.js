const desktop = document.querySelector('.wallpaper');
const desktopAvailability = {};

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

function findPlace() {
  let div = undefined;
  for (let i = 0; i < 1000; i++) {
    if (!desktopAvailability.hasOwnProperty(i) || desktopAvailability[i]) {
      desktopAvailability[i] = false;
      console.log(desktopAvailability);
      div = i;
      break;
    }
  }
  return div;
}

desktop.addEventListener('click', e => {
  if (e.target.dataset['name'] === 'folder') {
    let div = findPlace();
    if (div != undefined) addDesktopIcon('./assets/images/folder-img.png', 'New folder', `#div-${div}`);
    closeMenus();
  } else if (e.target === desktop) {
    closeMenus();
  }
});

document.addEventListener('click', e => {
  console.log(e.target);
}, true);

document.body.addEventListener('click', () => {
  const icons = document.querySelectorAll('.desktop-icon__container');
  icons.forEach(elem => elem.classList.remove('active'));
}, true);

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
    icon.addEventListener('click', e => {
      e.currentTarget.classList.add('active');
    });
    icon.addEventListener('dragstart', (e) => {
      let id = icon.parentElement.dataset['id'];
      e.dataTransfer.setData('text/plain', String(id));
      desktopAvailability[id] = true;
      console.log(desktopAvailability);
    });
    icon.querySelector('.desktop-icon__img').src = imagePath;
    icon.querySelector('.desktop-icon__name').innerText = name;

    container.appendChild(clone);
  }
}

function createRectDiv(height, width, id) {
  const div = document.createElement('div');
  const rem = parseInt(window.getComputedStyle(document.documentElement).fontSize);
  div.style.width = `${width / rem}rem`;
  div.style.height = `${height / rem}rem`;
  div.setAttribute('id', `div-${id}`);
  div.setAttribute('data-id', id);
  // div.addEventListener('click', () => {
  //   div.style.backgroundColor = 'rgb(0 255 255 / 0.6)';
  // });
  div.addEventListener('dragover', (e) => {
    e.preventDefault();
    div.style.backgroundColor = 'rgb(0 255 255 / 0.6)';
  });
  div.addEventListener('dragleave', () => {
    div.style.backgroundColor = 'transparent';
  });
  div.addEventListener('drop', (e) => {
    e.preventDefault();
    if (desktopAvailability[id] === true || desktopAvailability[id] === undefined) {
      const oldId = e.dataTransfer.getData('text/plain');
      document.getElementById(`div-${oldId}`).innerHTML = '';
      addDesktopIcon('./assets/images/folder-img.png', 'New folder', `#div-${id}`);
      desktopAvailability[id] = false;
    }
  });
  return div;
}

for (let i = 0; i < 1000; i++) {
  const div = createRectDiv(5 * 16, 5 * 16, i);
  desktop.appendChild(div);
}

