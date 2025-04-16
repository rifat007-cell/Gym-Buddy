export class LoginPage extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.renderLoading();

    this.render();
  }

  renderLoading() {
    this.innerHTML = `
      <animated-loading data-elements="5" data-width="20px" data-height="20px"></animated-loading>
    `;
  }

  render() {
    const workoutPageTemplate = document.getElementById("login-page-template");
    console.log(workoutPageTemplate);
    const templateContent = workoutPageTemplate.content.cloneNode(true);
    this.appendChild(templateContent);

    this.querySelector("a").addEventListener("click", (event) => {
      event.preventDefault();
      app.router.go("/account/register");
    });

    // remove loading animation
    const loadingAnimation = this.querySelector("animated-loading");
    if (loadingAnimation) {
      loadingAnimation.remove();
    }
  }
}

customElements.define("login-page", LoginPage);
