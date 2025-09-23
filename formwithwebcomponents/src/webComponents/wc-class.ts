import type { Acomodation, Owner } from "../App";

type ComponentName = 'acomodation' | 'owner' | 'overview';

//react 19 already clears event listeneres when dismounting the component
export class WcClass extends HTMLElement {
    name: ComponentName = 'acomodation';
    inner = this.attachShadow({ mode: 'open' });
    formData: Partial<Acomodation> = {}
    constructor(wcName: ComponentName) {
        super();
        this.name = wcName;
    };

    validateForm(): boolean {
        let isValid = true;
        const inputs = this.inner.querySelectorAll<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>('input, textarea, select');
        inputs.forEach((el) => {
            const errorField = this.inner.querySelector<HTMLParagraphElement>(`.error[data-error="${el.name}"]`);
            if (!el.checkValidity()) {
                isValid = false;
                if (errorField) {
                    errorField.textContent = el.validationMessage;
                }
            } else {
                if (errorField) {
                    errorField.textContent = "";
                }
            }
        });
        return isValid
    }

    updateForm(newValue: Record<string, string>) {
        this.formData = {
            ...this.formData,
            ...newValue
        }
    };

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

    attributeChangedCallback(
        name: string,
        oldValue: any,
        newValue: Acomodation | Owner | Acomodation & Owner
    ) {
        console.log(`${name}, ${oldValue}, ${newValue}`)
    };
}