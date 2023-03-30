var HeaderControl = /** @class */ (function () {
    function HeaderControl(current, contentJson, currentName) {
        var currentData = { color: "", name: "", link: "", categories: contentJson.pages };
        current.forEach(function (name) {
            currentData = currentData.categories.filter(function (value) { return value.name == name; })[0];
            console.log(currentData);
        });
        var element = $("#header");
        this.element = element;
        console.log(this.element);
        element.css("display", "flex");
        element.css("background-color", currentData.color);
        element.css("color", this.getTextColor(element.css("background-color")));
        var pageTitle = document.createElement("div");
        pageTitle.style.display = "flex";
        pageTitle.style.flexDirection = "column";
        pageTitle.style.textAlign = "center";
        var pageGroup = document.createElement("span");
        pageGroup.appendChild(document.createTextNode(currentData.name));
        pageGroup.id = "main-title";
        var currentCatagory = document.createElement("span");
        currentCatagory.appendChild(document.createTextNode(currentName));
        currentCatagory.id = "sub-title";
        pageTitle.appendChild(pageGroup);
        pageTitle.appendChild(currentCatagory);
        element.append(pageTitle);
    }
    HeaderControl.prototype.getTextColor = function (rgbString) {
        var values = rgbString.slice(rgbString.indexOf('(') + 1, rgbString.indexOf(')')).split(',');
        var rgb = { r: null, g: null, b: null };
        rgb.r = parseInt(values[0]);
        rgb.g = parseInt(values[1]);
        rgb.b = parseInt(values[2]);
        var brightness = Math.round(((rgb[0] * 299) +
            (rgb[1] * 587) +
            (rgb[2] * 114)) / 1000);
        var textColour = (brightness > 125) ? 'black' : 'white';
        return textColour;
    };
    return HeaderControl;
}());
