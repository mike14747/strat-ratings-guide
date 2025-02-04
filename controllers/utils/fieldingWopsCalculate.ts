import { OB_VALUE, TB_VALUE } from './constants';
import positionMap from './positionMap';
import { PositionRangeRatings, Positions, DefRating, RangeRating, FieldingArrayItems } from '../../types';

// constants
const catcherRangeRatings: PositionRangeRatings = {
    1: { si: 0, do: 0, tr: 0, gba: 0.10 },
    2: { si: 0, do: 0, tr: 0, gba: 0.05 },
    3: { si: 0, do: 0, tr: 0, gba: 0 },
    4: { si: 0, do: 0, tr: 0, gba: 0 },
    5: { si: 0, do: 0, tr: 0, gba: 0 },
};

const infieldRangeRatings: PositionRangeRatings = {
    1: { si: 0, do: 0, tr: 0, gba: 0.65 },
    2: { si: 0.10, do: 0, tr: 0, gba: 0.45 },
    3: { si: 0.20, do: 0, tr: 0, gba: 0.25 },
    4: { si: 0.30, do: 0, tr: 0, gba: 0.15 },
    5: { si: 0.40, do: 0, tr: 0, gba: 0.05 },
};

const ofRangeRatings: PositionRangeRatings = {
    1: { si: 0, do: 0, tr: 0, gba: 0 },
    2: { si: 0.10, do: 0.05, tr: 0, gba: 0 },
    3: { si: 0.15, do: 0.15, tr: 0, gba: 0 },
    4: { si: 0.35, do: 0.15, tr: 0.05, gba: 0 },
    5: { si: 0.40, do: 0.25, tr: 0.10, gba: 0 },
};

const pitcherRangeRatings: PositionRangeRatings = {
    1: { si: 0, do: 0, tr: 0, gba: 0.25 },
    2: { si: 0.10, do: 0, tr: 0, gba: 0.20 },
    3: { si: 0.15, do: 0, tr: 0, gba: 0.15 },
    4: { si: 0.20, do: 0, tr: 0, gba: 0.10 },
    5: { si: 0.30, do: 0, tr: 0, gba: 0.05 },
};

const positions: Positions = {
    CA: { chances: 3, errorFactor: 0.0120, errorTypeRates: { e1: 0.9500, e2: 0.0500, e3: 0 }, rangeRatings: catcherRangeRatings },
    '1B': { chances: 2, errorFactor: 0.0180, errorTypeRates: { e1: 0.9500, e2: 0.0500, e3: 0 }, rangeRatings: infieldRangeRatings },
    '2B': { chances: 6, errorFactor: 0.0060, errorTypeRates: { e1: 0.9000, e2: 0.1000, e3: 0 }, rangeRatings: infieldRangeRatings },
    '3B': { chances: 3, errorFactor: 0.0120, errorTypeRates: { e1: 0.8000, e2: 0.2000, e3: 0 }, rangeRatings: infieldRangeRatings },
    SS: { chances: 7, errorFactor: 0.00515, errorTypeRates: { e1: 0.8500, e2: 0.1500, e3: 0 }, rangeRatings: infieldRangeRatings },
    LF: { chances: 2, errorFactor: 0.0180, errorTypeRates: { e1: 0.2000, e2: 0.7500, e3: 0.0500 }, rangeRatings: ofRangeRatings },
    CF: { chances: 3, errorFactor: 0.0120, errorTypeRates: { e1: 0.2000, e2: 0.7500, e3: 0.0500 }, rangeRatings: ofRangeRatings },
    RF: { chances: 2, errorFactor: 0.0180, errorTypeRates: { e1: 0.2000, e2: 0.7500, e3: 0.0500 }, rangeRatings: ofRangeRatings },
    P: { chances: 2, errorFactor: 0.0180, errorTypeRates: { e1: 0.9500, e2: 0.0500, e3: 0 }, rangeRatings: pitcherRangeRatings },
};

// ------------------------------

// functions

export function calculateObTbDpFromArr(posENumArr: FieldingArrayItems[]) {
    return posENumArr.map(item => {
        const { position, defRating } = item;
        if (!(position in positions)) throw new Error(`Invalid position: ${position}. The only valid positions are: 'CA, 1B, 2B, 3B, SS, LF, CF, RF, P'... and they are case sensitive.`);
        if (!/^[1-5]e\d{1,2}$/.test(defRating)) throw new Error(`The value passed (${defRating}) was in not proper format for a defensive rating.`);

        const positionValues: Positions[keyof Positions] = positions[position];
        const rangeRating: RangeRating = defRating.charAt(0) as RangeRating;
        const eNum: number = parseInt(defRating.substring(2, 4));
        const hitDPValues: PositionRangeRatings[RangeRating] = positions[position].rangeRatings[rangeRating];

        const fieldingHitPercent = (hitDPValues.si + hitDPValues.do + hitDPValues.tr);
        const fieldingHits = positionValues.chances * (hitDPValues.si + hitDPValues.do + hitDPValues.tr);
        const fieldingHitsTotalBases = positionValues.chances * (hitDPValues.si + (2 * hitDPValues.do) + (3 * hitDPValues.tr));

        const fieldingErrorPercent = positionValues.errorFactor * eNum;
        const fieldingErrors = positionValues.chances * positionValues.errorFactor * eNum;
        const fieldingErrorsTotalBases = positionValues.chances * ((fieldingErrorPercent * positionValues.errorTypeRates.e1) + (2 * fieldingErrorPercent * positionValues.errorTypeRates.e2) + (3 * fieldingErrorPercent * positionValues.errorTypeRates.e3));

        // const ob = ((fieldingHits + fieldingErrors) - (the times there's a hit and an error)),toFixed(3);
        const ob = ((fieldingHits + fieldingErrors) - (positionValues.chances * (fieldingHitPercent * fieldingErrorPercent))).toFixed(3);

        const tb = (fieldingHitsTotalBases + fieldingErrorsTotalBases).toFixed(3);

        // gba chances when there is not an error
        const dp = ((positionValues.chances * hitDPValues.gba) * (1 - fieldingErrorPercent)).toFixed(3);
        return { position, defRating, ob, tb, dp };
    });
}

export function fieldingWopsCalculate(position: keyof Positions, defRating: DefRating) {
    if (!(position in positions)) throw new Error(`Invalid position: ${position}. The only valid positions are: 'CA, 1B, 2B, 3B, SS, LF, CF, RF, P'... and they are case sensitive.`);
    if (!/^[1-5]e\d{1,2}$/.test(defRating)) throw new Error(`The value passed (${defRating}) was in not proper format for a defensive rating.`);

    const ratingKey = `${position}-${defRating}`;
    const obTbDpValues = positionMap.get(ratingKey);

    if (!obTbDpValues) throw new Error(`${position} with the defensive rating of ${defRating} could not matched with anything on record.`);

    if (position === 'P') return (OB_VALUE * obTbDpValues.ob) + (TB_VALUE * obTbDpValues.tb) - (OB_VALUE * 20 * obTbDpValues.dp / 108);

    const defWOps = (OB_VALUE * 20 * obTbDpValues.dp / 108) - (OB_VALUE * obTbDpValues.ob) - (TB_VALUE * obTbDpValues.tb);
    return Number((9 * defWOps).toFixed(2));
}
