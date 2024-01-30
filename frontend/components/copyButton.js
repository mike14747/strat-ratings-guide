const copyIcon = '<svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} viewBox="0 0 24 24" height="1.50rem" width="1.50rem"><path d="M9 2 H15 A1 1 0 0 1 16 3 V5 A1 1 0 0 1 15 6 H9 A1 1 0 0 1 8 5 V3 A1 1 0 0 1 9 2 z" /><path d="M8 4H6a2 2 0 00-2 2v14a2 2 0 002 2h12a2 2 0 002-2v-2M16 4h2a2 2 0 012 2v4M21 14H11" /><path d="M15 10l-4 4 4 4" /></svg>';

class CopyButton extends HTMLElement {
    constructor() {
        super();
        this.innerHTML = `
        <button title="Copy to Clipboard" class="btn-copy" onclick="copyContent()">
            ${copyIcon}
        </button>
        `;
    }
}

customElements.define('copy-button', CopyButton);