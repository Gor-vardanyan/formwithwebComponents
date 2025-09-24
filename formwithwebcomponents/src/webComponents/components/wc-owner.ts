import { WcClass } from '../wc-class';
import wcStyles from '../wc-styles.css?inline'

const markup = /*html*/ `
<form style="width:500px" class="col gap">
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
        <label for="phone">phone number</label>
        <input 
            required
            title="phone number"
            type="text"
            name="phone"
            placeholder="phone number"
        />
        <p class="error" data-error="phone"></p>
    </div>
    <div class="row gap">
        <button id="prev">Previous</button>
        <button 
            id="next"
            style="background-color:grey"
            disabled=true
        >
        Next
        </button>
    </div>
</form>`;

class WcOwner extends WcClass {
    static observedAttributes = ["data"];
    names = ['name', 'email', 'phone']
    constructor() {
        super('owner')
    }

    connectedCallback() {
        const style = document.createElement('style');
        style.textContent = wcStyles;
        this.inner.appendChild(style);
        this.inner.innerHTML += markup;

        this.setInputBlurListener();
        
        this.names.forEach((name) => {
            const inputName = this.inner.querySelector<HTMLInputElement>(`input[name="${name}"]`);
            inputName?.addEventListener('input', (e) => {
                const target = e.target as HTMLInputElement;
                this.updateForm({ name: target.value });
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