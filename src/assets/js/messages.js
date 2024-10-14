import { addLoadDots,scroll, removeLoadDots, addMessageId, addRatingActions, generatePreview } from "./domInteractions";
import { fingerprint } from "./fingerprint";

const apiUrl = process.env.VITE_API_MESSENGER;

function parseRequestLeadsResponses(requestLeadsResponses) {
  const parsedItem = {};
  requestLeadsResponses.forEach(item => {
    parsedItem[item.request_type] = item.answer;
  });

  return parsedItem;
}

export async function createConversation(botId, deviceId, requestLeadsResponses = [], force = false) {
  try{
    const parsedLeadsResponses = parseRequestLeadsResponses(requestLeadsResponses);
    const responseConversation = await fetch(`${apiUrl}/api/chats/init`, {
      method: "POST",
      body: JSON.stringify({
        bot_id: botId,
        lead_email: parsedLeadsResponses?.["email"] || "",
        lead_name: parsedLeadsResponses?.["name"]|| "",
        lead_device_id: deviceId,
        extra_data: parsedLeadsResponses,
        force_init: force
      }),
      headers: {
        "content-type": "application/json"
      }
    });

    if (responseConversation.status !== 201) throw new Error("Bot no encontrado")

    const dataConversation = await responseConversation.json()
    
  
    return {
      conversationId: dataConversation.conversation_id,
      new: dataConversation.new
    };
  }catch(e){
    throw new Error("Error al generar la conversación")
  }
}

// ==========================
export async function sendMessage(message, botId, conversationId = 1, theme ="light", requestLeads){
  try {
    const container = document.getElementsByClassName("ia_message");
    const element = container[container.length -1];

    addLoadDots();
    
    const deviceId = await fingerprint();
    const response = await fetch(apiUrl + "/api/chats/message",{
      method: "POST",
      body: JSON.stringify({
        "bot_id": botId,
        "conversation_id": conversationId,
        "lead_device_id": deviceId,
        "question": message,
        "stream": 1
      }),
      headers: {
      "content-type": "application/json",
      "accept": "text/plain"
      }
    });

    if (!response.ok) {
      throw new Error(`Error al realizar la solicitud: ${response.status}`);
    }
    
    const stream = response.body;
    const reader = stream.getReader();
    let texto = '';
    const decoder = new TextDecoder()
    let buffer = [];
    const bufferSize = 40; 
    
    try {
      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          // El stream ha terminado
          const replacedElement = document.createElement("div");
          
          removeLoadDots();

          // loadElement.replaceWith(provisoryElement);
          await processBuffer(buffer, decoder);
          const urlTextParsed = await parseUrl(texto);
          const newTextParsed = await parseCode(urlTextParsed)
          replacedElement.innerHTML = newTextParsed;
          element.replaceChildren(replacedElement);
          scroll();
          
          const responseLastMessage = await fetch(`${apiUrl}/api/chats/last_message?` + new URLSearchParams({
            conversation_id: conversationId,
            device_id: deviceId
          }));

          const lastMessage = await responseLastMessage.json();
          
          addMessageId(lastMessage.id, theme);

          addRatingActions(conversationId, botId, lastMessage.id);
          scroll();

          break;
        }
        
        texto += decoder.decode(value);

        texto = texto.replace(/\n/g, "<br>")
        
        if (buffer.length > bufferSize) {
          removeLoadDots();

          await processBuffer(buffer, decoder);
          addLoadDots();
          buffer = [];
        }

        buffer.push(value);

      }
        
    } catch (error) {
      console.error(`Error al leer el stream: ${error}`);
      throw new Error("Error al leer el stream")
    } finally {
      reader.releaseLock();
    }

    return texto;
    
  } catch(error){
    console.log({error});
    throw new Error("Error")
  }
}

export async function parseUrl(text) {
  const urlRegex = /[([]?\s*(https?:\/\/[^\s)\]]+)\s*[)\]]?/g;
  const matchResult = text.matchAll(urlRegex);
  const urlIndex = [...matchResult]

  for (let i in urlIndex) {
    const item = urlIndex[i];
    const containBr = item[0].includes("<br>");
    const link = item[0].replace("(", "").replace(")", "").split("<br>")[0].trim();
    
    const parsedPreview = await fetch(`${apiUrl}/api/chats/parse_url?url=${link}`);
    const parsedData = await parsedPreview.json();

    text = text.replace(link, `${generatePreview(parsedData.image, parsedData.url)}${containBr ? "<br>" : ""}`);
  }

  return text
}

/**
 * 
 * @param {string} text 
 */
export function parseCode(text){
    const regexCode = /```python([\s\S]*?)```/g
    const matchText = text.matchAll(regexCode)
    const texts = [...matchText]

    texts.forEach((codeMatch) => {
      const itemWithoutBr = codeMatch[1].replace(/<br>/g, "\n")
      const codeText = `
        <div class="code_block">
          <pre class="prettyprint lang-py">
            <code class="prettyprint python language-python lang-py">
              ${itemWithoutBr}
            </code>
          </pre>
        </div>`
  
      text = text.replace(codeMatch[0], codeText)

    })

    const globalRegex = /```([\s\S]*?)```/g
    const matchParams = text.matchAll(globalRegex)

    const newTexts = [...matchParams]

    newTexts.forEach((markdownMatch) => {
      const itemWithoutBr = markdownMatch[1].replace(/<br>/g, "\n")
      const codeText = `
        <div class="code_block">
          <pre class="prettyprint lang-py">
            <code class="python language-python lang-py">
              ${itemWithoutBr}
            </code>
          </pre>
        </div>`
  
      text = text.replace(markdownMatch[0], codeText)
    })
    
    return text
}

async function processBuffer(buffer, decoder){
  const container = document.getElementsByClassName("ia_message")
  const element = container[container.length -1];
  
  while (buffer.length > 0){
    const value = buffer.shift();
    let text = decoder.decode(value);

    text = text.replace(/\n/g, "<br>")
    
    element.innerHTML += text;

    scroll();
    await sleep(50);
  }
}

/**
 * 
 * @param {string} bufferMessages 
 */
export async function* makeGeneratorWithString(bufferMessages) {
  for (let char of bufferMessages){
    yield char;
    await sleep(20);
  }
}



export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function getMessages(conversationId){
  try {
    const response = await fetch(`${apiUrl}/api/conversations/all_messages?conversation_id=${conversationId}`);

    const data = await response.json();

    
    return data.messages;
  }catch(error) {
    console.log({error});
    return []
  }
}
