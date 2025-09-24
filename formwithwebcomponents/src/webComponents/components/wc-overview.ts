import { WcClass, type Overview } from "../wc-class"

class WcOverview extends WcClass {
    data = '';
    static get observedAttributes() {
        return ["data"];
    }
    constructor() {
        super('overview')
    }

    connectedCallback() {
        const overViewData = JSON.parse(this.data) as Overview
        if (overViewData.acomodation && overViewData.owner) {
            this.inner.innerHTML =/*html*/ `
            <div>
                <h2>${overViewData.acomodation.name}</h2>
                <h2>${overViewData.acomodation.address}</h2>
                <h2>${overViewData.acomodation.type}</h2>
                <h2>${overViewData.owner.name}</h2>
                <h2>${overViewData.owner.email}</h2>
                <h2>${overViewData.owner.phone}</h2>
            </div>`
        } else {
            this.inner.innerHTML =/*html*/ `
            <div>
                <h2>wrong</h2>
            </div>`
        }
    }

    attributeChangedCallback(
        name: string,
        oldValue: any,
        newValue: string
    ) {
        console.log(`${name}, ${oldValue}, ${newValue}`)
        if (name === 'data') {
            this.data = JSON.parse(newValue)
        }
    };
}

window.customElements.define('wc-overview', WcOverview)