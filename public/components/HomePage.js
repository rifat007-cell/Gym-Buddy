export class HomePage extends HTMLElement {
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

  async render() {
    const homePageTemplate = document.getElementById("home-page-template");
    console.log(homePageTemplate);
    const templateContent = homePageTemplate.content.cloneNode(true);
    this.appendChild(templateContent);

    this.querySelector("a").addEventListener("click", (e) => {
      e.preventDefault();
      const href = e.target.getAttribute("href");
      app.router.go(href);
    });

    // remove loading animation
    const loadingAnimation = this.querySelector("animated-loading");
    if (loadingAnimation) {
      loadingAnimation.remove();
    }
  }
}

customElements.define("home-page", HomePage);
