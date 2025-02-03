import { OB_VALUE, TB_VALUE } from './constants';

type PositionRangeRatings = {
    [key in '1' | '2' | '3' | '4' | '5']: { si: number, do: number, tr: number, gba: number };
};

type Positions = {
    CA: { chances: number, errorFactor: number, errorTypeRates: { e1: number, e2: number, e3: number }, rangeRatings: PositionRangeRatings },
    '1B': { chances: number, errorFactor: number, errorTypeRates: { e1: number, e2: number, e3: number }, rangeRatings: PositionRangeRatings },
    '2B': { chances: number, errorFactor: number, errorTypeRates: { e1: number, e2: number, e3: number }, rangeRatings: PositionRangeRatings },
    '3B': { chances: number, errorFactor: number, errorTypeRates: { e1: number, e2: number, e3: number }, rangeRatings: PositionRangeRatings },
    SS: { chances: number, errorFactor: number, errorTypeRates: { e1: number, e2: number, e3: number }, rangeRatings: PositionRangeRatings },
    LF: { chances: number, errorFactor: number, errorTypeRates: { e1: number, e2: number, e3: number }, rangeRatings: PositionRangeRatings },
    CF: { chances: number, errorFactor: number, errorTypeRates: { e1: number, e2: number, e3: number }, rangeRatings: PositionRangeRatings },
    RF: { chances: number, errorFactor: number, errorTypeRates: { e1: number, e2: number, e3: number }, rangeRatings: PositionRangeRatings },
    P: { chances: number, errorFactor: number, errorTypeRates: { e1: number, e2: number, e3: number }, rangeRatings: PositionRangeRatings },
};

type DefRating =
    `1e${number}`
    | `1e${number}${number}`
    | `2e${number}`
    | `2e${number}${number}`
    | `3e${number}`
    | `3e${number}${number}`
    | `4e${number}`
    | `4e${number}${number}`
    | `5e${number}`
    | `5e${number}${number}`
;

type RangeRating = '1'| '2' | '3' | '4' | '5';

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
    CA: { chances: 3, errorFactor: 0.0120, errorTypeRates: { e1: 0.9539, e2: 0.0461, e3: 0 }, rangeRatings: catcherRangeRatings },
    '1B': { chances: 2, errorFactor: 0.0180, errorTypeRates: { e1: 0.9519, e2: 0.0481, e3: 0 }, rangeRatings: infieldRangeRatings },
    '2B': { chances: 6, errorFactor: 0.0060, errorTypeRates: { e1: 0.8969, e2: 0.1031, e3: 0 }, rangeRatings: infieldRangeRatings },
    '3B': { chances: 3, errorFactor: 0.0120, errorTypeRates: { e1: 0.8003, e2: 0.1997, e3: 0 }, rangeRatings: infieldRangeRatings },
    SS: { chances: 7, errorFactor: 0.0052, errorTypeRates: { e1: 0.8500, e2: 0.1500, e3: 0 }, rangeRatings: infieldRangeRatings },
    LF: { chances: 2, errorFactor: 0.0180, errorTypeRates: { e1: 0.2015, e2: 0.7538, e3: 0.0508 }, rangeRatings: ofRangeRatings },
    CF: { chances: 3, errorFactor: 0.0120, errorTypeRates: { e1: 0.2080, e2: 0.7428, e3: 0.0537 }, rangeRatings: ofRangeRatings },
    RF: { chances: 2, errorFactor: 0.0180, errorTypeRates: { e1: 0.2015, e2: 0.7538, e3: 0.0508 }, rangeRatings: ofRangeRatings },
    P: { chances: 2, errorFactor: 0.0180, errorTypeRates: { e1: 0.9486, e2: 0.0514, e3: 0 }, rangeRatings: pitcherRangeRatings },
};

