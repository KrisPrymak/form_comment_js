let OUTLINED_HEART_IMG = "https://cdn-icons-png.flaticon.com/512/14/14815.png";
let FILLED_HEART_IMG = "https://cdn-icons-png.flaticon.com/512/32/32557.png";
let BTN_DELETE_IMG = "https://cdn-icons-png.flaticon.com/512/3156/3156999.png";
let ID_DELETE = null;
let IS_VALIDATE_FORM = false;
let IS_VALIDATE_AUTH = false;

// HELPER FUNCTIONS

const getElement = (elem) => {
  return document.querySelector(`.${elem}`);
};

const createElement = (elem) => {
  return document.createElement(elem);
};

const setClass = (elem, name) => {
  return elem.classList.add(name);
};

const handleClick = (elem, func) => {
  return elem.addEventListener("click", func);
};

const toggleHidden = (elem) => {
  return () => {
    elem.classList.toggle("hidden");
  };
};

const hiddenValidate = (elem, value, btn) => {
  if (value === true) {
    value = false;
    let error = document.querySelector(".errorValidate");
    error.remove();
    console.log("hii");
    btn.removeAttribute("disabled");
  }
};

// VALIDATE

class Validate {
  constructor(text, id) {
    this.text = text;
    this.id = id;
  }

  introduce() {
    this.id === "form" ? (IS_VALIDATE_FORM = true) : (IS_VALIDATE_AUTH = true);
    let message = createElement("span");
    setClass(message, "errorValidate");
    message.innerHTML = this.text;
    this.id === "form"
      ? buttonSend.setAttribute("disabled", "true")
      : buttonSave.setAttribute("disabled", "true");

    return message;
  }
}

// DATE

const dropHMS = (date) => {
  let resultDate = date;
  resultDate.setHours(0);
  resultDate.setMinutes(0);
  resultDate.setSeconds(0, 0);
  return resultDate;
};

const adjustTime = (value) => {
  let currentTime = value;
  if (value < 10) {
    currentTime = `0${value}`;
  }
  return currentTime;
};

const setTime = (date, time) => {
  let hours = time.getHours();
  let minutes = time.getMinutes();

  let resultTime = `, ${adjustTime(hours)}:${adjustTime(minutes)}`;
  let resultDate = "Сегодня";

  if (date !== "") {
    let userDate = new Date(date);
    console.log(userDate);
    let today = new Date();

    let diff = dropHMS(today) - dropHMS(userDate);
    console.log(diff);

    if (diff === 0) {
      resultDate = "Сегодня";
    } else if (diff === 86400000) {
      resultDate = "Вчера";
    } else if (diff > 86400000 || diff < 0) {
      resultDate = `${adjustTime(userDate.getDate())}.${adjustTime(
        userDate.getMonth() + 1
      )}.${userDate.getFullYear()}`;
    }
  }

  return resultDate + resultTime;
};

// NEW COMMENT

class CommentItem {
  constructor(id, name, text, date, time) {
    this.id = id;
    this.name = name;
    this.text = text;
    this.date = date;
    this.time = time;
  }

