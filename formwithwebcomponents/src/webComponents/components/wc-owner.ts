import type { Owner } from '../../App';
import wcStyles from '../wc-styles.css?inline'

const markup = /*html*/ `
<div style="width:500px" class="col gap">
  <h2>Owner</h2>
    <div class="col">
        <label for="name">Name</label>
        <input 
            required 
            title="Name must be 4-128 characters and contain only letters"
            type="text"
            name="name"
            pattern="^[A-Za-z\s]{4,128}$"
            placeholder="Name"
        />
        <p class="error" data-error="name"></p>
    </div>
    <div class="col">
        <label for="email">email</label>
        <input 
            required
            title="example email@gmail.com"
            type="text"
            name="email"
            placeholder="Email"
        />
        <p class="error" data-error="email"></p>
    </div>
    <div class="col">
        <label for="phone_number">phone number</label>
        <input 
            required
            title="phone number"
            type="text"
            name="phone_number"
            placeholder="phone number"
        />
        <p class="error" data-error="phone_number"></p>
    </div>
    <div class="row gap">
        <button id="prev">Previous</button>
        <button id="next">Next</button>
    </div>
</div>
`;
class WcOwner extends HTMLElement {
    inner = this.attachShadow({ mode: 'closed' })
    formData: Partial<Owner> ={} 
    constructor() {
        super()
    }

    connectedCallback() {
        const style = document.createElement('style');
        style.textContent = wcStyles;
        this.inner.appendChild(style);
        this.inner.innerHTML += markup;
        
        const inputName = this.inner.querySelector<HTMLInputElement>('input[name="name"]');
        inputName?.addEventListener('input', (e) => {
            const target = e.target as HTMLInputElement;
            this.updateForm({ name: target.value });
        });

        const inputAddress = this.inner.querySelector<HTMLInputElement>('input[name="address"]');
        inputAddress?.addEventListener('input', (e) => {
            const target = e.target as HTMLInputElement;
            this.updateForm({ address: target.value });
        });

        const prevButton = this.inner.querySelector<HTMLButtonElement>('#prev');
        prevButton?.addEventListener('click', (e) => {
            e.preventDefault();
            this.emitStepChange('previous');
        });

        const nextButton = this.inner.querySelector<HTMLButtonElement>('#next');
        nextButton?.addEventListener('click', (e) => {
            e.preventDefault();
            this.emitStepChange('next');
        });
    }

    emitStepChange(direction: 'next' | 'previous') {
        const event = new CustomEvent('change', {
            detail: { direction, owner: this.formData },
            bubbles: true,
            composed: true
        });
        this.dispatchEvent(event);
    };

    updateForm(newValue: Record<string, string>) {
        this.formData = {
            ...this.formData,
            ...newValue
        }
    };
}

window.customElements.define('wc-owner', WcOwner)