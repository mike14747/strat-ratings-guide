type CastingToptions = {
    castInts: number[];
    castFloats: number[];
    castStrings: number[];
    possibleNull: number[];
}

export default function castCellTypes(rowNumber: number, colNumber: number, value: string | number | null, castingOptions: CastingToptions) {
    if (castingOptions.castInts.includes(colNumber)) {
        if (typeof value === 'number' && Number.isInteger(value)) return value;
        if (typeof value === 'string' && /^-?\d+$/.test(value)) return parseInt(value, 10);
        throw new TypeError(`Value in row/column: "${rowNumber}/${colNumber}" was expected to be an "integer", but instead was: "${value}"... a "${typeof (value)}" type.`);
    } else if (castingOptions.castFloats.includes(colNumber)) {
        if (typeof value === 'number') return value;
        if (typeof value === 'string' && /^-?\d*\.?\d+$/.test(value)) return parseFloat(value);
        // if the value is a string, the regular expression matches an optional leading minus sign, zero or more digits before an optional decimal point, an optional decimal point, then one or more digits after an optional decimal point (to confirm it is a string containing only number characters... including decimal numbers)
        throw new TypeError(`Value in row/column: "${rowNumber}/${colNumber}" was expected to be a "number", but instead was: "${value}"... a "${typeof (value)}" type.`);
    } else if (castingOptions.castStrings.includes(colNumber)) {
        return value || value === 0 ? value.toString() : '';
    } else if (castingOptions.possibleNull.includes(colNumber)) {
        if (!value) return null;
        if (typeof value === 'number' && Number.isInteger(value)) return value;
        if (typeof value === 'string' && /^\d+$/.test(value)) return parseInt(value, 10);
        throw new TypeError(`Row/column: "${rowNumber}/${colNumber}" was expected to be either "empty" or an "integer", but instead was: "${value}"... a "${typeof (value)}" type.`);
    } else {
        return value;
    }
}
