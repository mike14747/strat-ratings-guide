import { OB_VALUE, TB_VALUE } from './constants';

type PositionRangeRatings = {
    1: { si: number, do: number, tr: number, gba: number },
    2: { si: number, do: number, tr: number, gba: number },
    3: { si: number, do: number, tr: number, gba: number },
    4: { si: number, do: number, tr: number, gba: number },
    5: { si: number, do: number, tr: number, gba: number },
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

const catcherRangeRatings: PositionRangeRatings = {
    1: { si: 0, do: 0, tr: 0, gba: 0 },
    2: { si: 0, do: 0, tr: 0, gba: 0 },
    3: { si: 0, do: 0, tr: 0, gba: 0 },
    4: { si: 0, do: 0, tr: 0, gba: 0 },
    5: { si: 0, do: 0, tr: 0, gba: 0 },
};

const infieldRangeRatings: PositionRangeRatings = {
    1: { si: 0, do: 0, tr: 0, gba: 0 },
    2: { si: 0, do: 0, tr: 0, gba: 0 },
    3: { si: 0, do: 0, tr: 0, gba: 0 },
    4: { si: 0, do: 0, tr: 0, gba: 0 },
    5: { si: 0, do: 0, tr: 0, gba: 0 },
};

const ofRangeRatings: PositionRangeRatings = {
    1: { si: 0, do: 0, tr: 0, gba: 0 },
    2: { si: 0, do: 0, tr: 0, gba: 0 },
    3: { si: 0, do: 0, tr: 0, gba: 0 },
    4: { si: 0, do: 0, tr: 0, gba: 0 },
    5: { si: 0, do: 0, tr: 0, gba: 0 },
};

const pitcherRangeRatings: PositionRangeRatings = {
    1: { si: 0, do: 0, tr: 0, gba: 0 },
    2: { si: 0, do: 0, tr: 0, gba: 0 },
    3: { si: 0, do: 0, tr: 0, gba: 0 },
    4: { si: 0, do: 0, tr: 0, gba: 0 },
    5: { si: 0, do: 0, tr: 0, gba: 0 },
};

const positions: Positions = {
    CA: { chances: 3, errorFactor: 0.0120, errorTypeRates: { e1: 0.9539, e2: 0.0461, e3: 0 }, rangeRatings: catcherRangeRatings },
    '1B': { chances: 2, errorFactor: 0.0180, errorTypeRates: { e1: 0, e2: 0, e3: 0 }, rangeRatings: infieldRangeRatings },
    '2B': { chances: 6, errorFactor: 0.0060, errorTypeRates: { e1: 0, e2: 0, e3: 0 }, rangeRatings: infieldRangeRatings },
    '3B': { chances: 3, errorFactor: 0.0120, errorTypeRates: { e1: 0, e2: 0, e3: 0 }, rangeRatings: infieldRangeRatings },
    SS: { chances: 7, errorFactor: 0.0052, errorTypeRates: { e1: 0, e2: 0, e3: 0 }, rangeRatings: infieldRangeRatings },
    LF: { chances: 2, errorFactor: 0.0180, errorTypeRates: { e1: 0, e2: 0, e3: 0 }, rangeRatings: ofRangeRatings },
    CF: { chances: 3, errorFactor: 0.0120, errorTypeRates: { e1: 0, e2: 0, e3: 0 }, rangeRatings: ofRangeRatings },
    RF: { chances: 2, errorFactor: 0.0180, errorTypeRates: { e1: 0, e2: 0, e3: 0 }, rangeRatings: ofRangeRatings },
    P: { chances: 2, errorFactor: 0.0180, errorTypeRates: { e1: 0, e2: 0, e3: 0 }, rangeRatings: pitcherRangeRatings },
};

console.log({ positions });

export function fieldingWopsCalculate(position: string, defRating: string) {
    console.log(position);
    const fieldingHits = (parseInt(defRating.charAt(0)) - 1) * 0.1 * 2;
    const fieldingErrors = parseInt(defRating.substring(2, 4)) * 0.0180 * 2;
    const fieldingTwoBaseErrorTotalBaseAdj = TB_VALUE * fieldingErrors / 20;

    const fieldingWopsOnHitsOnly = OB_VALUE * ((((2 - fieldingErrors) / 2) * (fieldingHits / 2)) * 2) + TB_VALUE * ((((2 - fieldingErrors) / 2) * (fieldingHits / 2)) * 2);
    const fieldingWopsOnErrorsOnly = OB_VALUE * ((((2 - fieldingHits) / 2) * (fieldingErrors / 2)) * 2) + TB_VALUE * ((((2 - fieldingHits) / 2) * (fieldingErrors / 2)) * 2);
    const fieldingWopsOnHitAndError = OB_VALUE * (((fieldingHits / 2) * (fieldingErrors / 2)) * 2) + 2 * TB_VALUE * (((fieldingHits / 2) * (fieldingErrors / 2)) * 2);

    // find a way to incorporate DP chances

    return fieldingWopsOnHitsOnly + fieldingWopsOnErrorsOnly + fieldingWopsOnHitAndError + fieldingTwoBaseErrorTotalBaseAdj;
}
