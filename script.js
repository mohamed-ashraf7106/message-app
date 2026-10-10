let navElements = [document.querySelectorAll("nav i")];
navElements = navElements[0];
Array.from(navElements).forEach((e) => {
  e.addEventListener("click", () => {
    Array.from(navElements).forEach((n) => {
      n.classList.remove("active");
    });
    e.classList.add("active");
  });
});
let menus = [document.querySelectorAll(".menus i")];
menus = menus[0];
Array.from(menus).forEach((e) => {
  e.addEventListener("click", () => {
    Array.from(menus).forEach((n) => {
      n.classList.remove("active");
    });
    e.classList.add("active");
  });
});
let parentSearch = [document.querySelector(".search div")];
parentSearch = parentSearch[0];
let searchInput = [document.querySelector(".search input")];
searchInput = searchInput[0];
parentSearch.addEventListener("click", () => {
  parentSearch.classList.add("active");
  searchInput.focus();
});
document.addEventListener("click", (e) => {
  if (!parentSearch.contains(e.target)) {
    parentSearch.classList.remove("active");
  }
});
let sent = {};
if (localStorage.getItem("sent")) {
  sent = JSON.parse(localStorage.getItem("sent"));
}
let msgs = {};
let people = document.getElementsByClassName("people")[0];
let myusers = fetch("https://jsonplaceholder.typicode.com/users");
let persons = [];
let chat = document.getElementById("chat");
let loading = document.getElementsByClassName("load")[0];
let contacts = document.getElementsByClassName("contacts")[0];
myusers
  .then((data) => {
    return data.json();
  })
  .then((data) => {
    let mypics = fetch("https://jsonplaceholder.typicode.com/photos?_limit=10");
    mypics
      .then((d) => d.json())
      .then((pics) => {
        let recieved = fetch("https://jsonplaceholder.typicode.com/todos");
        recieved
          .then((e) => e.json())
          .then((e) => {
            loading.remove();
            for (let user = 0; user < data.length; user++) {
              msgs[`${data[user].id}`] = [];
            }
            if (!sent) {
              for (let user = 0; user < data.length; user++) {
                sent[`${data[user].id}`] = [];
              }
            }
            for (let i = 0; i < e.length; i++) {
              msgs[`${e[i].userId}`].push(`${e[i].title}`);
            }
            console.log(msgs);
            localStorage.setItem("incoming", JSON.stringify(msgs));
            for (let user = 1; user <= data.length; user++) {
              let lastMsg = msgs[`${user}`][msgs[`${user}`].length - 1];
              if (lastMsg.length >= 28) {
                lastMsg = lastMsg.slice(0, 28);
                lastMsg += "...";
              }
              let person = document.createElement("div");
              person.innerHTML = `
                 <div class="person">
                    <img src="${pics[user - 1].thumbnailUrl}" alt="">
                    <div class="info">
                      <div class="name">${data[user - 1].username}</div>
                      <div class="lastMsg">${lastMsg}</div>
                    </div>
                    <div class="time">
                      12:00 AM
                    </div>
                  </div>
              `;
              people.appendChild(person);
              persons.push(person);
            }
            persons.forEach((p, i) => {
              p.addEventListener("click", (e) => {
                persons.forEach((pe) => {
                  pe.classList.remove("active");
                });
                p.classList.add("active");
                chat.innerHTML = ``;
                let current = document.createElement("div");
                current.innerHTML = `
                    <div class="current">
                      <img src="${pics[i].thumbnailUrl}" alt="">
                      <p>${data[i].username}</p>
                      <i class="fa-solid fa-arrow-left back"></i>
                    </div>
                 `;

                current.style.position = "sticky";
                current.style.top = "0px";
                current.style.zIndex = "9999";
                current.style.backgroundColor = "#161717";
                chat.style.display = "block";
                chat.appendChild(current);
                let messages = document.createElement("div");
                messages.classList.add("messages");
                if (window.innerWidth <= 780) {
                  contacts.style.display = "none";
                }
                msgs[i + 1].forEach((msg) => {
                  let ms = document.createElement("div");
                  ms.innerHTML = `
                      <div class="incoming">${msg}</div>
                    `;
                  messages.append(ms);
                });
                console.log(sent);

                if (sent != {}) {
                  console.log("here");
                  console.log(sent);

                  sent[i + 1].forEach((msg) => {
                    let ms = document.createElement("div");
                    ms.innerHTML = `
                      <div class="message">${msg}</div>
                    `;
                    messages.append(ms);
                  });
                }
                chat.append(messages);
                let inpt = document.createElement("div");
                inpt.innerHTML = `        
                  <input type="text" name="draft" id="send">
                  <i class="fa-regular fa-paper-plane submit"></i>
                  `;
                inpt.classList.add("input");
                inpt.style.width = `${chat.offsetWidth}px`;
                window.addEventListener("resize", () => {
                  inpt.style.width = `${chat.offsetWidth}px`;
                  if (window.innerWidth <= 780) {
                    chat.style.marginTop = "0px";
                  } else {
                    contacts.style.display = "block";
                    contacts.classList.remove("hide");
                  }
                });
                chat.append(inpt);
                let submit = document.getElementsByClassName("submit")[0];
                let draft = document.getElementsByName("draft")[0];
                submit.addEventListener("click", () => {
                  if (draft.value != "") {
                    console.log(draft.value);
                    sent[i + 1].push(draft.value);
                    console.log(sent);
                    let ms = document.createElement("div");
                    ms.innerHTML = `
                      <div class="message">${draft.value}</div>
                    `;
                    draft.value = "";
                    messages.append(ms);
                    messages.scrollTo({
                      top: messages.scrollHeight,
                      behavior: "smooth",
                    });
                    localStorage.setItem("sent", JSON.stringify(sent));
                  }
                });
                inpt.addEventListener("keydown", (event) => {
                  if (event.key === "Enter") {
                    if (draft.value != "") {
                      console.log(draft.value);
                      sent[i + 1].push(draft.value);
                      console.log(sent);
                      let ms = document.createElement("div");
                      ms.innerHTML = `
                      <div class="message">${draft.value}</div>
                    `;
                      draft.value = "";
                      messages.append(ms);
                      messages.scrollTo({
                        top: messages.scrollHeight,
                        behavior: "instant",
                      });
                      localStorage.setItem("sent", JSON.stringify(sent));
                    }
                  }
                });
                let back = document.getElementsByClassName("back")[0];
                messages.scrollTo({
                  top: messages.scrollHeight,
                  behavior: "smooth",
                });
                console.log(submit);

                back.addEventListener("click", (e) => {
                  chat.style.display = "none";
                  contacts.style.display = "block";
                });
              });
            });
          })
          .catch((e) => {
            loading.innerHTML = `error retreiving data please try again later \n
            ${e}
          `;
            console.log(e);
          });
      })
      .catch((e) => {
        loading.innerHTML = `error retreiving data please try again later \n
            ${e}
          `;
        console.log(e);
      });
  })
  .catch((e) => {
    loading.innerHTML = `error retreiving data please try again later \n
            ${e}
          `;
    console.log(e);
  });
