class WcOwner extends HTMLElement {
    inner = this.attachShadow({ mode: 'closed' })

    constructor() {
        super()
    }
    connectedCallback() {
        this.inner.innerHTML =/*html*/ `
        <div>
        Owner
        </div>`
    }
}

window.customElements.define('wc-owner', WcOwner)