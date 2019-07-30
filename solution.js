const currentImage = document.querySelector('.current-image');
currentImage.style.zIndex = 2;
const body = document.querySelector('body');
const wrap = document.querySelector('.wrap');
let id, imgID;
//Отправка коментариев
const commentsForm = document.querySelector('.comments__form');
const messageForm = document.querySelector('.comments__input');
messageForm.value = '';
messageForm.addEventListener('change', () =>
console.log(messageForm.value))
const commentDiv = document.querySelectorAll('.comment');
for (let div of commentDiv) {
  div.style.display = "none";
}
// Кнопки меню
const liMenuItem = document.querySelectorAll('.menu__item');
const menu = document.querySelector('.menu');
const burger = document.querySelector('.burger');
const liNew = document.querySelector('.new');
const liComments = document.querySelector('.comments');
const share = document.querySelector('.share');
const shareEl = document.querySelector('.share-tools');
const commentsTools = document.querySelector('.comments-tools')

const showComments = commentsTools.querySelector('#comments-on');
showComments.addEventListener('change', () => {
  const comments = document.querySelectorAll('.new_comment');
  for (let comment of comments) {
    comment.parentElement.style.display = "inline-block";
  }
  commentsForm.style.display = "inline-block";
})

const hideCommets = commentsTools.querySelector('#comments-off');
hideCommets.addEventListener('change', () => {
  const comments = document.querySelectorAll('.new_comment');
  for (let comment of comments) {
    comment.parentElement.style.display = "none";
  }
  commentsForm.style.display = "none";
})

//Создадим div и переместим туда img и создадим в нем canvas
const divPicture = document.createElement('div');

divPicture.appendChild(currentImage);
divPicture.appendChild(commentsForm);
console.log('aaa',divPicture.style.position)

divPicture.style.position = "relative"
wrap.appendChild(divPicture);






//canvas
const paintMask = document.createElement('canvas');
paintMask.classList.add('current-image');
paintMask.style.display = "none";
const mask = document.createElement('img');

mask.classList.add('mask')
mask.classList.add('current-image');
divPicture.appendChild(paintMask);
divPicture.appendChild(mask);
const draw = document.querySelector('.draw');
const drawEl = document.querySelector('.draw-tools');

//Создали input(file)
const fileInput = document.createElement('input');
fileInput.type = 'file';
fileInput.id = 'fileInput';
fileInput.accept='.jpg,.png'
fileInput.style.display = "none";
const spanDowload= liNew.querySelector('span');
spanDowload.appendChild(fileInput);

let sizeImage;
const newPic = document.querySelector('.new');
const app = document.querySelector('.app');

// Режим "Поделится"
const imgUrl = document.querySelector('.menu__url');
const copyUrlButton = document.querySelector('.menu_copy');
copyUrlButton.addEventListener('click', function () {
  imgUrl.select();
  document.execCommand('copy');
});
////////////////////////////////////////////////////////////////////////////////
//Плавающее меню
menu.setAttribute('draggable', true);
menu.addEventListener('mousedown', event => {
  if (event.which != 1) {
    return;
  };
  const elem = event.target.closest('.drag');
  if (!elem) return;
  const coords = getCoords(menu);
  const shiftX = event.pageX - coords.left;
  const shiftY = event.pageY - coords.top;
  const limits = {
    top: wrap.offsetTop + shiftY,
    right: wrap.offsetWidth + wrap.offsetLeft - menu.offsetWidth + shiftX,
    bottom: wrap.offsetHeight + wrap.offsetTop - menu.offsetHeight + shiftY,
    left: wrap.offsetLeft + shiftX
  };

  function moveAt(event) {
    const newLocation = {
      x: limits.left,
      y: limits.top
    };
    if (event.pageX > limits.right) {
      newLocation.x = limits.right;
    } else if (event.pageX > limits.left) {
      newLocation.x = event.pageX;
    };
    if (event.pageY > limits.bottom) {
      newLocation.y = limits.bottom;
    } else if (event.pageY > limits.top) {
      newLocation.y = event.pageY;
    };
    menu.style.left = newLocation.x - shiftX + 'px';
    menu.style.top = newLocation.y - shiftY + 'px';
    menu.style.marginRight = '-1px';
  };

  document.onmousemove = function (event) {
    moveAt(event);
  };

  menu.onmouseup = function () {
    document.onmousemove = null;
    menu.onmouseup = null;
  };

  menu.ondragstart = function () {
    return false;
  };

  function getCoords(elem) {
    const box = elem.getBoundingClientRect();
    return {
      top: box.top + pageYOffset,
      left: box.left + pageXOffset
    };
  };
});

