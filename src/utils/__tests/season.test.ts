import { describe, expect, it } from "vitest";
import { calculateCropScales, seasonCutOffFor150, seasonCutOffFor200 } from "../season";

const onePercentScalar = 1e20 * 0.01;
const twoPercentScalar = 1e20 * 0.02;
const twentyFivePercentScalar = 1e20 * 0.25;
const thirtyThreePercentScalar = 1e20 * 0.33;
const fiftyPercentScalar = 1e20 * 0.5;
const seventyFivePercentScalar = 1e20 * 0.75;
const ninetyNinePercentScalar = 1e20 * 0.99;

// crop ratio max 100%
const firstCaseExpected = {
  0: {
    cropScalar: 0,
    cropRatio: 50,
  },
  [onePercentScalar]: {
    cropScalar: 1,
    cropRatio: 50.5,
  },
  [twoPercentScalar]: {
    cropScalar: 2,
    cropRatio: 51,
  },
  [twentyFivePercentScalar]: {
    cropScalar: 25,
    cropRatio: 62.5,
  },
  [thirtyThreePercentScalar]: {
    cropScalar: 33,
    cropRatio: 66.5,
  },
  [fiftyPercentScalar]: {
    cropScalar: 50,
    cropRatio: 75,
  },
  [seventyFivePercentScalar]: {
    cropScalar: 75,
    cropRatio: 87.5,
  },
  [ninetyNinePercentScalar]: {
    cropScalar: 99,
    cropRatio: 99.5,
  },
  1e20: {
    cropScalar: 100,
    cropRatio: 100,
  },
};

const firstCaseExpectedRaining = {
  0: {
    cropScalar: 0,
    cropRatio: 33,
  },
  [onePercentScalar]: {
    cropScalar: 1,
    cropRatio: 33.7,
  },
  [twoPercentScalar]: {
    cropScalar: 2,
    cropRatio: 34.3,
  },
  [twentyFivePercentScalar]: {
    cropScalar: 25,
    cropRatio: 49.8,
  },
  [thirtyThreePercentScalar]: {
    cropScalar: 33,
    cropRatio: 55.1,
  },
  [fiftyPercentScalar]: {
    cropScalar: 50,
    cropRatio: 66.5,
  },
  [seventyFivePercentScalar]: {
    cropScalar: 75,
    cropRatio: 83.3,
  },
  [ninetyNinePercentScalar]: {
    cropScalar: 99,
    cropRatio: 99.3,
  },
  1e20: {
    cropScalar: 100,
    cropRatio: 100,
  },
};

//crop ratio max 150%
const secondCaseExpected = {
  0: {
    cropScalar: 0,
    cropRatio: 50,
  },
  [onePercentScalar]: {
    cropScalar: 1,
    cropRatio: 51,
  },
  [twoPercentScalar]: {
    cropScalar: 2,
    cropRatio: 52,
  },
  [twentyFivePercentScalar]: {
    cropScalar: 25,
    cropRatio: 75,
  },
  [thirtyThreePercentScalar]: {
    cropScalar: 33,
    cropRatio: 83,
  },
  [fiftyPercentScalar]: {
    cropScalar: 50,
    cropRatio: 100,
  },
  [seventyFivePercentScalar]: {
    cropScalar: 75,
    cropRatio: 125,
  },
  [ninetyNinePercentScalar]: {
    cropScalar: 99,
    cropRatio: 149,
  },
  1e20: {
    cropScalar: 100,
    cropRatio: 150,
  },
};

// crop ratio max 200%
const thirdCaseExpected = {
  0: {
    cropScalar: 0,
    cropRatio: 50,
  },
  [onePercentScalar]: {
    cropScalar: 1,
    cropRatio: 51.5,
  },
  [twoPercentScalar]: {
    cropScalar: 2,
    cropRatio: 53,
  },
  [twentyFivePercentScalar]: {
    cropScalar: 25,
    cropRatio: 87.5,
  },
  [thirtyThreePercentScalar]: {
    cropScalar: 33,
    cropRatio: 99.5,
  },
  [fiftyPercentScalar]: {
    cropScalar: 50,
    cropRatio: 125,
  },
  [seventyFivePercentScalar]: {
    cropScalar: 75,
    cropRatio: 162.5,
  },
  [ninetyNinePercentScalar]: {
    cropScalar: 99,
    cropRatio: 198.5,
  },
  1e20: {
    cropScalar: 100,
    cropRatio: 200,
  },
};

describe("calculateCropScales", () => {
  it.each(Object.keys(firstCaseExpected))(
    "should calculate crop scalars correctly for seasons where crop ratio max is 100%",
    (cropScalarInput) => {
      const expectedCropScales = firstCaseExpected[cropScalarInput];
      const cropScales = calculateCropScales(Number(cropScalarInput), false, 1);
      expect(cropScales).toEqual(expectedCropScales);
    },
  );
  it.each(Object.keys(firstCaseExpectedRaining))(
    "should calculate crop scalars correctly for seasons where crop ratio max is 100% and it is raining",
    (cropScalarInput) => {
      const expectedCropScales = firstCaseExpectedRaining[cropScalarInput];
      const cropScales = calculateCropScales(Number(cropScalarInput), true, 1);
      expect(cropScales).toEqual(expectedCropScales);
    },
  );
  it.each(Object.keys(secondCaseExpected))(
    "should calculate crop scalars correctly for seasons where crop ratio max is 150%",
    (cropScalarInput) => {
      const expectedCropScales = secondCaseExpected[cropScalarInput];
      const cropScales = calculateCropScales(Number(cropScalarInput), false, seasonCutOffFor150);
      expect(cropScales).toEqual(expectedCropScales);
    },
  );
  it.each(Object.keys(thirdCaseExpected))(
    "should calculate crop scalars correctly for seasons where crop ratio max is 200%",
    (cropScalarInput) => {
      const expectedCropScales = thirdCaseExpected[cropScalarInput];
      const cropScales = calculateCropScales(Number(cropScalarInput), false, seasonCutOffFor200);
      expect(cropScales).toEqual(expectedCropScales);
    },
  );
});
