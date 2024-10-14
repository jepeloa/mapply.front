import { makeGeneratorWithString, parseUrl, sleep } from "./messages";
import { copyAction, shareAction } from "./share";

const apiUrl = process.env.VITE_API_MESSENGER;

export async function addMessageToBody(
  message,
  isUser = true,
  bgColor = "bg-violet-500",
  icon = null,
  textColor = "text-white"
) {
  const htmlToSend = `
    <div class="flex items-end gap-3">
      <div>
          <img src=${icon} alt="" class="rounded-full h-9 w-9">
      </div>

      <div class="w-80 md:w-full">
        <div class="flex gap-2 mb-2 md:w-full" id="chat_container">
            <div class="relative px-5 py-3 ${textColor} rounded-lg ltr:rounded-bl-none rtl:rounded-br-none ${bgColor} md:w-full" name="message_container">
                <p class="mb-0 ia_message" style="overflow-wrap: anywhere;">
                    ${message}
                </p>

            </div>
            
        </div>
      </div>
    </div>`;

  const htmlToSendUser = `
    <div class="relative inline-flex items-end mb-6 text-right ltr:rtl:float-left ltr:float-right rtl:float-left md:w-full">
      <div class="order-3 mr-0 ltr:ml-4 rtl:mr-4">
          <img src="assets/images/users/default-avatar.png" alt="" class="rounded-full h-9 w-9">
      </div>

      <div class="w-80 md:w-full">
        <div class="flex gap-2 mb-2 ltr:justify-end rtl:justify-start md:w-full">
            <div class="relative order-2 px-5 py-3 ${textColor} rounded-lg ltr:rounded-br-none rtl:rounded-bl-none ${bgColor} md:w-full">
                <p class="mb-0">
                    ${message}
                </p>
            </div>
        </div>

      </div>
    </div>`;

  const chatContainer = document.getElementById("chat_container");
  const add = document.createElement("li");
  add.classList.add("clear-both");
  add.classList.add("py-4");
  add.classList.add("message-container");

  add.innerHTML = isUser ? htmlToSendUser : htmlToSend;

  chatContainer.appendChild(add);
}

export async function updateLastBotMessage(message) {
  const container = document.getElementsByClassName("ia_message");
  const element = container[container.length - 1];
  const iter = makeGeneratorWithString(message);

  for await (let char of iter) {
    element.innerHTML += char;
  }
}

export function scroll() {
  const rootElement = document.getElementById("scrollable");
  const elementSroll = new SimpleBar(rootElement);
  const elementContainer = document.getElementsByClassName(
    "simplebar-placeholder"
  )[0];
  elementSroll
    .getScrollElement()
    .scrollTo(0, parseInt(elementContainer.style.height));
}

export function addDisplayName(name = "Default", icon = null) {
  const displayNameContainer = document.getElementById("display_name");
  const displayElement = document.createElement("a");
  displayElement.classList.add("text-gray-800");
  displayElement.classList.add("dark:text-gray-50");
  displayElement.innerHTML = name;
  displayNameContainer.appendChild(displayElement);

  const pointElement = document.createElement("i");
  pointElement.classList.add("text-green-500");
  pointElement.classList.add("ltr:ml-1");
  pointElement.classList.add("rtl:mr-1");
  pointElement.classList.add("ri-record-circle-fill");
  pointElement.classList.add("text-10");

  const botIcon = document.getElementById("bot_icon");
  botIcon.setAttribute("src", icon);

  displayNameContainer.appendChild(pointElement);
}

export function clearInput() {
  const inputElement = document.getElementById("question");
  inputElement.value = "";
}

export function addInitialLoad() {
  const element = document.getElementById("loading-dots");
  element.style.display = "block";
}

export function removeInitialLoad() {
  const element = document.getElementById("loading-dots");
  element.style.display = "none";
}

