const apiUrl = process.env.VITE_API_MESSENGER;

export async function getTheme(){
    const urlParams = new URLSearchParams(window.location.search);
    const slug = urlParams.get('slug') || "bot_alkeeper";
    const items = {}
    urlParams.forEach((value, key) => {
      items[key] = value;
    });

    const preview = urlParams.get("preview");


    if (preview) {
        items["initialMessage"] = items["initialMessage"] ? items["initialMessage"]  :"Hola, esto es una prueba";
        return items;
    }


    
    const response = await fetch(`${apiUrl}/api/bots/${slug}/theme`);
    const data = await response.json();
    

    return data;
}