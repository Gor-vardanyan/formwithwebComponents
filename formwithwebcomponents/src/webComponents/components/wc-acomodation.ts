import type { Acomodation } from "../../App";
import { WcClass } from "../wc-class";
import wcStyles from '../wc-styles.css?inline'
//TODO: add 2 images debugg
//TODO: style tailwind
//TODO: UX

const markup = /*html*/ `
<form style="width:500px" class="col gap">
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
            minlength="4"
            maxlength="128"
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
        <label for="type">Type</label>
        <select name="type" required>
            <option value=''>Select acomodation type</option>
            <option value='apartment'>Apartment</option>
            <option value='house'>House</option>
            <option value='villa'>Villa</option>
        </select>
        <p class="error" data-error="type"></p>
    </div>
    <div class="col">
        <label>Photos</label>
        <div class="col gap">
        <div class="photos">
          <img id="photo_preview_0" style="display:none; width:80px; height:80px; object-fit:cover;" />
          <button id="remove_photo_0" style="display:none;">Remove</button>
          <img id="photo_preview_1" style="display:none; width:80px; height:80px; object-fit:cover;" />
          <button id="remove_photo_1" style="display:none;">Remove</button>
        </div>
        <button id="add_photo">Add photo</button>
        <input type="file" id="photo_input" accept="image/*" multiple style="display:none" />
      </div>
      <p class="error" data-error="photo"></p>      
    </div>
  <div class="row gap">
    <button 
        id="next"
        style="background-color:grey"
        disabled=true
    >
      Next
    </button>
  </div>
</form>`;

export class WcAcomodation extends WcClass {
    static observedAttributes = ["data"];
    names = ['name', 'address', 'description', 'type'];
    constructor() {
        super('acomodation');
    };

    //react 19 already clears event listeneres when dismounting the component
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

        const nextButton = this.inner.querySelector<HTMLButtonElement>('#next');
        nextButton?.addEventListener('click', (e) => {
            e.preventDefault();
            this.validateForm();
            if (this.isValid) {
                this.emitStepChange('next', this.name);
            }
        });

        const addPhotoBtn = this.inner.querySelector<HTMLButtonElement>("#add_photo");
        const photoInput = this.inner.querySelector<HTMLInputElement>("#photo_input");
        const photoPreviews = [
            this.inner.querySelector<HTMLImageElement>("#photo_preview_0"),
            this.inner.querySelector<HTMLImageElement>("#photo_preview_1"),
        ];
        const removeBtns = [
            this.inner.querySelector<HTMLButtonElement>("#remove_photo_0"),
            this.inner.querySelector<HTMLButtonElement>("#remove_photo_1"),
        ];

        const renderPhotos = (files: File[]) => {
            files.forEach((file, i) => {
                if (photoPreviews[i] && removeBtns[i]) {
                    photoPreviews[i]!.src = URL.createObjectURL(file);
                    photoPreviews[i]!.style.display = "block";
                    removeBtns[i]!.style.display = "inline-block";
                }
            });
            for (let i = files.length; i < 2; i++) {
                if (photoPreviews[i] && removeBtns[i]) {
                    photoPreviews[i]!.style.display = "none";
                    removeBtns[i]!.style.display = "none";
                    photoPreviews[i]!.src = "";
                }
            }
            if (addPhotoBtn) {
                addPhotoBtn.disabled = files.length >= 2;
            }
        };

        const photo = (this.formData as Acomodation).photo
        addPhotoBtn?.addEventListener("click", (e) => {
            e.preventDefault();
            if ((photo?.length ?? 0) >= 2) return;
            photoInput?.click();
        });

        photoInput?.addEventListener("change", (e) => {
            const target = e.target as HTMLInputElement;
            if (target.files) {
                const newFiles = Array.from(target.files);
                const currentPhotos = photo ?? [];
                const merged = [...currentPhotos, ...newFiles].slice(0, 2);
                this.updateForm({ photo: merged });
                renderPhotos(merged);
                target.value = "";
            }
        });

        removeBtns.forEach((btn, i) => {
            btn?.addEventListener("click", (e) => {
                e.preventDefault();
                const updated = [...(photo ?? [])];
                updated.splice(i, 1);
                this.updateForm({ photo: updated });
                renderPhotos(updated);
            });
        });

    };
}


window.customElements.define('wc-acomodation', WcAcomodation)
