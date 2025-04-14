export class RegisterPage extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
  }

  render() {
    const registerPageTemplate = document.getElementById(
      "register-page-template"
    );
    console.log(registerPageTemplate);
    const templateContent = registerPageTemplate.content.cloneNode(true);
    this.appendChild(templateContent);
  }
}

customElements.define("register-page", RegisterPage);
