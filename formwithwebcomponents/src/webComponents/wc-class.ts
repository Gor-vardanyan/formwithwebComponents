import type { Acomodation, Owner } from "../App";
import tailwindcss from '../App.css?inline'
import { base64ToFile } from "./components/utils";

export type Overview = { 'acomodation': Acomodation, 'owner': Owner };
type ComponentName = 'acomodation' | 'owner' | 'overview';

/**
 * Web Component base class for multi-step forms (e.g. Accommodation, Owner).
 * 
 * This class provides:
 * - Shadow DOM (`inner`)
 * - Local form data (`formData`)
 * - Form validation (`validateForm`)
 * - Data updates (`updateForm`)
 * - Step navigation events (`emitStepChange`)
 * - Attribute observation (`attributeChangedCallback`)
 * 
 * @template ComponentName - The specific component name ("accommodation" | "owner"")
 */
export class WcClass extends HTMLElement {
    name: ComponentName = 'acomodation';
    inner = this.attachShadow({ mode: 'open' });
    formData: Partial<Acomodation | Owner> = {}
    isValid = false;

    /**
     * Creates an instance of the Web Component.
     * @param wcName - initialize with the name ("accommodation" | "owner" | "overview")
     */

    constructor(wcName: ComponentName) {
        super();
        this.name = wcName;
    };

    injectTailwind() {
        if ("adoptedStyleSheets" in Document.prototype) {
            const sheet = new CSSStyleSheet();
            sheet.replaceSync(tailwindcss);
            this.inner.adoptedStyleSheets = [...this.inner.adoptedStyleSheets, sheet];
        } else {
            const style = document.createElement("style");
            style.textContent = tailwindcss;
            this.inner.appendChild(style);
        }
    }

    validateInput(el: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement) {
        const errorField = this.inner.querySelector<HTMLParagraphElement>(`.error[data-error="${el.name}"]`);
        let localValidation = false;
        if (el.checkValidity()) {
            localValidation = true;
            if (errorField) {
                errorField.textContent = "";
            }
        } else {
            if (errorField) {
                errorField.textContent = el.validationMessage;
            }
        }
        return localValidation
    }

    /**
     * Validate all input, textarea, and select elements inside the shadow DOM.
     * 
     * Uses native HTML5 validation (`checkValidity`).
     * Displays validation messages inside matching `.error[data-error="fieldName"]` elements.
     * 
     * @returns {boolean} `true` if all fields are valid, otherwise `false`.
     */
    setInputBlurListener() {
        const inputs = this.inner.querySelectorAll<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>('input, textarea, select');
        inputs.forEach((el) => {
            el.addEventListener('blur', () => {
                this.validateInput(el)
                this.validateForm();
            })
        });
    }

    toggleButtonDisable(button: HTMLButtonElement, allow: boolean) {
        if (allow) {
            button.disabled = false;
            button.style = 'background-color: blue'
        } else {
            button.disabled = true;
            button.style = 'background-color: gray'
        }
    }

    renderPhotos = ({
        photo1,
        removePhoto1,
        photo2,
        removePhoto2,
        addPhoto,
        photos
    }: {
        photo1: HTMLDivElement,
        removePhoto1: HTMLButtonElement,
        photo2: HTMLDivElement,
        removePhoto2: HTMLButtonElement,
        addPhoto: HTMLButtonElement,
        photos: File[];
    }) => {
        if (photo1) photo1.innerHTML = "";
        if (photo2) photo2.innerHTML = "";

        if (photos[0] && photo1 && removePhoto1) {
            const img = document.createElement("img");
            img.src = URL.createObjectURL(photos[0]);
            img.width = 100;
            img.height = 100;
            img.style.objectFit = "cover";
            photo1.appendChild(img);
            removePhoto1.style.display = "inline-block";
        } else if (removePhoto1) {
            removePhoto1.style.display = "none";
        }

        if (photos[1] && photo2 && removePhoto2) {
            const img = document.createElement("img");
            img.src = URL.createObjectURL(photos[1]);
            img.width = 100;
            img.height = 100;
            img.style.objectFit = "cover";
            photo2.appendChild(img);
            removePhoto2.style.display = "inline-block";
        } else if (removePhoto2) {
            removePhoto2.style.display = "none";
        }
        this.toggleButtonDisable(addPhoto, !(photos.length >= 2));
    };

    validateForm() {
        const form = this.inner.querySelector<HTMLFormElement>('form')
        if (form) {
            this.isValid = form.checkValidity();
            const button = this.inner.querySelector<HTMLButtonElement>('#next') as HTMLButtonElement
            this.toggleButtonDisable(button, this.isValid)
        }
    }

    /**
     * Merge new field values into the local form data object.
     * 
     * @param newValue - A record of key/value pairs to update in `formData`.
     */
    updateForm(newValue: Record<string, string | string[]>) {
        this.formData = {
            ...this.formData,
            ...newValue
        }
    };

    /**
     * Emit a step-change event to the parent React app or consumer.
     * 
     * The event contains:
     * - `direction`: either "next" or "previous"
     * - The form data associated with the current step
     * 
     * @param direction - The navigation direction ("next" | "previous").
     * @param paramName - The logical component name, used as the key in the event detail.
     */
    emitStepChange(
        direction: 'next' | 'previous',
        paramName: ComponentName
    ) {
        const event = new CustomEvent('change', {
            detail: { direction, [paramName]: this.formData },
            bubbles: true,
            composed: true
        });
        this.dispatchEvent(event);
    };

    /**
     * Lifecycle callback: triggered when an observed attribute changes.
     * 
     * @param name - The name of the changed attribute.
     * @param oldValue - The previous attribute value.
     * @param newValue - The new attribute value (typed as Acomodation | Owner).
     */
    attributeChangedCallback(
        name: string,
        oldValue: any,
        newValue: string
    ) {
        console.log(`${name}, ${oldValue}, ${newValue}`)
        const value = JSON.parse(newValue)
        if (
            !Object.keys(this.formData).length &&
            Object.keys(value).length &&
            name === 'data'
        ) {
            this.formData = value;
            setTimeout(() => {
                const inputs = this.inner.querySelectorAll<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>('input, textarea, select');
                inputs.forEach((el) => {
                    const name = el.getAttribute('name');
                    if (name && value[name]) {
                        el.value = value[name];
                    }
                });
                if (this.name === 'acomodation' && value.photos.length) {
                    const photo1 = this.inner.querySelector<HTMLDivElement>('#photo_1') as HTMLDivElement;
                    const photo2 = this.inner.querySelector<HTMLDivElement>('#photo_2') as HTMLDivElement;
                    const removePhoto1 = this.inner.querySelector<HTMLButtonElement>('#remove_1') as HTMLButtonElement;
                    const removePhoto2 = this.inner.querySelector<HTMLButtonElement>('#remove_2') as HTMLButtonElement;
                    const addPhoto = this.inner.querySelector<HTMLButtonElement>('#add_photo') as HTMLButtonElement;

                    this.renderPhotos({
                        photo1,
                        removePhoto1,
                        photo2,
                        removePhoto2,
                        addPhoto,
                        photos: value.photos
                            .map((basePhoto: string) => base64ToFile(basePhoto))
                    });
                }
                this.validateForm();
            }, 500)
        }
    };
}