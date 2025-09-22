const styles = /*css*/`
form {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }
  .grouped {
    display: flex;
    gap: 1rem;
  }

  .space {
    display:flex;
    flex-direction: column;
    gap: 1rem;
  }

  label {
    font-size: 1.25rem;
    font-weight: 700;
    text-align: center;
    margin-bottom: 1rem;
    display: block;
  }
  
  input,
  textarea,
  select,
  button {
    width: 100%;
    border: 1px solid #d1d5db;
    border-radius: 0.5rem;
    padding: 0.5rem 0.75rem;
    box-sizing: border-box;
    font-family: inherit;
    font-size: 1rem;
  }
  
  button {
    font-weight: 700;
    cursor: pointer;
    background-color: #3b82f6;
    color: white;
    border: none;
  }
  
  p.error {
    color: #ef4444;
    font-size: 0.875rem;
    margin-top: 0.25rem;
  }
`

const markup = /*html*/ `
<div class="space">
  <h2>Accommodation</h2>
    <input 
        required 
        title="Name must be 4-128 characters and contain only letters"
        type="text"
        name="name"
        pattern="^[A-Za-z\s]{4,128}$"
        placeholder="Name"
    />
    <input 
        required
        title="Length between 4 and 128 characters."
        type="text"
        name="address"
        pattern="^{4,128}$"
        placeholder="Address"
    />
    <textarea
        name="description"
        placeholder="Description (optional)"
        minlength="128"
        maxlength="2048"
    ></textarea>
    <p class="error" data-error="description"></p>
    <select required>
    <option value=''>Select acomodation type</option>
    <option value='0'>Apartment</option>
    <option value='1'>House</option>
    <option value='2'>Villa</option>
  </select>
  <div>
  <label>Photos</label>
    <div class="photos"></div>
    <button id="add_photo">Add photo</button>
  </div>
  <div class="grouped">
    <button id="prev">Previous</button>
    <button id="next">Next</button>
  </div>
</div>
`
export class WcAcomodation extends HTMLElement {
    inner = this.attachShadow({ mode: 'open' });

    acomodationType = ['apartment', 'house', 'villa'];
    formData = {};
    static observedAttributes = ["formData"];
    constructor() {
        super()
    };

    connectedCallback() {
        const style = document.createElement('style');
        style.textContent = styles;
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

    };

    updateForm(newValue: Record<string, string>) {
        this.formData = {
            ...this.formData,
            ...newValue
        }
    };

    emitStepChange(direction: 'next' | 'previous') {
        const event = new CustomEvent('stepChange', {
            detail: { direction, formData: this.formData },
            bubbles: true,
            composed: true
        });
        this.dispatchEvent(event);
    };

    attributeChangedCallback(name: 'formData', oldValue: FormData, newValue: FormData) {
        console.log(`${name}, ${oldValue}, ${newValue}`)
    };
}


window.customElements.define('wc-acomodation', WcAcomodation)
