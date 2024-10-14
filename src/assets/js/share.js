import { addCheckIcon, toggleModal } from "./domInteractions";

export function shareAction(){
    toggleModal();
}

export function copyAction() {
    const inputElement = document.getElementById("urlInput");
    const inputValue = inputElement.getAttribute("value");

    addCheckIcon();

    navigator.clipboard.writeText(inputValue);
}