window.addEventListener('resize', windowResize, false);

function windowResize() {
  console.log('Resize event');
  relocationMenu();
};

function relocationMenu(position, value) {
  const limitPos = wrap.offsetLeft + wrap.offsetWidth - menu.offsetWidth - 1;
  if (parseInt(menu.style.left) < 0) {
    menu.style.left = '0px';
  } else {
    if (limitPos === parseInt(menu.style.left)) {
      menu.style.left = (parseInt(menu.style.left) - value) + 'px';
    } else if ((limitPos - value) < parseInt(menu.style.left)) {
      menu.style.left = (position - value) + 'px';
    };
  };
};

////////////////////////////////////////////////////////////////////////////////
//События
liNew.addEventListener('click', main); // Загрузка нового изображения
liNew.addEventListener('click', () => fileInput.click()); // Вызываем input(file)
//Выбираем изображение
fileInput.addEventListener('change', (event) => {
  const files = event.currentTarget.files;
  sendFile(files[0]);
  }
);

// Перетаскиваем изображение
body.addEventListener('drop', onFilesDrop);
body.addEventListener('dragover', event => event.preventDefault());

function onFilesDrop(event) {
  event.preventDefault();
  const files = Array.from(event.dataTransfer.files);
  let typeFile = files[0].type.split('/');
  if (typeFile[1] === 'jpeg' || typeFile[1] === 'png'){
    if (sizeImage === files[0].size) {
      document.querySelector('.error')
      document.querySelector('.error').style.display = 'inline-block';
      return;
    } else {
      sizeImage = files[0].size
      currentImage.src = URL.createObjectURL(files[0]);
      document.querySelector('.error__message').innerText = 'Чтобы загрузить новое изображение, пожалуйста, воспользовайтесь пунктом "Загрузить новое изображение"';
      sendFile(files[0]);
    }
  } else {
    document.querySelector('.error').style.display = 'inline-block';
  }
}

function removeNewInput() {
  let inputs = document.querySelectorAll('.new_input');
  for (input of inputs) {
    input.classList.remove('new_input');
  }
}
////////////////////////////////////////////////////////////////////////////////
burger.addEventListener('click', () => {
  document.querySelector('.comments__form').style.display = "none";
  closeInputComment();
  burger.style.display = "none";
  liComments.classList.remove('active');
  liMenuItem[2].style.display = "inline-block";
  liMenuItem[3].style.display = "inline-block";
  liMenuItem[4].style.display = "none"; //
  liMenuItem[5].style.display = "inline-block";
  liMenuItem[6].style.display = "none";
  liMenuItem[7].style.display = "inline-block";
  liMenuItem[8].style.display = "none";
  paintMask.style.zIndex = 1;
  removeNewInput();

})

liComments.addEventListener('click', () => {
  liComments.classList.add('active');
  if (mask.width !== currentImage.width) {
    currentImage.style.zIndex = 4;
    paintMask.style.zIndex = 3;
    mask.style.zIndex = 2;
  } else {
    currentImage.style.zIndex = 3;
    paintMask.style.zIndex = 2;
    mask.style.zIndex = 4;
  }
  burger.style.display = "inline-block";
  liMenuItem[2].style.display = "none";
  liMenuItem[4].style.display = "inline-block"; //
  liMenuItem[5].style.display = "none";
  liMenuItem[7].style.display = "none";
  commentsForm.style.display = "none";
})

share.addEventListener('click', () =>{
  liMenuItem[0].style.display = "inline-block";
  burger.style.display = "inline-block";
  liComments.style.display = "none";
  liMenuItem[5].style.display = "none";
  liNew.style.display = "none";
  share.style.display = "inline-block";
  shareEl.style.display = "inline-block";
  removeNewInput();
});


function closeInputComment() {
  marker.checked = true;
  let formComment = document.querySelectorAll('.new_comment');
  for (let form of formComment) {
    let input = form.previousElementSibling;
    input.checked = false;
  }
}

function openInputComment() {
  marker.checked = true;
  let formComment = document.querySelectorAll('.new_comment');
  for (let form of formComment) {
    let input = form.previousElementSibling;
    input.checked = true;
  }
}

