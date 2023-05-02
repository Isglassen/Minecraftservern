type pagesContainer = {
  pages: page[];
  options?: {
    basePath?: string;
  }
}

type page = {
  color: string;
  name: string;
  categories: page[];
  link: string;
}

/* exported HeaderControl */
class HeaderControl {
  pageData: pagesContainer;
  currentPage: string[];
  element: JQuery<HTMLElement>;
  currentlySelecting: string[] = [];

  public getPage(names: string[]): page {
    let currentData: page = { color: "", name: "", link: "", categories: this.pageData.pages };

    names.forEach((name) => {
      currentData = currentData.categories.filter(value => value.name == name)[0];
    });

    return currentData;
  }

  static findPage(pageJson: pagesContainer, currentHref: string): string[] {

    function loopPages(pages: page[], currentPath: string[]): string[] | undefined {
      const searching = [...currentPath];
      for(let i=0; i<pages.length; i++) {
        searching.push(pages[i].name);
        if (new FixedURL(pages[i].link, pageJson.options?.basePath).href == currentHref) return searching;
        const result = loopPages(pages[i].categories, searching);
        if (result != undefined) return result;

        searching.pop();
      }
    }

    return loopPages(pageJson.pages, []) || [];
  }

  private arrayEquals<T>(a: T[], b: T[]) {
    if (a.length != b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) return false;
    }
    return true;
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

  constructor(contentJson: pagesContainer, current?: string[]) {
    if (current === undefined) current = HeaderControl.findPage(contentJson, window.location.href);

    this.currentPage = [...current];
    this.pageData = contentJson;

    let currentData: page = { color: "", name: "", link: "", categories: contentJson.pages };
    const links: URL[] = [];

    const basePath = contentJson.options?.basePath != null ? contentJson.options.basePath : window.location.origin;

    current.forEach((name) => {
      currentData = currentData.categories.filter(value => value.name == name)[0];
      console.log(currentData);
      links.push(new FixedURL(currentData.link, basePath));
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

    const currentName = current[0];

    const pageTitle = document.createElement("div");
    pageTitle.id = 'page-title';
    pageTitle.style.backgroundColor = contentJson.pages.filter(page => page.name == currentName)[0].color;
    pageTitle.style.display = "flex";
    pageTitle.style.flexDirection = "column";
    pageTitle.style.textAlign = "center";

    const subcategories = [...current];
    subcategories.shift();

    const pageGroup = document.createElement("a");
    pageGroup.appendChild(document.createTextNode(current[0]));
    pageGroup.style.color = this.getTextColor(pageTitle.style.backgroundColor);
    if (subcategories.length > 0) {
      pageGroup.href = links[0].href;
    } else {
      pageGroup.style.fontWeight = 'bold';
    }
    pageGroup.id = "main-title";

    const currentCatagory = document.createElement("span");
    currentCatagory.id = "sub-title";

    for (let i = 0; i < subcategories.length; i++) {
      const link = document.createElement('a');
      link.style.color = this.getTextColor(pageTitle.style.backgroundColor);
      link.classList.add('subcategory');
      link.appendChild(document.createTextNode(subcategories[i]));

      currentCatagory.appendChild(link);
      
      if (i + 1 != subcategories.length) {
        link.href = links[i+1].href;
        currentCatagory.appendChild(document.createTextNode(' > '));
      } else {
        link.style.fontWeight = 'bold';
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
        pageInteractable.id = `0-${page.name}`;
        pageInteractable.style.fontStyle = 'italic';
        $(pageInteractable).on('click', () => {
          if ($(`#${pageInteractable.id}`).attr('data-open') == '1') {
            this.close(0);
          } else {
            this.open([page.name]);
          }
        });
      } else if (!this.arrayEquals([page.name], this.currentPage)) {
        pageInteractable.href = new FixedURL(page.link, this.pageData.options?.basePath).href;
      } 
      if (this.arrayEquals([page.name], this.currentPage)) {
        pageInteractable.style.fontWeight = 'bold';
      }

      menues.appendChild(pageInteractable);
    });

    mainHeader.append(pageTitle);
    mainHeader.append(menues);
  }

  close(level: number) {
    // Remove everything on a higher level
    this.currentlySelecting = this.currentlySelecting.slice(0, level);
    this.element.find(`div.minor-select:nth-child(n+${level+2})`).remove();

    // Update all elements to have the closed state
    this.getPage(this.currentlySelecting).categories.forEach(category => {
      $(`#${level}-${category.name}`).attr('data-open', '0');
    });
  }

  open(id: string[]) {
    // Check how many levels to remove
    let level = 0;

    while (this.currentlySelecting[level] == id[level] && (level < this.currentlySelecting.length || level < id.length)) {
      level++;
    }

    this.close(level);

    // Update to the close event listener
    $(`#${level}-${id[id.length-1]}`).attr('data-open', '1');

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
    // newSelection.style.maxHeight = '0';
    newSelection.style.backgroundColor = page.color;
    
    const rootLink = document.createElement('a');
    rootLink.text = page.name;
    rootLink.classList.add('category-link');
    rootLink.style.backgroundColor = page.color;
    rootLink.style.color = this.getTextColor(rootLink.style.backgroundColor);

    if (!this.arrayEquals(pagePath, this.currentPage)) {
      rootLink.href = new FixedURL(page.link, this.pageData.options?.basePath).href;
    } 
    if (this.arrayEquals(pagePath, this.currentPage)) {
      rootLink.style.fontWeight = 'bold';
    }

    newSelection.appendChild(rootLink);

    // Append new category expanders in list
    page.categories.forEach((page) => {
      const menu = document.createElement('a');
      menu.innerText = page.name;
      menu.style.backgroundColor = page.color;
      menu.style.color = this.getTextColor(menu.style.backgroundColor);
      menu.classList.add('category-button');
      if (page.categories.length > 0) {
        menu.id = `${pagePath.length}-${page.name}`;
        menu.style.fontStyle = 'italic';
        $(menu).on('click', () => {
          if ($(`#${menu.id}`).attr('data-open') == '1') {
            this.close(pagePath.length);
          } else {
            this.open([...pagePath, page.name]);
          }
        });
      } else if (!this.arrayEquals([...pagePath, page.name], this.currentPage)) {
        menu.href = new FixedURL(page.link, this.pageData.options?.basePath).href;
      } 
      if (this.arrayEquals([...pagePath, page.name], this.currentPage)) {
        menu.style.fontWeight = 'bold';
      }

      newSelection.appendChild(menu);
    });

    this.element.append(newSelection);
    
    // TODO: Try to animate this in the future
    // setTimeout(()=>newSelection.style.maxHeight = '', 100);
  }
}