import { BaseProperty, PropertyType } from 'adminjs';
import { ModelAttributeColumnOptions } from 'sequelize/types';
declare class Property extends BaseProperty {
    private sequelizePath;
    private fieldName;
    constructor(sequelizePath: ModelAttributeColumnOptions);
    name(): string;
    isEditable(): boolean;
    isVisible(): boolean;
    isId(): boolean;
    reference(): string | null;
    availableValues(): Array<string> | null;
    isArray(): boolean;
    /**
     * @returns {PropertyType}
     */
    type(): PropertyType;
    isSortable(): boolean;
    isRequired(): boolean;
}
export default Property;