currentImage.addEventListener('click', (event) => {
  if(liComments.classList.contains('active')) {
    document.querySelectorAll('.loader')[1].style.display = "none";
    commentsForm.style.display = "inline-block";
    commentsForm.style.position = 'absolute';
    commentsForm.style.zIndex = 5;
    let offsetTop = currentImage.getBoundingClientRect().top + document.body.scrollTop - 18;
    let offsetLeft = currentImage.getBoundingClientRect().left + document.body.scrollLeft - 20;
    commentsForm.style.top = event.layerY + offsetTop + 'px';
    commentsForm.style.left = event.layerX  + offsetLeft + 'px';
  }
  closeInputComment();
  removeNewInput();
})

mask.addEventListener('click', (event) => {
  if(liComments.classList.contains('active')) {
    document.querySelectorAll('.loader')[1].style.display = "none";
    commentsForm.style.display = "inline-block";
    commentsForm.style.position = 'absolute';
    commentsForm.style.zIndex = 5;
    let offsetTop = currentImage.getBoundingClientRect().top + document.body.scrollTop - 18;
    let offsetLeft = currentImage.getBoundingClientRect().left + document.body.scrollLeft - 20;
    commentsForm.style.top = event.layerY + offsetTop + 'px';
    commentsForm.style.left = event.layerX  + offsetLeft + 'px';
  }
  closeInputComment();
  removeNewInput();
})


// Кнопка закрыть у формы
const marker = document.querySelector('.comments__marker-checkbox');
marker.addEventListener('click', () => {
  marker.checked = true;
})
const closeButton = document.querySelector('.comments__close');
closeButton.addEventListener('click', () => {
    marker.checked = true;
})

const inputSend = document.querySelector('.comments__submit');
inputSend.addEventListener('click', (event) => {
  event.preventDefault();
  document.querySelectorAll('.loader')[1].parentElement.style.display = "inline-block";
  document.querySelectorAll('.loader')[1].style.display = "inline-block";
  console.log('отправка сообщения');
  submitComment(window.imgID, commentsForm.style.top, commentsForm.style.left, messageForm.value);
  messageForm.value = '';
  closeInputComment();
})

/////////////////////////////////////////////////////////////////
//создаем и отправляем коментарии
function submitComment(id, top, left, message) {
  let x = left.replace(/\D.+/g,"");
  let y =  top.replace(/\D.+/g,"");
  let url = id;
  const commentData = {
    'message': message,
    'left': x,
    'top': y
  };
  sendComment(commentData, url);
};

function sendComment(data, url) {
  window.imgID = url;
  console.log('Отправка комментария');
  const commentBody = `message=${data.message}&left=${data.left}&top=${data.top}`;
  fetch('https://neto-api.herokuapp.com/pic/' + window.imgID + '/comments', {
      method: 'POST',
      headers: {
        "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
      },
      body: commentBody
    })
    .then(response => {
      if (200 <= response.status && response.status < 300) {
        return response;
      };
      throw new Error(response.statusText);
    })
    .then(response => response.json())
    .catch(error => {
      console.log(error);
      alert('Ошибка при отправке комментария');
    });
    document.querySelectorAll('.loader')[1].style.display = "none";
};


// Отправляем изображение на сервер
function sendFile(file) {
  const formData = new FormData();
  formData.append('title', file.name);
  formData.append('image', file);
  const xhr = new XMLHttpRequest();
  xhr.open('POST', 'https://neto-api.herokuapp.com/pic');
  xhr.addEventListener('load', () => {
    if (xhr.status === 200){
      document.querySelector('.image-loader').style.display = "none";
      //console.log(`Файл ${file.name} сохранен.`);
      for (let div of document.querySelectorAll('.new_comment')) {
        div.parentElement.remove();
      }
      let json = JSON.parse(xhr.response);
      window.imgID = json.id;
      wsConnect();
      peerReview(json.url);
    }
  });
  xhr.send(formData);
  document.querySelector('.image-loader').style.display = "inline-block";
}

//Режим "Рисование"
draw.addEventListener('click', () => {
  closeInputComment();
  removeNewInput();
  liMenuItem[0].style.display = "inline-block";
  paintMask.style.display = "inline-block";
  burger.style.display = "inline-block";
  liComments.style.display = "none";
  draw.style.display = "inline-block";
  drawEl.style.display = "inline-block";
  liNew.style.display = "none";
  share.style.display = "none";
  shareEl.style.display = "none";
  paintMode();
});

