type pagesContainer = {
  pages: pages;
  options?: {
    basePath?: string;
  }
}

type pages = page[]

type page = {
  color: string;
  name: string;
  categories: pages;
  link: string;
}

/* exported HeaderControl */
class HeaderControl {
  pageData: pagesContainer;
  element: JQuery<HTMLElement>;

  public getTextColor(rgbString: string) {
    const values = rgbString.slice(rgbString.indexOf('(') + 1, rgbString.indexOf(')')).split(',');
    const rgb: { r: number, g: number, b: number } = { r: 0, g: 0, b: 0 };

    // https://stackoverflow.com/a/11868159

    rgb.r = parseInt(values[0]);
    rgb.g = parseInt(values[1]);
    rgb.b = parseInt(values[2]);

    const brightness = Math.round(((rgb.r * 299) +
      (rgb.g * 587) +
      (rgb.b * 114)) / 1000);
    const textColour = (brightness > 125) ? 'black' : 'white';

    return textColour;
  }

  constructor(current: string[], contentJson: pagesContainer) {
    this.pageData = contentJson;

    let currentData: page = { color: "", name: "", link: "", categories: contentJson.pages };
    const links: URL[] = [];

    const basePath = contentJson.options?.basePath != null ? contentJson.options.basePath : window.location.origin;

    current.forEach((name) => {
      currentData = currentData.categories.filter((value) => value.name == name)[0];
      console.log(currentData);
      links.push(new URL(currentData.link, basePath));
    });

    console.log(links);

    const element = $("#header");
    const element = $("#header");
    this.element = element;

    console.log(this.element);

    element.css("display", "flex");
    element.css("background-color", currentData.color);

    element.css("color", this.getTextColor(element.css("background-color")));

    const pageTitle = document.createElement("div");
    pageTitle.style.display = "flex";
    pageTitle.style.flexDirection = "column";
    pageTitle.style.textAlign = "center";

    // TODO: Each of these should actually be a link
    const pageGroup = document.createElement("a");
    pageGroup.appendChild(document.createTextNode(current[0]));
    pageGroup.href = links[0].href;
    pageGroup.id = "main-title";

    const currentCatagory = document.createElement("span");
    currentCatagory.id = "sub-title";

    const subcategories = [...current];
    subcategories.shift();

    for (let i = 0; i < subcategories.length; i++) {
      const link = document.createElement('a');
      link.classList.add('subcategory');
      link.href = links[i+1].href;
      link.appendChild(document.createTextNode(subcategories[i]));

      currentCatagory.appendChild(link);
      
      if (i + 1 != subcategories.length) {
        currentCatagory.appendChild(document.createTextNode(' > '));
      }
    }

    pageTitle.appendChild(pageGroup);
    pageTitle.appendChild(currentCatagory);

    const menues = document.createElement('div');
    menues.id = 'categories';

    contentJson.pages.forEach((page) => {
      const pageInteractable = document.createElement('span');
      pageInteractable.appendChild(document.createTextNode(page.name));
      pageInteractable.classList.add('major-category');
      pageInteractable.addEventListener('click', () => {
        this.openSelector(page.name);
      });

      menues.appendChild(pageInteractable);
    });

    element.append(pageTitle);
    element.append(menues);
  }

  closeSelector() {
    // TODO
  }

  openSelector(id: string) {
    // TODO
  }
}