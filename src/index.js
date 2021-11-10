document.addEventListener("DOMContentLoaded", () => {
  fetchInit();
  console.log("Load done");
});

const parent = document.querySelector(".list");
parent.addEventListener("click", listInitialsHandler);

function fetchInit() {
  const res = fetch("./data.json")
    .then((data) => data.json())
    .then((data) => {
      return data.forEach((el) => createItem(el));
    });
  return res;
}

function createItem(el) {
  socialWrap = createOne("div", { className: ["soсials"] });
  fNamelName = createOne(
    "p",
    { className: ["list-item_name"] },
    document.createTextNode(
      `${el.firstName || "unknow"} ${el.lastName || "unknow"}`
    )
  );
  background = createOne("p", { className: ["imgNon"] });
  imageWrapper = createOne(
    "div",
    { className: ["list-item_image-wrapper"], numId: el.id },
    background,
    imageHandler(el)
  );
  listItem = createOne(
    "li",
    { className: ["list-item"] },
    imageWrapper,
    fNamelName,
    socialWrap
  );
  soсialsUrlIcons(el);
  parent.append(listItem);
}

function soсialsUrlIcons(el) {
  el.contacts.forEach((elem) => {
    let temp = new Map();
    temp.set(new URL(elem).hostname);
    if (temp.has("www.facebook.com")) {
      temp.set("www.facebook.com", "fa-facebook-f");
    } else if (temp.has("twitter.com")) {
      temp.set("twitter.com", "fa-twitter");
    } else temp.set("www.instagram.com", "fa-instagram");

    icon = createOne("i", {
      className: [temp.get(new URL(elem).hostname), "fab"],
    });
    link = createOne("a", { className: ["soсial"], href: elem }, icon);

    socialWrap.append(link);
  });
}

function createOne(
  type,
  { className = [], numId = null, href = "", path = "" },
  ...children
) {
  const elem = document.createElement(type);
  if (className.length) {
    elem.classList.add(...className);
  }
  if (numId) {
    elem.setAttribute("id", numId);
  }
  if (href.length) {
    elem.href = href;
  }
  elem.src = path;
  elem.append(...children);
  return elem;
}

function imageHandler(el) {
  const elem = createOne("img", {
    className: ["list-item_image"],
    numId: el.id,
    path: el.profilePicture,
  });

  new Promise((resolve, reject) => {
    elem.addEventListener("load", (e) => {
      resolve(e);
    });
    elem.addEventListener("error", (e) => {
      reject(e);
    });
  })
    .then(({ target }) =>
      document.getElementById(target.getAttribute("id")).append(target)
    )
    .catch(({ target }) => {
      const currentElem = target.parentNode.firstChild;
      currentElem.classList.add("list-item_image");
      currentElem.style.backgroundColor = stringToColour(
        el.firstName || el.lastName || "unknow"
      );
      currentElem.append(
        document.createTextNode(
          firstLetter(`${el.firstName || "unknow"} ${el.lastName}`)
        )
      );
      target.remove();
    });
  return elem;
}

const celebrityNames = [];

function listInitialsHandler(e) {
  if (!e.target.closest(".list-item")) {
    return;
  }
  const items = e.target.closest(".list-item").children;
  for (const el of items) {
    if (
      el.classList.contains("list-item_name") &&
      !celebrityNames.includes(el.textContent)
    ) {
      celebrityNames.push(el.textContent);
      const li = document.createElement("li");
      li.textContent = el.textContent;
      e.target.closest(".list-item").parentNode.nextElementSibling.append(li);
    }
  }
}

function stringToColour(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  let colour = "#";
  for (let i = 0; i < 3; i++) {
    let value = (hash >> (i * 8)) & 0xff;
    colour += ("00" + value.toString(16)).substr(-2);
  }
  return colour;
}

function firstLetter(str) {
  return str.split(" ").reduce((acc, el) => {
    acc += el.slice(0, 1);
    return acc.toUpperCase();
  }, "");
}
