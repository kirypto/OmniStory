export interface NumericRange {
    low: number;
    high: number;
}

export function zoomRangeByDelta(inputRange: NumericRange, desiredDelta: number, limits: NumericRange): NumericRange {
    const inputSize = inputRange.high - inputRange.low;
    const limitsSize = limits.high - limits.low;
    const maxDelta = limitsSize - inputSize;
    const minDelta = -1 * inputSize;
    const delta = Math.max(minDelta, Math.min(maxDelta, desiredDelta));
    if (inputRange.high + delta / 2 > limits.high) {
        const remainingDelta = delta - (limits.high - inputRange.high);
        return {
            low: inputRange.low - remainingDelta,
            high: limits.high,
        };
    } else if (inputRange.low - delta / 2 < limits.low) {
        const remainingDelta = delta - (inputRange.low - limits.low);
        return {
            low: limits.low,
            high: inputRange.high + remainingDelta,
        };
    } else {
        return {
            low: inputRange.low - delta / 2,
            high: inputRange.high + delta / 2,
        };
    }
}

export function shiftRangeByDelta(inputRange: NumericRange, desiredDelta: number, limits: NumericRange): NumericRange {
    const maxDelta = limits.high - inputRange.high;
    const minDelta = limits.low - inputRange.low;
    const delta = Math.min(maxDelta, Math.max(minDelta, desiredDelta));
    return {
        low: inputRange.low + delta,
        high: inputRange.high + delta,
    };
}

export function sizeOf(inputRange: NumericRange): number {
    return inputRange.high - inputRange.low;
}
