import type { Acomodation, Owner } from "../App";

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

    validateForm() {
        const form = this.inner.querySelector<HTMLFormElement>('form')
        if (form) {
            this.isValid = form.checkValidity();
            const button = this.inner.querySelector<HTMLButtonElement>('#next') as HTMLButtonElement
            if (this.isValid) {
                button.disabled = false;
                button.style = 'background-color: blue'
            } else {
                button.disabled = true;
                button.style = 'background-color: gray'
            }
        }
    }

    /**
     * Merge new field values into the local form data object.
     * 
     * @param newValue - A record of key/value pairs to update in `formData`.
     */
    updateForm(newValue: Record<string, string | File[]>) {
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
            setTimeout(() => {
                const inputs = this.inner.querySelectorAll<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>('input, textarea, select');
                inputs.forEach((el) => {
                    const name = el.getAttribute('name');
                    if (name && value[name]) {
                        el.value = value[name];
                    }
                });
                this.validateForm();
            }, 500)
        }
    };
}