function paintMode() {
  paintMask.style.zIndex = 4;
  mask.style.zIndex = 3;
  currentImage.style.zIndex = 2;
  paintMask.style.opacity = 1
  resizePaintMask();
  const initMouse = {
    x: 0,
    y: 0
  };
  const curMouse = {
    x: 0,
    y: 0
  };
  const ctx = paintMask.getContext('2d');
  ctx.strokeStyle = 'red';
  ctx.lineWidth = 5;

  paintMask.onmousedown = function (event) {
    initMouse.x = event.offsetX;
    initMouse.y = event.offsetY;
    ctx.drawing = true;
  }

  paintMask.onmousemove = function (event) {
    curMouse.x = event.offsetX;
    curMouse.y = event.offsetY;
    if (ctx.drawing) {
      ctx.beginPath();
      ctx.lineJoin = 'round';
      ctx.moveTo(initMouse.x, initMouse.y);
      ctx.lineTo(curMouse.x, curMouse.y);
      ctx.closePath();
      ctx.stroke();
    }
    initMouse.x = curMouse.x;
    initMouse.y = curMouse.y;
  }

  paintMask.onmouseup = function (event) {
    ctx.drawing = false;
    sendPaintMask();
  }
  const menuColor = document.getElementsByClassName('menu__color')
  for (let i = 0; i < menuColor.length; i++) {
    menuColor[i].addEventListener('click', changeColor, false);
  };

  function changeColor(event) {
    ctx.strokeStyle = event.target.getAttribute('value');
    ctx.globalCompositeOperation = 'source-over';
    ctx.lineWidth = 5;
  }
};

function resizePaintMask() {
  paintMask.width = mask.width = document.querySelector('.current-image').width;
  paintMask.height = mask.height = document.querySelector('.current-image').height;
  paintMask.style.top = currentImage.style.top
  paintMask.style.left = currentImage.style.left;
};

function sendPaintMask() {
  console.log('Отправка рисунка');
  const imageData = paintMask.toDataURL('image/png');
  const byteArray = convertToBinary(imageData);
  websocket.send(byteArray.buffer);
};

//Преобразование paintMask в бинарный формат
function convertToBinary(data) {
  const marker = ';base64,';
  const markerIndex = data.indexOf(marker) + marker.length;
  const base64 = data.substring(markerIndex);
  const raw = window.atob(base64);
  const rawLength = raw.length;
  const byteArray = new Uint8Array(new ArrayBuffer(rawLength));
  for (let i = 0; i < rawLength; i++) {
    byteArray[i] = raw.charCodeAt(i);
  };
  return byteArray;
};


function getInformation(id) {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', `https://neto-api.herokuapp.com/pic/${id}`, false);
  xhr.send();
  console.log('ответ от get-запроса')
  let json = JSON.parse(xhr.response);
  document.querySelector('.menu__url').value = `${document.location.href.split('?id=')[0]}?id=${json.id}`;
  return json
}

function getMessageTime(timestamp) {
  const date = new Date(timestamp);
  const messageTime = date.getDate() + '.' + date.getMonth() + '.' + date.getFullYear() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
  return messageTime;
};

function addDivComment(object) {
  let form = document.querySelector('.comments__form').cloneNode(true);
  let newForm = form.querySelector('.comments__body');
  newForm.classList.add('new_comment');
  let div = document.createElement('div');
  div.class = 'comment';
  let pTime = document.createElement('p');
  pTime.classList.add('comment__time');
  pTime.innerText = getMessageTime(object.timestamp);
  let pComment = document.createElement('p');
  pComment.classList.add('comment__message');
  pComment.innerText = object.message;
  div.appendChild(pTime);
  div.appendChild(pComment);
  div.style.display = "block";
  const commentsBody = form.querySelector('.comments__body');
  commentsBody.insertBefore(div, commentsBody.firstElementChild);
  form.querySelector('.loader').style.display = "none"; // убираем лоадер
  commentsForm.style.display = "none"; // убираем шаблонную форму
  form.style.top = object.top + 'px';
  form.style.left = object.left + 'px';
  form.style.display = "block"
  commentsForm.style.zIndex = 6;
  divPicture.appendChild(form);
  let marker = form.querySelector('.comments__marker-checkbox');
  marker.addEventListener('click', () => {
    if (marker.checked === false) {
      marker.checked = false;
    } else {
      document.querySelector('.comments__form').style.display = "none";
      closeInputComment();
      marker.checked = true;
    }
  });
  let closeButton = form.querySelector('.comments__close');
  closeButton.addEventListener('click', () => {
      marker.checked = false;
  });
  let commentsInput= form.querySelector('.comments__input');
  let sendButton = form.querySelector('.comments__submit');
  sendButton.addEventListener('click', (event) => {
    event.preventDefault();
    removeNewInput();
    document.querySelectorAll('.loader')[1].parentElement.style.display = "inline-block";
    document.querySelectorAll('.loader')[1].style.display = "inline-block";
    console.log('отправка сообщения');
    sendButton.style.left = 0;
    sendButton.style.top = 0;
    submitComment(window.imgID, form.style.top, form.style.left, commentsInput.value);
    commentsInput.value = '';
    marker.checked = true;
    marker.classList.add('new_input');
  })
  closeInputComment();
}

