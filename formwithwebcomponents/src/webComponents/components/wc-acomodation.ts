import type { Acomodation } from "../../App";
import { WcClass } from "../wc-class";
//TODO: UX

const markup = /*html*/ `
<form style="width:500px" class="col gap">
  <h2>Accommodation</h2>
    <div class="col bg-amber-100">
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
            <div>
                <div id="photo_1"></div>
                <button id="remove_1" style="display:none">remove</button>
            </div>
            <div>
                <div id="photo_2"></div>
                <button id="remove_2" style="display:none">remove</button>
            </div>
            <button id="add_photo">Add photo</button>
            <input id="file" type="file" style="display:none">
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
    names = ['name', 'address', 'description'];
    constructor() {
        super('acomodation');
    };

    //react 19 already clears event listeneres when dismounting the component
    connectedCallback() {
        this.inner.innerHTML += markup;
        this.setInputBlurListener();
        this.names.forEach((name) => {
            const inputName = this.inner.querySelector<HTMLInputElement>(`input[name="${name}"]`);
            inputName?.addEventListener('input', (e) => {
                const target = e.target as HTMLInputElement;
                this.updateForm({ [name]: target.value });
            });
        })

        const type = this.inner.querySelector<HTMLInputElement>('select[name="type"]') as HTMLInputElement;
        const uploadPhotoInput = this.inner.querySelector<HTMLInputElement>('#file') as HTMLInputElement;

        const photo1 = this.inner.querySelector<HTMLDivElement>('#photo_1') as HTMLDivElement;
        const photo2 = this.inner.querySelector<HTMLDivElement>('#photo_2') as HTMLDivElement;

        const nextButton = this.inner.querySelector<HTMLButtonElement>('#next') as HTMLButtonElement;
        const addPhoto = this.inner.querySelector<HTMLButtonElement>('#add_photo') as HTMLButtonElement;
        const removePhoto1 = this.inner.querySelector<HTMLButtonElement>('#remove_1') as HTMLButtonElement;
        const removePhoto2 = this.inner.querySelector<HTMLButtonElement>('#remove_2') as HTMLButtonElement;
        
        const renderPhotos = () => {
            const data = this.formData as Acomodation;
            const photos = data.photos ?? [];

            if (photo1) photo1.innerHTML = "";
            if (photo2) photo2.innerHTML = "";

            if (photos[0]) {
                const img = document.createElement("img");
                img.src = URL.createObjectURL(photos[0]);
                img.width = 100;
                img.height = 100;
                img.style.objectFit = "cover";
                photo1.appendChild(img);
                removePhoto1.style.display = "inline-block";
            } else {
                removePhoto1.style.display = "none";
            }

            if (photos[1]) {
                const img = document.createElement("img");
                img.src = URL.createObjectURL(photos[1]);
                img.width = 100;
                img.height = 100;
                img.style.objectFit = "cover";
                photo2.appendChild(img);
                removePhoto2.style.display = "inline-block";
            } else {
                removePhoto2.style.display = "none";
            }
            this.toggleButtonDisable(addPhoto, !(photos.length >= 2));
        };

        type.addEventListener('change', (e) => {
            const target = e.target as HTMLInputElement;
            this.updateForm({ type: target.value });
            type.blur();
        });

        uploadPhotoInput.addEventListener("change", (e) => {
            const data = this.formData as Acomodation;
            e.preventDefault();
            const target = e.target as HTMLInputElement;
            if (target.files) {
                const newFiles = Array.from(target.files);
                const updated = [
                    ...(data.photos ?? []),
                    ...newFiles
                ].slice(0, 2);

                this.updateForm({ photos: updated });
                renderPhotos();
                target.value = "";
            }
        });

        addPhoto.addEventListener('click', (e) => {
            e.preventDefault();
            const data = this.formData as Acomodation;
            if ((data.photos?.length ?? 0) < 2) {
                uploadPhotoInput.click();
            }
        });

        removePhoto1.addEventListener('click', (e) => {
            e.preventDefault();
            const data = this.formData as Acomodation;
            if (data.photos) {
                const updated = data.photos.slice(1);
                this.updateForm({ photos: updated });
                renderPhotos();
            }
        });

        removePhoto2.addEventListener('click', (e) => {
            e.preventDefault();
            const data = this.formData as Acomodation;
            if (data.photos) {
                const updated = [data.photos[0]];
                this.updateForm({ photos: updated });
                renderPhotos();
            }
        });

        nextButton.addEventListener('click', (e) => {
            e.preventDefault();
            this.validateForm();
            if (this.isValid) {
                this.emitStepChange('next', this.name);
            }
        });

        renderPhotos();
    };
}


window.customElements.define('wc-acomodation', WcAcomodation)