  introduce() {
    let commentItem = createElement("div");
    let info = createElement("div");
    let avatar = createElement("img");
    let name = createElement("p");
    let date = createElement("p");
    let text = createElement("p");
    let buttons = createElement("div");
    let buttonLike = createElement("button");
    let imgLike = createElement("img");
    let buttonDelete = createElement("button");
    let imgDelete = createElement("img");

    setClass(commentItem, "commentItem");
    setClass(info, "commentItem__info");
    setClass(avatar, "commentItem__avatar");
    setClass(name, "commentItem__name");
    setClass(date, "commentItem__date");
    setClass(text, "commentItem__text");
    setClass(buttons, "commentButtons");
    setClass(buttonLike, "buttonLike");
    setClass(buttonDelete, "buttonDelete");

    commentItem.append(info, text, buttons);
    info.append(avatar, name, date);
    buttons.append(buttonLike, buttonDelete);
    buttonLike.append(imgLike);
    buttonDelete.append(imgDelete);

    commentItem.setAttribute("id", this.id);
    avatar.setAttribute(
      "src",
      "https://cdn-icons-png.flaticon.com/512/3177/3177440.png"
    );
    imgLike.setAttribute("src", OUTLINED_HEART_IMG);
    imgDelete.setAttribute("src", BTN_DELETE_IMG);

    name.innerHTML = this.name;
    date.innerHTML = setTime(this.date, this.time);
    text.innerHTML = this.text;

    handleClick(buttonDelete, (e) => {
      ID_DELETE = e.target.closest(".commentItem").getAttribute("id");
      popupBg.classList.toggle("hidden");
    });
    handleClick(buttonLike, () => {
      imgLike.getAttribute("src") === OUTLINED_HEART_IMG
        ? imgLike.setAttribute("src", FILLED_HEART_IMG)
        : imgLike.setAttribute("src", OUTLINED_HEART_IMG);
    });
    handleClick(buttonTrue, () => {
      document.getElementById(ID_DELETE).remove();
      ID_DELETE = null;
      return popupBg.classList.add("hidden");
    });

    return commentItem;
  }
}

// ELEMENTS

let userNameBlock__auth = getElement("userNameBlock__auth");
let formDataBg = getElement("formDataBg");
let popupBg = getElement("popupBg");
let buttonCancel = getElement("buttonCancel");
let buttonDelete = getElement("buttonDelete");
let buttonFalse = getElement("popup__false");
let buttonTrue = getElement("popup__true");
let formDataName = getElement("formData__content");
let userName = getElement("userNameBlock__name");
let formName = getElement("formName");
let buttonSave = getElement("buttonSave");
let formComment = getElement("formComment");
let comments = getElement("comments");
let formTextarea = getElement("formTextarea");
let buttonSend = getElement("buttonSend");

// CLICK

handleClick(userNameBlock__auth, () => {
  toggleHidden(formDataBg)();
  if (IS_VALIDATE_FORM) {
    hiddenValidate(formTextarea, IS_VALIDATE_FORM, buttonSend);
  }
});
handleClick(buttonCancel, () => {
  formName.value = "";
  toggleHidden(formDataBg)();
  if (IS_VALIDATE_AUTH) {
    hiddenValidate(formName, IS_VALIDATE_AUTH, buttonSave);
  }
});
handleClick(buttonFalse, () => {
  popupBg.classList.toggle("hidden");
  ID_DELETE = null;
});

formTextarea.addEventListener("keydown", () => {
  hiddenValidate(formTextarea, IS_VALIDATE_FORM, buttonSend);
});

formName.addEventListener("keydown", () => {
  hiddenValidate(formName, IS_VALIDATE_AUTH, buttonSave);
});

// AUTH
buttonSave.addEventListener("click", (e) => {
  e.preventDefault();
  if (formName.value.trim() === "") {
    let err = new Validate("Please, fill this field. MaxLength: 20", "auth");
    return formName.before(err.introduce());
  }
  if (formName.value.trim() !== "") {
    userName.innerHTML = formName.value;
    toggleHidden(formDataBg)();
    formName.value = "";
  }
  return (formName.value = "");
});

//MAIN FUNCTIONAL
formComment.addEventListener("submit", (e) => {
  e.preventDefault();
  if (formTextarea.value.trim() === "") {
    let err = new Validate("Please, fill this field. MaxLength: 80", "form");
    return formTextarea.after(err.introduce());
  }
  const formData = new FormData(formComment);
  const date = formData.get("date");
  const text = formData.get("text");
  const id = (Math.random() * new Date()).toFixed();
  let item = new CommentItem(id, userName.innerHTML, text, date, new Date());
  comments.prepend(item.introduce());
  return (formTextarea.value = "");
});
