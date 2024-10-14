import { getTheme } from "./theme";
import { addMessageToBody, scroll, disableForm, addDisplayName, clearInput, openAIError, themeError, addLoadDots, removeLoadDots, updateLastBotMessage, enableForm, addShareAction, setMessages, addInitialLoad, removeInitialLoad, toggleChargeConversationModal, addInitialMessage } from "./domInteractions";
import { createConversation, getMessages, sendMessage, sleep } from "./messages";
import { checkStatus } from "./openAI";
import { fingerprint } from "./fingerprint";
import { prepareChargeConversation } from "./chargeConversations";

const AFTER_LEAD_MESSAGE = "Perfecto! Contame en qué puedo ayudarte?";

// API - Mapply
const versionBuild = process.env.VITE_BUILD_VERSION || "";
const apiUrl = process.env.VITE_API_MESSENGER || "";

let listeners = {};

function addEvents(element, typeEvent, callback) {
  if (!listeners[element]) {
    listeners[element] = {};
  }

  if (!listeners[element][typeEvent]) {
    listeners[element][typeEvent] = [];
  }

  // Almacena la función manejadora
  listeners[element][typeEvent].push(callback);

  // Agrega el eventListener al elemento
  element.addEventListener(typeEvent, callback);
}

function removeEvents(element, typeEvent) {
  if (listeners[element] && listeners[element][typeEvent]) {
    listeners[element][typeEvent].forEach(function (callback) {
      element.removeEventListener(typeEvent, callback);
    });

    // Limpia la lista de eventListeners para ese tipo de evento
    listeners[element][typeEvent] = [];
  }

}


/**
 * 
 * @param {SubmitEvent} e 
 * @param {object[]} requestLeads 
 */
export async function handleSubmitRequestLeads(e, requestLeads, theme, preview, requestLeadsResponses = []){
  e.preventDefault();
  const sendButton = document.getElementById("send_button");
  const inputElement = document.getElementById("question");
  const browserFingerprint = await fingerprint();
  // request_type how key: 

  sendButton.setAttribute("disabled", true)
  inputElement.setAttribute("disabled", true)

  const message = e.target[0].value

  clearInput();
  addMessageToBody(
    message, 
    true, 
    theme.userBubbleBackgroundColor,
    theme.userBubbleTextColor
  );

  requestLeadsResponses[requestLeadsResponses.length - 1]["answer"] = message;
  
  scroll();
  const formChat = document.getElementById("form_chat");
  const requestItem = requestLeads.shift();
  

  if (requestItem) {
    addMessageToBody(
      "",
      false,
      theme.botBubbleBackgroundColor,
      theme.botMessageIcon,
      theme.botBubbleTextColor
    );

    addLoadDots();
    scroll();
    await sleep(1000);
    removeLoadDots();
    await updateLastBotMessage(requestItem.question);

    requestLeadsResponses.push(requestItem);
    
  }else {
    addMessageToBody(
      "",
      false,
      theme.botBubbleBackgroundColor,
      theme.botMessageIcon,
      theme.botBubbleTextColor
    );

    scroll();
    addLoadDots();
    await sleep(500);
    removeLoadDots();

    await updateLastBotMessage(AFTER_LEAD_MESSAGE);
    scroll();

    
    removeEvents(formChat, "submit");
    
    const conversationRes = preview ? 1 : await createConversation(theme.botId, browserFingerprint, requestLeadsResponses, false);

    theme["conversationId"] = conversationRes.conversationId;

    addEvents(formChat, "submit", (ev) => {
      handleSubmit(ev, theme);
    });
  }

  enableForm();
}

export async function handleSubmit(e, theme){
    e.preventDefault();
    const sendButton = document.getElementById("send_button");
    const inputElement = document.getElementById("question")

    sendButton.setAttribute("disabled", true);
    inputElement.setAttribute("disabled", true);

    const message = e.target[0].value

    clearInput();
    addMessageToBody(
      message, 
      true, 
      theme.userBubbleBackgroundColor,
      theme.userBubbleTextColor
    );
    
    
    addMessageToBody(
      "", 
      false, 
      theme.botBubbleBackgroundColor,
      theme.botMessageIcon,
      theme.botBubbleTextColor
    );

    // Scroll automatico
    const rootElement = document.getElementById("scrollable");
    const elementSroll = new SimpleBar(rootElement)
    const elementContainer = document.getElementsByClassName("simplebar-placeholder")[0]
    elementSroll.getScrollElement().scrollTo(0, parseInt(elementContainer.style.height))

    await sendMessage(message, theme.botId, theme.conversationId, theme.theme);
    enableForm();
}

