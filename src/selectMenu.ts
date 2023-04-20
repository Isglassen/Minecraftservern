type OnUpdate = (oldValue: string | null, newValue: string) => void;

type Stringable = {
  toString: () => string;
}

type SelectValues = (SelectValue | string)[]
type SelectValue = { name: string, value: string }

class SelectMenu {
  onUpdate: OnUpdate;
  element: HTMLSelectElement;
  currentValue: string | null;

  onChange() {
    const newValue = this.element.value;
    this.onUpdate(this.currentValue, newValue);
    this.currentValue = newValue;
  }

  constructor(id: string, values: SelectValues, startValue: string | null, onUpdate: OnUpdate) {
    this.element = document.createElement('select');
    this.element.id = id;
    $(this.element).on('change', () => this.onChange());

    values.forEach((value) => {
      const newElement = document.createElement('option');

      let data: SelectValue;

      if (typeof value == "string") {
        data = { name: value, value: value};
      } else {
        data = value;
      }

      newElement.setAttribute('label', data.name);
      newElement.setAttribute('value', data.value);
      if (data.value == startValue) {
        newElement.setAttribute('selected', '');
      }

      this.element.appendChild(newElement);
    });

    this.onUpdate = onUpdate;

    if (startValue != null) this.onUpdate(null, startValue);
  }
}