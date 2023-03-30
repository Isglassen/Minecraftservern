type pagesContainer = {
  pages: pages;
  options?: {
    basePath?: string
  }
}

type pages = page[]

type page = {
  color: string;
  name: string;
  categories: pages;
  link: string;
}

class HeaderControl {
  element: JQuery<HTMLElement>

  public getTextColor(rgbString: string) {
    const values = rgbString.slice(rgbString.indexOf('(') + 1, rgbString.indexOf(')')).split(',')
    const rgb: { r: number, g: number, b: number } = { r: null, g: null, b: null }

    rgb.r = parseInt(values[0])
    rgb.g = parseInt(values[1])
    rgb.b = parseInt(values[2])

    const brightness = Math.round(((rgb[0] * 299) +
      (rgb[1] * 587) +
      (rgb[2] * 114)) / 1000);
    const textColour = (brightness > 125) ? 'black' : 'white';

    return textColour
  }

  constructor(current: string[], contentJson: pagesContainer, currentName: string) {
    let currentData: page = { color: "", name: "", link: "", categories: contentJson.pages };
    current.forEach((name) => {
      currentData = currentData.categories.filter((value) => value.name == name)[0]
      console.log(currentData);
    })

    let element = $("#header");
    this.element = element;

    console.log(this.element);

    element.css("display", "flex");
    element.css("background-color", currentData.color);

    element.css("color", this.getTextColor(element.css("background-color")))

    const pageTitle = document.createElement("div");
    pageTitle.style.display = "flex";
    pageTitle.style.flexDirection = "column";
    pageTitle.style.textAlign = "center";

    const pageGroup = document.createElement("span");
    pageGroup.appendChild(document.createTextNode(currentData.name));
    pageGroup.id = "main-title";

    const currentCatagory = document.createElement("span");
    currentCatagory.appendChild(document.createTextNode(currentName));
    currentCatagory.id = "sub-title";

    pageTitle.appendChild(pageGroup);
    pageTitle.appendChild(currentCatagory);

    element.append(pageTitle);
  }
}