export async function prepare(){
  
  try { 
    const urlParams = new URLSearchParams(window.location.search);
    const preview = urlParams.get("preview");
    const conversationIdParam = urlParams.get("conversation_id");
    addInitialLoad();
    const browserFingerprint = await fingerprint(); 

    const theme = await getTheme()

    function updateThemeConversationId(conversationId) {
      theme["conversationId"] = conversationId;
    }
    
    const messages = conversationIdParam ? await getMessages(conversationIdParam, theme) : [];

    const requestLeads = await getInitialLeads(browserFingerprint);
    
    // Get html element & set theme 
    const rootElement = document.getElementById("root_parent");
    rootElement.setAttribute("data-mode", theme.theme);
    const sendButton = document.getElementById("send_button");
    sendButton.classList.add(`${theme.botBubbleBackgroundColor}`);
    const formChat = document.getElementById("form_chat");

    addDisplayName(theme.displayName, theme.icon)
    
    const faviconElement = document.getElementById("favicon_icon")
    faviconElement.setAttribute("href", theme.icon);
    
    const hasMessages = messages.length > 0; 
    

    if (requestLeads.length > 0){
      const firstRequestLead = requestLeads.shift();
      const requestLeadsResponses = [firstRequestLead];
      
      addMessageToBody(
        "",
        false,
        theme.botBubbleBackgroundColor,
        theme.botMessageIcon,
        theme.botBubbleTextColor
      );

      addLoadDots();
      await sleep(500);
      removeLoadDots();
      updateLastBotMessage(firstRequestLead.question);
      

      addEvents(formChat, "submit", (e) => {
        handleSubmitRequestLeads(e, requestLeads, theme, preview, requestLeadsResponses);
      });

    }else {
      let conversationRes;
      if (messages.length == 0) {
        conversationRes = await createConversation(theme.botId, browserFingerprint, [], true);
        theme["conversationId"] = conversationRes.conversationId;
        // if (!conversationRes.new) {
        //   await prepareChargeConversation(conversationRes.conversationId, theme, browserFingerprint, updateThemeConversationId);
        //   toggleChargeConversationModal();
        // }
        addInitialMessage(theme)
      }else {
        updateThemeConversationId(conversationIdParam)
        !hasMessages && addInitialMessage(theme);
        await setMessages(messages, theme.initialMessage, theme);
        
      }
      
      addEvents(formChat, "submit", (e) => {
        handleSubmit(e, theme);
      });
      scroll();
    }

    removeInitialLoad()


    if (preview){
      disableForm();
      addMessageToBody(
        "Hola",
        true,
        theme.userBubbleBackgroundColor,
        null,
        theme.userBubbleTextColor
      )
    }
    !preview && enableForm();

    // set version build:
    const versionContainer = document.getElementById("version_build")
    versionContainer.innerText = versionBuild.length > 0 ? `Versión ${versionBuild}`: ""
    
    addShareAction(theme.theme, theme.botBubbleBackgroundColor, theme["conversationId"]);
    await checkStatus(openAIError);
  }catch(e) {
    themeError();
  }
}

export async function getInitialLeads(browserFingerprint){
  try{
    const urlParams = new URLSearchParams(window.location.search);
    const slug = urlParams.get("slug") || "bot_alkeeper";

    if (slug) {
      const responseLeads = await fetch(`${apiUrl}/api/bots/initial_questions?slug=${slug}&fingerprint=${browserFingerprint}`, {
        headers: {
          accept: "application/json"
        }
      });

      const dataLeads = await responseLeads.json(); 
      return dataLeads;
    }

  }catch(error) {
    console.log({error});
    return []
  }
}


