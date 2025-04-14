export class LoginPage extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
  }

  render() {
    const workoutPageTemplate = document.getElementById("login-page-template");
    console.log(workoutPageTemplate);
    const templateContent = workoutPageTemplate.content.cloneNode(true);
    this.appendChild(templateContent);
  }
}

customElements.define("login-page", LoginPage);
