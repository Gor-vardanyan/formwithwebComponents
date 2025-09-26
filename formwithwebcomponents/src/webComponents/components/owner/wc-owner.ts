import { WcClass } from '../../wc-class';
import ownerHtml from './owner.html?raw';

class WcOwner extends WcClass {
    static observedAttributes = ["data"];
    names = ['name', 'email', 'phone']
    constructor() {
        super('owner')
    }

    connectedCallback() {
        this.injectTailwind();
        this.inner.innerHTML = ownerHtml;

        this.setInputBlurListener();

        this.names.forEach((name) => {
            const inputName = this.inner.querySelector<HTMLInputElement>(`input[name="${name}"]`);
            inputName?.addEventListener('input', (e) => {
                const target = e.target as HTMLInputElement;
                this.updateForm({ [name]: target.value });
                if (inputName.required && inputName.checkValidity()) {
                    this.validateForm();
                }
            });
        })

        const prevButton = this.inner.querySelector<HTMLButtonElement>('#prev');
        prevButton?.addEventListener('click', (e) => {
            e.preventDefault();
            this.emitStepChange('previous', this.name);
        });

        const nextButton = this.inner.querySelector<HTMLButtonElement>('#next');
        nextButton?.addEventListener('click', (e) => {
            e.preventDefault();
            this.emitStepChange('next', this.name);
        });
    }
}

window.customElements.define('wc-owner', WcOwner)