import { WcClass } from "../wc-class";
import wcStyles from '../wc-styles.css?inline'

const markup = /*html*/ `
<div style="width:500px" class="col gap">
  <h2>Accommodation</h2>
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
        <label for="address">Address</label>
        <input 
            required
            title="Length between 4 and 128 characters."
            type="text"
            name="address"
            pattern="^{4,128}$"
            placeholder="Address"
        />
        <p class="error" data-error="address"></p>
    </div>
    <div class="col">
        <label for="description">Description</label>
        <textarea
            name="description"
            placeholder="Description (optional)"
            minlength="128"
            maxlength="2048"
        ></textarea>
        <p class="error" data-error="description"></p>
    </div>
    <div class="col">
        <label for="selectType">Type</label>
        <select name="selectType" required>
            <option value=''>Select acomodation type</option>
            <option value='apartment'>Apartment</option>
            <option value='house'>House</option>
            <option value='villa'>Villa</option>
        </select>
        <p class="error" data-error="selectType"></p>
    </div>
    <div class="col">
        <label>Photos</label>
        <div class="col gap">
            <div class="photos"></div>
            <button id="add_photo">Add photo</button>
        </div>
        <p class="error" data-error="photo"></p>
    </div>
  <div class="row gap">
    <button id="next">Next</button>
  </div>
</div>
`;

export class WcAcomodation extends WcClass {
    static observedAttributes = ["data"];
    constructor() {
        super('acomodation');
    };

    //react 19 already clears event listeneres when dismounting the component
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

        const inputDescription = this.inner.querySelector<HTMLInputElement>('input[name="description"]');
        inputDescription?.addEventListener('input', (e) => {
            const target = e.target as HTMLInputElement;
            this.updateForm({ description: target.value });
        });

        const selectType = this.inner.querySelector<HTMLInputElement>('select[name="selectType"]');
        selectType?.addEventListener('change', (e) => {
            const target = e.target as HTMLInputElement;
            this.updateForm({ type: target.value });
        });

        const nextButton = this.inner.querySelector<HTMLButtonElement>('#next');
        nextButton?.addEventListener('click', (e) => {
            e.preventDefault();
            if (this.validateForm()) {
                this.emitStepChange('next', this.name);
            }
        });

    };
}


window.customElements.define('wc-acomodation', WcAcomodation)
