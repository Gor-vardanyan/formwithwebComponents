import type { Acomodation, Owner } from "../App";
import tailwindcss from '../App.css?inline'
import { base64ToFile } from "./components/utils";

export type Overview = { 'acomodation': Acomodation, 'owner': Owner };
type ComponentName = 'acomodation' | 'owner' | 'overview';
type RenderPhotos = {
    addPhoto: HTMLButtonElement;
    photos: File[];
}

/**
 * Web Component base class for multi-step forms (e.g. Accommodation, Owner, Overview).
 *
 * Features:
 * - Shadow DOM encapsulation (`inner`)
 * - Local form state management (`formData`)
 * - Form validation (`validateForm`, `validateInput`)
 * - Automatic error display
 * - File upload and rendering (`renderPhotos`)
 * - TailwindCSS injection (`injectTailwind`)
 * - Navigation events for React integration (`emitStepChange`)
 */
export class WcClass extends HTMLElement {
    name: ComponentName = 'acomodation';
    inner = this.attachShadow({ mode: 'open' });
    formData: Partial<Acomodation | Owner> = {}
    isValid = false;

    /**
     * Creates an instance of the Web Component.
     * @param wcName - Initialize with the component name.
     */
    constructor(wcName: ComponentName) {
        super();
        this.name = wcName;
    };

    /**
     * Inject TailwindCSS styles into the Shadow DOM.
     * 
     * Uses `adoptedStyleSheets` if available, otherwise falls back to a `<style>` tag.
     */
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

    /**
     * Validate a single form field and update its error message.
     * 
     * @param el - The input, textarea, or select element to validate.
     * @returns {boolean} `true` if valid, `false` otherwise.
     */
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
     * Attach blur listeners to all inputs in the Shadow DOM.
     * When an input loses focus, it will be validated immediately.
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

    /**
     * Enable or disable a button and apply visual feedback.
     * 
     * @param button - The button to update.
     * @param allow - `true` to enable (blue), `false` to disable (gray).
     */
    toggleButtonDisable(button: HTMLButtonElement, allow: boolean) {
        if (allow) {
            button.disabled = false;
            button.style = 'background-color: blue'
        } else {
            button.disabled = true;
            button.style = 'background-color: gray'
        }
    }

    /**
     * Render photo previews into the two slots with their corresponding remove buttons.
     * Always resets slots before rendering.
     */
    renderPhotos = ({ addPhoto, photos }: RenderPhotos) => {
        const photoSlots = Array.from(this.inner.querySelectorAll<HTMLDivElement>('[id^="photo_"]'));
        const removeBtns = Array.from(this.inner.querySelectorAll<HTMLButtonElement>('[id^="remove_"]'));

        photoSlots.forEach((slot, index) => {
            const file = photos[index];
            const removeBtn = removeBtns[index];
            slot.innerHTML = "";

            if (file) {
                const img = document.createElement("img");
                img.src = URL.createObjectURL(file);
                img.width = 100;
                img.height = 100;
                img.style.objectFit = "cover";
                slot.appendChild(img);
                if (removeBtn) {
                    removeBtn.style.display = "inline-block";
                }
            } else {
                if (removeBtn) {
                    removeBtn.style.display = "none";
                }
            }
        });
        this.toggleButtonDisable(addPhoto, photos.length < photoSlots.length);
    };


    /**
     * Validate the entire form using HTML5 validity API.
     * 
     * Updates `isValid` and enables/disables the "Next" button accordingly.
     */
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
     * Special handling for `"data"` attribute:
     * - Populates form fields with provided values.
     * - Re-renders photos (converts Base64 strings back to `File` objects).
     * - Re-validates form.
     * 
     * @param name - The name of the changed attribute.
     * @param oldValue - The previous attribute value.
     * @param newValue - The new attribute value (JSON string).
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
                    const addPhoto = this.inner.querySelector<HTMLButtonElement>('#add_photo') as HTMLButtonElement;
                    this.renderPhotos({
                        addPhoto,
                        photos: value.photos.map((basePhoto: string) => base64ToFile(basePhoto))
                    });
                }
                this.validateForm();
            }, 500)
        }
    };
}