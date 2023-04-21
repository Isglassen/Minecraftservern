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
  currentlySelecting: string[] = [];

  public getPage(names: string[]): page {
    let currentData: page = { color: "", name: "", link: "", categories: this.pageData.pages };

    names.forEach((name) => {
      currentData = currentData.categories.filter(value => value.name == name)[0];
    });

    return currentData;
  }

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
      currentData = currentData.categories.filter(value => value.name == name)[0];
      console.log(currentData);
      links.push(new URL(currentData.link, basePath));
    });

    console.log(links);

    const element = $("#header");
    this.element = element;

    console.log(this.element);

    element.css("display", "flex");
    element.css("background-color", currentData.color);

    const mainHeader = document.createElement("div");
    mainHeader.id = 'main-header';
    element.append(mainHeader);

    const pageTitle = document.createElement("div");
    pageTitle.id = 'page-title';
    pageTitle.style.backgroundColor = contentJson.pages.filter(page => page.name == current[0])[0].color;
    pageTitle.style.display = "flex";
    pageTitle.style.flexDirection = "column";
    pageTitle.style.textAlign = "center";

    const pageGroup = document.createElement("a");
    pageGroup.appendChild(document.createTextNode(current[0]));
    pageGroup.style.color = this.getTextColor(pageTitle.style.backgroundColor);
    pageGroup.href = links[0].href;
    pageGroup.id = "main-title";

    const currentCatagory = document.createElement("span");
    currentCatagory.id = "sub-title";

    const subcategories = [...current];
    subcategories.shift();

    for (let i = 0; i < subcategories.length; i++) {
      const link = document.createElement('a');
      link.style.color = this.getTextColor(pageTitle.style.backgroundColor);
      link.classList.add('subcategory');
      link.appendChild(document.createTextNode(subcategories[i]));

      currentCatagory.appendChild(link);
      
      if (i + 1 != subcategories.length) {
        link.href = links[i+1].href;
        currentCatagory.appendChild(document.createTextNode(' > '));
      }
    }

    if (subcategories.length < 1) {
      currentCatagory.innerHTML = '&nbsp;';
    }

    pageTitle.appendChild(pageGroup);
    pageTitle.appendChild(currentCatagory);

    const menues = document.createElement('div');
    menues.id = 'categories';

    contentJson.pages.forEach((page) => {
      const pageInteractable = document.createElement('a');
      pageInteractable.appendChild(document.createTextNode(page.name));
      pageInteractable.classList.add('major-category');
      pageInteractable.style.backgroundColor = page.color;
      pageInteractable.style.color = this.getTextColor(pageInteractable.style.backgroundColor);
      if (page.categories.length > 0) {
        pageInteractable.addEventListener('click', () => {
          this.open([page.name]);
        });
      } else {
        pageInteractable.href = new URL(page.link, this.pageData.options?.basePath).href;
      }

      menues.appendChild(pageInteractable);
    });

    mainHeader.append(pageTitle);
    mainHeader.append(menues);
  }

  close(level: number) {
    this.element.find(`div.minor-select:nth-child(n+${level+2})`).remove();
  }

  open(id: string[]) {
    // TODO: Clicking again should simply run close

    // Check how many levels to remove
    let level = 0;

    while (this.currentlySelecting[level] == id[level] && (level < this.currentlySelecting.length || level < id.length)) {
      level++;
    }

    this.close(level);

    this.currentlySelecting = [...id];

    // Expand what is needed
    for (let i = level; i < id.length; i++) {
      this.addLevel(id.slice(0, i+1));
    }
  }

  addLevel(pagePath: string[]) {
    const page = this.getPage(pagePath);

    const newSelection = document.createElement('div');
    newSelection.classList.add('minor-select');
    newSelection.style.maxHeight = '0';
    newSelection.style.backgroundColor = page.color;
    
    const rootLink = document.createElement('a');
    rootLink.text = page.name;
    rootLink.href = new URL(page.link, this.pageData.options?.basePath).href;
    rootLink.classList.add('category-link');
    rootLink.style.backgroundColor = page.color;
    rootLink.style.color = this.getTextColor(rootLink.style.backgroundColor);

    newSelection.appendChild(rootLink);

    // Append new category expanders in list
    page.categories.forEach((page) => {
      const menu = document.createElement('a');
      menu.innerText = page.name;
      menu.style.backgroundColor = page.color;
      menu.style.color = this.getTextColor(menu.style.backgroundColor);
      menu.classList.add('category-button');
      if (page.categories.length > 0) {
        menu.addEventListener('click', () => {
          this.open([...pagePath, page.name]);
        });
      } else {
        menu.href = new URL(page.link, this.pageData.options?.basePath).href;
      }

      newSelection.appendChild(menu);
    });

    this.element.append(newSelection);
    
    setTimeout(()=>newSelection.style.maxHeight = '', 100);
  }
}