//проверяем коментарии на повтор
function inspection (time, teg) {
  let p = teg.querySelectorAll('.comment__time');
  for (let element of p) {
    if (element.innerText === time) {
      return true
    }
  }
  return false
}

let websocket;
function wsConnect(id=window.imgID) {
  websocket = new WebSocket(`wss://neto-api.herokuapp.com/pic/${id}`);
  websocket.addEventListener('open', () => {
    console.log('Вебсокет-соединение открыто');
  });
  websocket.addEventListener('close', event => {;
    console.log('Вебсокет-соединение закрыто');
  });
  websocket.addEventListener('message', event => {
    const data = JSON.parse(event.data);
    console.log('ответ ws')
    let json = getInformation(window.imgID);
    let objectCommments = json.comments
    mask.src = json.mask
    if (objectCommments !== undefined) {
      let keys = Object.keys(json.comments);
      for (let key of keys) {
        openInputComment();
        let divN = document.elementFromPoint(objectCommments[key].left, objectCommments[key].top);
        if (divN.classList.contains('new_comment')) {
          if (inspection(`${getMessageTime(objectCommments[key].timestamp)}`, divN)) {
            closeInputComment();
          } else {
            let div = document.createElement('div');
            div.class = 'comment';
            let pTime = document.createElement('p');
            pTime.classList.add('comment__time');
            pTime.innerText = getMessageTime(objectCommments[key].timestamp);
            let pComment = document.createElement('p');
            pComment.classList.add('comment__message');
            pComment.innerText = objectCommments[key].message;
            div.appendChild(pTime);
            div.appendChild(pComment);
            div.style.display = "block";
            divN.insertBefore(div, divN.firstChild);
            console.log(divN.parentElement.querySelector('.comments__marker-checkbox').checked)
            closeInputComment();
            if (divN.parentElement.querySelector('.comments__marker-checkbox').classList.contains('new_input')) {
              divN.parentElement.querySelector('.comments__marker-checkbox').checked = true;
            }
          }
        } else {
          console.log('создаем новую форму')
          addDivComment(objectCommments[key]);
        }
      }
    }
  });
  websocket.addEventListener('error', error => {
    console.log(`Произошла ошибка: ${error.data}`);
  });
};


//Режим рецензирования
function peerReview(url) {
  currentImage.src = url;
  liMenuItem[0].style.display = "inline-block";
  liMenuItem[1].style.display = "inline-block";
  liNew.style.display = "none";
  share.style.display = "inline-block";
  shareEl.style.display = "inline-block";
}

function getIdFromUrl(name) {
  const imgHref = window.location.search.split('?id=')[1];
  return imgHref;
};

document.addEventListener('DOMContentLoaded', function () {
  const imgID = getIdFromUrl('id');
  if (imgID) {
    let url = getInformation(imgID);
    window.imgID = imgID;
    wsConnect(imgID);
    peerReview(url.url);
    currentImage.style.zIndex = 3;
    paintMask.style.zIndex = 2;
    mask.style.zIndex = 4;
  };
});

//Публикация (состояние по умолчанию):
function publishDefaultState() {
  for (let li of liMenuItem) {
    li.style.display = "none";
  }
  liMenuItem[0].style.display = "inline-block";
  liNew.style.display = "inline-block";
  commentsForm.style.display = "none";
  currentImage.src = '';
  document.querySelector('.error').style.display = 'none';
}


function main() {
  publishDefaultState();
}

//document.addEventListener("click", function (e) {
//console.log(e.target);
//});
main();