export function addLoadDots() {
  const animatedDots = `
        <p class="w-1 h-1 mb-1 bg-white rounded-full dot animate-bounce"></p>
        <p class="w-1 h-1 mb-1 bg-white rounded-full dot-2 "></p>
        <p class="w-1 h-1 mb-1 bg-white rounded-full dot-3 animate-bounce"></p>
    `;

  const container = document.getElementsByClassName("ia_message");
  const element = container[container.length - 1];

  const loadClasses = [
    "animate-typing",
    "gap-0.5",
    "flex",
    "items-end",
    "pt-1",
  ];
  const loadElement = document.createElement("div");

  loadClasses.forEach((classItem) => {
    loadElement.classList.add(classItem);
  });

  loadElement.setAttribute("id", "animated_dots");
  loadElement.innerHTML = animatedDots;

  element.appendChild(loadElement);
}

export function removeLoadDots() {
  const provisoryElement = document.createDocumentFragment();
  const loadElement = document.getElementById("animated_dots");

  loadElement.replaceWith(provisoryElement);
}

export function openAIError() {
  const inputElement = document.getElementById("question");
  inputElement.setAttribute("disabled", true);

  const buttonSend = document.getElementById("send_button");
  buttonSend.setAttribute("disabled", true);

  const openAIContainer = document.getElementById("openai_error");

  const classlist = [
    "bg-red-100",
    "h-9",
    "p-2",
    "mb-4",
    "flex",
    "justify-center",
    "text-gray-500",
    "text-xs",
    "items-center",
  ];

  classlist.forEach((item) => {
    openAIContainer.classList.add(item);
  });

  const pElement = document.createElement("p");
  openAIContainer.innerHTML = `<svg class="fill-current h-6 w-6 text-red-400 mr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z"/></svg>`;

  pElement.innerText = "TEMPORALMENTE FUERA DE SERVICIO";

  openAIContainer.appendChild(pElement);
}

export function themeError() {
  const inputElement = document.getElementById("question");
  inputElement.setAttribute("disabled", true);

  inputElement.setAttribute("placeholder", "Error");

  const buttonSend = document.getElementById("send_button");
  buttonSend.setAttribute("disabled", true);

  const sendButton = document.getElementById("send_button");
  sendButton.classList.add(`bg-red-500`);

  addDisplayName("Error");

  addMessageToBody(
    "Bot no encontrado",
    false,
    "bg-red-500",
    "/assets/images/users/default-avatar.png"
  );
}

export function disableForm() {
  const buttonSend = document.getElementById("send_button");
  buttonSend.setAttribute("disabled", true);
  const inputElement = document.getElementById("question");
  inputElement.setAttribute("disabled", true);
}

export function enableForm() {
  const buttonSend = document.getElementById("send_button");
  buttonSend.removeAttribute("disabled");

  const inputElement = document.getElementById("question");
  inputElement.removeAttribute("disabled");
  inputElement.focus();
}

export function focusInput() {
  const inputElement = document.getElementById("question");
  inputElement.focus();
}

/**
 *
 * @param {string} messageId
 */
export function addMessageId(messageId, theme = "light") {
  const containers = document.getElementsByClassName("message-container");
  // add id on the last item:
  const lastItem = containers[containers.length - 1];
  lastItem.setAttribute("id", `message_${messageId}`);

  const buttonContainer = document.createElement("div");

  buttonContainer.classList.add("w-full");
  buttonContainer.classList.add("h-9");
  buttonContainer.classList.add("flex");
  buttonContainer.classList.add("justify-end");

  const iconStyleColor = theme == "light" ? "#000" : "#fff";
  const borderButton = theme == "light" ? "border-gray-500" : "border-white";

  buttonContainer.innerHTML += `
        <button class="like-button rounded-full border-solid border-2 ${borderButton} h-9 w-9 flex justify-center items-center" id="button-like-answer-${messageId}">
            <i id="like-icon-${messageId}" class="fa-solid fa-thumbs-up" aria-hidden="true" style="color:${iconStyleColor};"></i>
        </button>
    `;
  buttonContainer.innerHTML += `
        <button class="dislike-button rounded-full border-solid border-2 ${borderButton} h-9 w-9 flex justify-center items-center ml-2" id="button-dislike-answer-${messageId}">
            <i id="dislike-icon-${messageId}" class="fa-solid fa-thumbs-down" aria-hidden="true" style="color:${iconStyleColor};"></i>
        </button>
    `;

  lastItem.appendChild(buttonContainer);
}

