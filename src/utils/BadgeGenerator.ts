import { $ } from "./dom-selector";

export class BadgeGenerator extends HTMLElement {
  private name: string = "GitHub";
  private logocolor: string = "ffffff";
  private leftcolor: string = "000000";
  private rightcolor: string = "000000";
  private icon: string = "Github";

  private img: HTMLImageElement;
  private markdownCode: HTMLElement;
  private imgCode: HTMLElement;

  static get observedAttributes() {
    return ["name", "icon", "logocolor", "rightcolor", "leftcolor"];
  }

  constructor() {
    super();

    this.img = $("img", this) as HTMLImageElement;
    this.img.alt = `${this.name} badge`;
    this.img.src = this.getSrc();

    this.markdownCode = $("#code-markdown", this) as HTMLElement;
    this.markdownCode.textContent = `![${this.name}](${this.getSrc()})`;
    this.markdownCode.appendChild(
      this.createCopyButton(`![${this.name}](${this.getSrc()})`)
    );

    this.imgCode = $("#code-html", this) as HTMLElement;
    this.imgCode.textContent = `<img src="${this.getSrc()}" alt="${
      this.name
    }" />`;
    this.imgCode.appendChild(
      this.createCopyButton(`<img src="${this.getSrc()}" alt="${this.name}" />`)
    );
  }

  public attributeChangedCallback(
    name: string,
    oldValue: string,
    newValue: string
  ) {
    if (oldValue === newValue) return;

    if (name === "name") {
      this.name = newValue;
    } else if (name === "logocolor") {
      const sanitizeColor = newValue.replace("#", "");
      this.logocolor = sanitizeColor;
    } else if (name === "rightcolor") {
      const sanitizeColor = newValue.replace("#", "");
      this.rightcolor = sanitizeColor;
    } else if (name === "leftcolor") {
      const sanitizeColor = newValue.replace("#", "");
      this.leftcolor = sanitizeColor;
    } else if (name === "icon") {
      this.icon = newValue;
    }
    this.img.src = this.getSrc();
  }

  public getSrc(): string {
    return `https://img.shields.io/badge/${this.name}-1000?style=for-the-badge&logo=${this.icon}&logoColor=${this.logocolor}&labelColor=${this.leftcolor}&color=${this.rightcolor}`;
  }

  private createCopyButton(code: string): HTMLButtonElement {
    const copyButton = document.createElement("button");
    copyButton.classList.add(
      "absolute",
      "right-2",
      "top-2",
      "transition",
      "stroke-neutral-300",
      "opacity-0",
      "group-hover:opacity-100"
    );
    copyButton.innerHTML =
      '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="inherit" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"> <path stroke="none" d="M0 0h24v24H0z" fill="none"></path> <path d="M9 5h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2h-2"></path> <path d="M9 3m0 2a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v0a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2z"></path></svg>';
    copyButton.addEventListener("click", () => {
      navigator.clipboard.writeText(code);
    });

    return copyButton;
  }
}
