type pagesContainer = {
  pages: pages;
  options?: {
    basePath?: string
  }
}

type pages = {
  color: string;
  name: string;
  categories: pages;
  link: string;
}

class HeaderControl {
  element: JQuery<HTMLElement>

  constructor(current: string[], contentJson: pagesContainer) {
    let element = $("#header");
    this.element = element;
  }
}