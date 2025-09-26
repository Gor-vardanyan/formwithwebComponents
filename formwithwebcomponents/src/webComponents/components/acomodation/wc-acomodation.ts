import type { Acomodation } from "../../../App";
import { WcClass } from "../../wc-class";
import { base64ToFile, fileToBase64 } from '../utils'
import acomodationHtml from './acomodation.html?raw'

export class WcAcomodation extends WcClass {
    static observedAttributes = ["data"];
    names = ['name', 'address', 'description'];
    constructor() {
        super('acomodation');
    };

    //react 19 already clears event listeneres when dismounting the component
    connectedCallback() {
        this.injectTailwind();
        this.inner.innerHTML = acomodationHtml;
        this.setInputBlurListener();

        this.names.forEach((name) => {
            const inputName = this.inner.querySelector<HTMLInputElement>(`input[name="${name}"]`);
            if (inputName) {
                inputName.addEventListener('input', (e) => {
                    const target = e.target as HTMLInputElement;
                    this.updateForm({ [name]: target.value });
                    if (inputName.required && inputName.checkValidity()) {
                        this.validateForm();
                    }
                });
            } else {
                const textAreaDescription = this.inner.querySelector<HTMLInputElement>(`textarea[name="${name}"]`);
                textAreaDescription?.addEventListener('input', (e) => {
                    const target = e.target as HTMLInputElement;
                    this.updateForm({ [name]: target.value });
                });
            }
        })

        const type = this.inner.querySelector<HTMLInputElement>('select[name="type"]') as HTMLInputElement;
        const uploadPhotoInput = this.inner.querySelector<HTMLInputElement>('#file') as HTMLInputElement;

        const photo1 = this.inner.querySelector<HTMLDivElement>('#photo_1') as HTMLDivElement;
        const photo2 = this.inner.querySelector<HTMLDivElement>('#photo_2') as HTMLDivElement;

        const removePhoto1 = this.inner.querySelector('#remove_1') as HTMLButtonElement;
        const removePhoto2 = this.inner.querySelector('#remove_2') as HTMLButtonElement;
        const addPhoto = this.inner.querySelector('#add_photo') as HTMLButtonElement;
        const nextButton = this.inner.querySelector('#next') as HTMLButtonElement;
        const showBtn = this.inner.getElementById("showOptions") as HTMLButtonElement;
        const closeBtn = this.inner.getElementById("closeOptions") as HTMLButtonElement;
        const optionsDiv = this.inner.getElementById("options") as HTMLDivElement;

        showBtn.addEventListener("click", (e) => {
            e.preventDefault();
            optionsDiv.style="";
            showBtn.style ="display:none";
            closeBtn.style="";
        });

        closeBtn.addEventListener("click", (e) => {
            e.preventDefault();
            optionsDiv.style ="display:none";
            closeBtn.style ="display:none";
            showBtn.style="";
        });

        type.addEventListener('change', (e) => {
            const target = e.target as HTMLInputElement;
            this.updateForm({ type: target.value });
            type.blur();
        });

        uploadPhotoInput.addEventListener("change", async (e) => {
            e.preventDefault();
            const data = this.formData as Acomodation;
            const target = e.target as HTMLInputElement;
            if (target.files) {
                const files = [
                    target.files[0]
                ];
                if (data.photos?.length) {
                    files.unshift(base64ToFile(data.photos[0]));
                }
                const updatedBase = [
                    ...(data.photos ?? []),
                    await fileToBase64(target.files[0] as File)
                ]

                this.updateForm({
                    photos: updatedBase,
                });

                this.renderPhotos({
                    photo1,
                    removePhoto1,
                    photo2,
                    removePhoto2,
                    addPhoto,
                    photos: files as File[]
                });
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
                this.renderPhotos({
                    photo1,
                    removePhoto1,
                    photo2,
                    removePhoto2,
                    addPhoto,
                    photos: updated.map((basePhoto: string) => base64ToFile(basePhoto))
                });
            }
        });

        removePhoto2.addEventListener('click', (e) => {
            e.preventDefault();
            const data = this.formData as Acomodation;
            if (data.photos) {
                const updated = [data.photos[0]];
                this.updateForm({ photos: updated });
                this.renderPhotos({
                    photo1,
                    removePhoto1,
                    photo2,
                    removePhoto2,
                    addPhoto,
                    photos: updated.map((basePhoto: string) => base64ToFile(basePhoto))
                });
            }
        });

        nextButton.addEventListener('click', (e) => {
            e.preventDefault();
            this.validateForm();
            if (this.isValid) {
                this.emitStepChange('next', this.name);
            }
        });
    };
}


window.customElements.define('wc-acomodation', WcAcomodation)
