import { setMessages, toggleChargeConversationModal, addLoadDots, removeLoadDots, updateLastBotMessage, addMessageToBody, disableForm, enableForm, addInitialMessage } from "./domInteractions";
import { createConversation, getMessages, sleep } from "./messages";

/**
 * 
 * @param {number} conversationId 
 * @param {object} theme
 */
async function handleClickCharge(conversationId, theme, callback) {
    const messages = await getMessages(conversationId, theme);
    toggleChargeConversationModal();
    await setMessages(messages, theme.initialMessage, theme);
}

// Force create conversation
/**
 * 
 * @param {object} theme 
 * @param {string} browserFingerprint 
 */
async function handleClickNotCharge(theme, browserFingerprint, callback) {
    const conversation = await createConversation(theme.botId, browserFingerprint, [], true);
    callback(conversation.conversationId)
    toggleChargeConversationModal();
    await addInitialMessage(theme);

}

/**
 * 
 * @param {number} conversationId 
 * @param {object} theme
 */
export async function prepareChargeConversation(conversationId, theme, browserFingerprint, callback) {
    const buttonAfirmation = document.getElementById("charge_conversation_button");
    const buttonNegation = document.getElementById("not_charge_conversation_button"); 

    buttonAfirmation.addEventListener("click", () => handleClickCharge(conversationId, theme, callback));
    buttonNegation.addEventListener("click", () => handleClickNotCharge(theme, browserFingerprint, callback));
}
