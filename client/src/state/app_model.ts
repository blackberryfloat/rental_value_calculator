import type { PropertyModel } from "./property_model";

const STORAGE_KEY = "rental_calculator_app_model";

export class AppModel {
    properties: PropertyModel[] = [];

    static load(): AppModel {
        // TODO: support a schema version. can handle automatically by switching to indexedDB
        const data = localStorage.getItem(STORAGE_KEY);
        if (data) {
            const parsedData = JSON.parse(data);
            const appModel = new AppModel();
            appModel.properties = parsedData.properties || [];
            return appModel;
        }
        return new AppModel();
    }

    constructor() {}

    updateProperty(index: number, property: PropertyModel): void {
        if (index >= 0 && index < this.properties.length) {
            this.properties[index] = property;
        }
    }

    getProperty(index: number): PropertyModel | null {
        if (index >= 0 && index < this.properties.length) {
            return this.properties[index];
        }
        return null;
    }

    addProperty(property: PropertyModel): void {
        this.properties.unshift(property);
    }

    removeProperty(index: number): void {
        if (index >= 0 && index < this.properties.length) {
            this.properties.splice(index, 1);
        }
    }

    save(): void {
        console.debug("Saving app model to localStorage");
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this));
    }
}