export function addRatingActions(conversationId, botId, messageId) {
  const buttonLike = document.getElementById(`button-like-answer-${messageId}`);
  const buttonDislike = document.getElementById(
    `button-dislike-answer-${messageId}`
  );

  buttonLike.addEventListener("click", async () => {
    await ratingAnswer(1, conversationId, botId, messageId);
  });

  buttonDislike.addEventListener(
    "click",
    async () => await ratingAnswer(0, conversationId, botId, messageId)
  );
}

export function generatePreview(imageUrl, url) {
  const urlParams = new URLSearchParams(window.location.search);

  const slug = urlParams.get("slug");

  const isMapply = slug == "bot_mapply";
  return `
        <a ${
          imageUrl ? `href=${url} target="_blank"` : ""
        } class="font-bold italic link_items">
            <div id="preview_container">
                <div class="border-top border-"></div>
                ${
                  !isMapply
                    ? `<img src="${
                        imageUrl ? imageUrl : "assets/images/not-found.jpeg"
                      }" alt="#" class="rounded mt-2 mb-2 ">`
                    : ""
                }
                ${url}
            </div>
        </a>
    `;
}

async function ratingAnswer(rating, conversationId, botId, messageId) {
  const buttonLike = document.getElementById(`button-like-answer-${messageId}`);
  const buttonDislike = document.getElementById(
    `button-dislike-answer-${messageId}`
  );
  const likeIcon = document.getElementById(`like-icon-${messageId}`);
  const dislikeIcon = document.getElementById(`dislike-icon-${messageId}`);

  const iconColorLike = "text-blue-500";
  const iconColorDislike = "text-red-500";

  try {
    if (rating == 0) {
      buttonDislike.classList.toggle("clicked");
      dislikeIcon.classList.toggle(iconColorDislike);
      likeIcon.classList.remove(iconColorLike);
    } else {
      buttonLike.classList.toggle("clicked");
      likeIcon.classList.toggle(iconColorLike);
      dislikeIcon.classList.remove(iconColorDislike);
    }

    const response = await fetch(`${apiUrl}/api/chats/message/rating`, {
      method: "POST",
      body: JSON.stringify({
        conversation_id: conversationId,
        rating: rating,
        bot_id: botId,
        message_id: messageId,
      }),
      headers: {
        "content-type": "application/json",
        accept: "application/json",
      },
    });

    const data = await response.json();
  } catch (error) {
    buttonLike.classList.remove("clicked");
    buttonDislike.classList.remove("clicked");
    likeIcon.classList.remove(iconColorLike);
    dislikeIcon.classList.remove(iconColorDislike);
  } finally {
    // Agregar un event listener para animationend
    buttonLike.addEventListener(
      "animationend",
      function () {
        buttonLike.classList.remove("clicked");
        buttonDislike.classList.remove("clicked");
      },
      { once: true }
    );
  }
}

/**
 *
 * @param {string} theme
 * @param {string} bgColor
 * @param {number} conversationId
 */
export function addShareAction(theme, bgColor, conversationId) {
  const copyButtonClasses = [
    bgColor,
    "rounded-full",
    "pt-2",
    "pb-2",
    "pr-3",
    "pl-3",
  ];

  const shareContainerClasses = ["flex", "justify-between"];

  const iconClasses = ["fa-solid", "fa-share"];

  const buttonClasses = [
    "mr-2",
    "pt-2",
    "pb-2",
    "pr-3",
    "pl-3",
    "rounded-full",
    "border-solid",
    "border-2",
    bgColor,
  ];

  const urlParams = new URLSearchParams(window.location.search);

  const slugParam = urlParams.get("slug") || "bot_error";

  const copyButtonElement = document.getElementById("copy-button");
  copyButtonElement.style.color = "#fff";

  copyButtonClasses.forEach((item) => {
    copyButtonElement.classList.add(item);
  });

  copyButtonElement.addEventListener("click", copyAction);

  const buttonShareElement = document.createElement("button");

  buttonShareElement.addEventListener("click", shareAction);

  buttonClasses.forEach((item) => {
    buttonShareElement.classList.add(item);
  });

  const inputElement = document.getElementById("urlInput");

  inputElement.setAttribute(
    "value",
    `${window.location.host}?slug=${slugParam}&conversation_id=${conversationId}`
  );

  const iconShareElement = document.createElement("i");

  iconShareElement.style.color = "#fff";

  iconClasses.forEach((item) => {
    iconShareElement.classList.add(item);
  });

  buttonShareElement.appendChild(iconShareElement);

  const shareContainer = document.getElementById("share-container");

  shareContainerClasses.forEach((item) => {
    shareContainer.classList.add(item);
  });

  shareContainer.appendChild(buttonShareElement);

  const buttonCloseModal = document.getElementById("closeModal");
  buttonCloseModal.addEventListener("click", toggleModal);
}

export function addCopyIcon() {
  const copyIconClasses = ["fa-solid", "fa-copy"];

  // copy button:
  const container = document.getElementById("copy-button");

  // create element && add classes:
  const copyIconElement = document.createElement("i");
  copyIconClasses.forEach((item) => {
    copyIconElement.classList.add(item);
  });

  // delete innerHTML & add new icon:
  container.innerHTML = "";
  container.appendChild(copyIconElement);
}

export async function addInitialMessage(theme) {
  addMessageToBody(
    "",
    false,
    theme.botBubbleBackgroundColor,
    theme.botMessageIcon,
    theme.botBubbleTextColor
  );

  disableForm();
  addLoadDots();
  await sleep(500);
  removeLoadDots();
  updateLastBotMessage(theme.initialMessage);
  await sleep(1000);
  enableForm();
}

export function toggleModal() {
  const modal = document.getElementById("openModal");
  modal.classList.toggle("showModal");
}

export function toggleChargeConversationModal() {
  const modal = document.getElementById("openModalChargeConversation");
  modal.classList.toggle("showModal");
}

export function addCheckIcon() {
  const checkIconClasses = ["fa-solid", "fa-check"];

  const checkIcon = document.createElement("i");
  checkIcon.style.color = "#fff";

  checkIconClasses.forEach((item) => {
    checkIcon.classList.add(item);
  });

  const copyButton = document.getElementById("copy-button");

  copyButton.innerHTML = "";

  copyButton.appendChild(checkIcon);

  setTimeout(() => {
    addCopyIcon();
  }, 1000);
}

/**
 *
 * @param {object[]} messages
 * @param {string} initialMessage
 * @param {object} theme
 */
export async function setMessages(messages, initialMessage, theme) {
  addMessageToBody(
    initialMessage,
    false,
    theme.botBubbleBackgroundColor,
    theme.botMessageIcon,
    theme.botBubbleTextColor
  );

  for (let index in messages) {
    addMessageToBody(
      messages[index].question,
      true,
      theme.userBubbleBackgroundColor,
      "/assets/images/users/default-avatar.png",
      theme.userBubbleTextColor
    );

    addMessageToBody(
      messages[index].answer,
      false,
      theme.botBubbleBackgroundColor,
      theme.botMessageIcon,
      theme.botBubbleTextColor
    );
    addMessageId(messages[index]?.id, theme.theme);
    addRatingActions(
      theme["conversationId"],
      theme["botId"],
      messages[index]?.id
    );

    const newText = await parseUrl(messages[index].answer);
    replaceLastElement(newText);
    scroll();
  }
}

/**
 *
 * @param {string} newText
 */
export function replaceLastElement(newText) {
  const container = document.getElementsByClassName("ia_message");
  const element = container[container.length - 1];

  const replacedElement = document.createElement("div");

  replacedElement.innerHTML = newText;

  element.replaceChildren(replacedElement);
  scroll();
}
