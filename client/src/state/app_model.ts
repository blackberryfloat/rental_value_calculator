import { PropertyModel } from './property_model';

const STORAGE_KEY = 'rental_calculator_app_model';

export class AppModel {
  properties: PropertyModel[] = [];

  static load(): AppModel {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      return AppModel.fromJSON(parsed);
    }
    return new AppModel();
  }

  static fromJSON(o: any): AppModel {
    const appModel = new AppModel();
    appModel.properties = (o.properties || []).map(PropertyModel.fromJSON);
    return appModel;
  }

  save(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this));
  }

  constructor() {}

  /** Properties only object to reduce serialization size. */
  toJSON() {
    return { properties: this.properties };
  }

  updateProperty(index: number, property: PropertyModel): void {
    console.debug('Updating property at index', index, 'with', property);
    if (index >= 0 && index < this.properties.length) {
      this.properties[index] = property;
    }
  }

  getProperty(index: number): PropertyModel | null {
    console.debug('Getting property at index', index);
    if (index >= 0 && index < this.properties.length) {
      return this.properties[index];
    }
    return null;
  }

  addProperty(property: PropertyModel): void {
    console.debug('Adding property', property);
    this.properties.unshift(property);
  }

  removeProperty(index: number): void {
    console.debug('Removing property at index', index);
    if (index >= 0 && index < this.properties.length) {
      this.properties.splice(index, 1);
    }
  }
}
