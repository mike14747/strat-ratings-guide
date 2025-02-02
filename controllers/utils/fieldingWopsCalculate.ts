import { OB_VALUE, TB_VALUE } from './constants';

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
