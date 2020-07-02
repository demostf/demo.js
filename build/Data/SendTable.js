"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SendPropDefinition_1 = require("./SendPropDefinition");
class SendTable {
    constructor(name) {
        this.name = name;
        this.props = [];
        this.cachedFlattenedProps = [];
    }
    addProp(prop) {
        this.props.push(prop);
    }
    getAllProps(excludes, props) {
        const localProps = [];
        this.getAllPropsIteratorProps(excludes, localProps, props);
        for (const localProp of localProps) {
            props.push(localProp);
        }
    }
    getAllPropsIteratorProps(excludes, props, childProps) {
        for (const prop of this.props) {
            if (prop.hasFlag(SendPropDefinition_1.SendPropFlag.SPROP_EXCLUDE)) {
                continue;
            }
            if (excludes.filter((exclude) => {
                return exclude.name === prop.name && exclude.excludeDTName === prop.ownerTableName;
            }).length > 0) {
                continue;
            }
            if (prop.type === SendPropDefinition_1.SendPropType.DPT_DataTable && prop.table) {
                if (prop.hasFlag(SendPropDefinition_1.SendPropFlag.SPROP_COLLAPSIBLE)) {
                    prop.table.getAllPropsIteratorProps(excludes, props, childProps);
                }
                else {
                    prop.table.getAllProps(excludes, childProps);
                }
            }
            else {
                props.push(prop);
            }
        }
    }
    get flattenedProps() {
        if (this.cachedFlattenedProps.length === 0) {
            this.flatten();
        }
        return this.cachedFlattenedProps;
    }
    get excludes() {
        let result = [];
        for (const prop of this.props) {
            if (prop.hasFlag(SendPropDefinition_1.SendPropFlag.SPROP_EXCLUDE)) {
                result.push(prop);
            }
            else if (prop.type === SendPropDefinition_1.SendPropType.DPT_DataTable && prop.table) {
                result = result.concat(prop.table.excludes);
            }
        }
        return result;
    }
    flatten() {
        const excludes = this.excludes;
        const props = [];
        this.getAllProps(excludes, props);
        // sort often changed props before the others
        let start = 0;
        for (let i = 0; i < props.length; i++) {
            if (props[i].hasFlag(SendPropDefinition_1.SendPropFlag.SPROP_CHANGES_OFTEN)) {
                if (i !== start) {
                    const temp = props[i];
                    props[i] = props[start];
                    props[start] = temp;
                }
                start++;
            }
        }
        this.cachedFlattenedProps = props;
    }
}
exports.SendTable = SendTable;
//# sourceMappingURL=SendTable.js.map