export function fieldingWopsCalculate(position: keyof Positions, defRating: DefRating) {
    if (!(position in positions)) throw new Error(`Invalid position: ${position}. The only valid positions are: 'CA, 1B, 2B, 3B, SS, LF, CF, RF, P'... and they are case sensitive.`);
    if (!/^[1-5]e\d{1,2}$/.test(defRating)) throw new Error(`The value passed (${defRating}) was in not proper format for a defensive rating.`);

    const positionValues: Positions[keyof Positions] = positions[position];
    const rangeRating: RangeRating = defRating.charAt(0) as RangeRating;
    const eNum: number = parseInt(defRating.substring(2, 4));
    const hitDPValues: PositionRangeRatings[RangeRating] = positions[position].rangeRatings[rangeRating];

    // const fieldingHits = (parseInt(defRating.charAt(0)) - 1) * 0.1 * 2;
    const fieldingHitPercent = (hitDPValues.si + hitDPValues.do + hitDPValues.tr);
    const fieldingHits = positionValues.chances * (hitDPValues.si + hitDPValues.do + hitDPValues.tr);
    const fieldingHitsTotalBases = positionValues.chances * (hitDPValues.si + (2 * hitDPValues.do) + (3 * hitDPValues.tr));

    // const fieldingErrors = parseInt(defRating.substring(2, 4)) * 0.0180 * 2;
    const fieldingErrorPercent = positionValues.errorFactor * eNum;
    const fieldingErrors = positionValues.chances * positionValues.errorFactor * eNum;
    const fieldingErrorsTotalBases = fieldingErrors + (1 * positionValues.errorTypeRates.e2) + (2 * positionValues.errorTypeRates.e3);

    const dp = (positionValues.chances * hitDPValues.gba) * (1 - (positionValues.errorFactor * eNum));
    const dpEffect = OB_VALUE * 20 * dp / 108;

    console.log({ fieldingHitPercent, fieldingHits, fieldingHitsTotalBases, fieldingErrorPercent, fieldingErrors, fieldingErrorsTotalBases, dp, dpEffect });

    // const fieldingTwoBaseErrorTotalBaseAdj = TB_VALUE * fieldingErrors / 20;
    // const fieldingWopsOnHitsOnly = OB_VALUE * ((((2 - fieldingErrors) / 2) * (fieldingHits / 2)) * 2) + TB_VALUE * ((((2 - fieldingErrors) / 2) * (fieldingHits / 2)) * 2);
    // const fieldingWopsOnErrorsOnly = OB_VALUE * ((((2 - fieldingHits) / 2) * (fieldingErrors / 2)) * 2) + TB_VALUE * ((((2 - fieldingHits) / 2) * (fieldingErrors / 2)) * 2);
    // const fieldingWopsOnHitAndError = OB_VALUE * (((fieldingHits / 2) * (fieldingErrors / 2)) * 2) + 2 * TB_VALUE * (((fieldingHits / 2) * (fieldingErrors / 2)) * 2);

    // return fieldingWopsOnHitsOnly + fieldingWopsOnErrorsOnly + fieldingWopsOnHitAndError + fieldingTwoBaseErrorTotalBaseAdj;

    const fieldingWopsOnHitsOnly = OB_VALUE * (fieldingHits * (1 - fieldingErrorPercent)) + TB_VALUE * (fieldingHitsTotalBases * (1 - fieldingErrorPercent));
    const fieldingWopsOnErrorsOnly = OB_VALUE * (fieldingErrors * (1 - fieldingHitPercent)) + TB_VALUE * (fieldingErrorsTotalBases * (1 - fieldingHitPercent));
    const fieldingWopsOnHitAndError = OB_VALUE * (positionValues.chances * fieldingHitPercent * fieldingErrorPercent) + TB_VALUE * ((fieldingHitPercent * fieldingHitsTotalBases) + (fieldingErrorPercent * fieldingErrorsTotalBases));

    return (fieldingWopsOnHitsOnly + fieldingWopsOnErrorsOnly + fieldingWopsOnHitAndError - dpEffect).toFixed(1);
}
