import type { Overview } from "../wc-class";

export function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;

        reader.readAsDataURL(file);
    });
}

export function base64ToFile(base64: string, filename?: string, type?: string): File {
    const arr = base64.split(",");
    const mime = type || arr[0].match(/:(.*?);/)?.[1] || "application/octet-stream";
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename ?? '', { type: mime });
}

export const injectHtml = (document: ShadowRoot, overViewData: Overview) => {
    const acomodationSection = document.querySelector("#acomodation") as HTMLDivElement;
    acomodationSection.innerHTML = /*html*/`
    <div id="acomodation" class="space-y-3" >
        ${sectionMarkup("Property Name", overViewData.acomodation.name)}
        ${sectionMarkup("Address", overViewData.acomodation.address)}
        ${sectionMarkup("Property Type", overViewData.acomodation.type)}
    </div>`
    const ownerSection = document.querySelector("#owner") as HTMLDivElement;
    ownerSection.innerHTML = /*html*/`
    <div id="owner" class="space-y-3" >
        ${sectionMarkup("Name", overViewData.owner.name)}
        ${sectionMarkup("Email", overViewData.owner.email)}
        ${sectionMarkup("Phone", overViewData.owner.phone)}
    </div>`
}

const sectionMarkup = (name: string, value: any) => {
    return /*html*/`
    <div>
        <label class="text-sm font-medium text-gray-600"> ${name} </label>
        <h2 class="text-lg text-gray-900 font-medium"> ${value} </h2>
    </div>`
}