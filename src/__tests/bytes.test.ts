import { extractABIDynamicArrayCopySlot, parseABIDynamicArrayReturnData, splitHexToBytes32Words } from "@/utils/bytes";
import { HashString } from "@/utils/types.generic";
import { describe, expect, it } from "vitest";

describe("splitHexToBytes32Words", () => {
  it("should handle empty string", () => {
    expect(splitHexToBytes32Words("").length).toBe(0);
  });

  it('should handle "0x" as empty input', () => {
    expect(splitHexToBytes32Words("0x")).toEqual([]);
  });

  it("should handle string with 0x prefix", () => {
    expect(splitHexToBytes32Words(testHex)).toEqual([testHex]);
  });

  it("should handle non 0x-prefixed hex string", () => {
    expect(splitHexToBytes32Words(nonPrefixedHex)).toEqual([testHex]);
  });

  it("should split into multiple chunks when input is longer than 32 bytes", () => {
    const input = `${testHex}aaaaaaaabbbbbbbbccccccccddddddddeeeeeeeeffffffffaaaaaaaabbbbbbbb`;
    const expected = [
      "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
      "0xaaaaaaaabbbbbbbbccccccccddddddddeeeeeeeeffffffffaaaaaaaabbbbbbbb",
    ];
    expect(splitHexToBytes32Words(input)).toEqual(expected);
  });

  it("should handle incomplete chunks by padding with zeros", () => {
    const input = `${testHex}aabbcc`;
    const expected = [
      "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
      "0xaabbcc0000000000000000000000000000000000000000000000000000000000",
    ];
    expect(splitHexToBytes32Words(input)).toEqual(expected);
  });

  it("should throw an error when input contains non-hex characters", () => {
    expect(() => splitHexToBytes32Words("0x123xyz")).toThrowError("Invalid hex string");
  });

  it("should throw on odd-length hex strings", () => {
    expect(() => splitHexToBytes32Words("0xabc")).toThrowError();
  });
});

describe("parseABIDynamicArrayReturnData", () => {
  describe("invalid return data", () => {
    it("should handle empty string", () => {
      expect(parseABIDynamicArrayReturnData("" as HashString)).toEqual({ summary: [], data: [] });
    });

    it("should handle strings with less than 2 32-byte words", () => {
      const hex: HashString = "0x1234567890abcdef1234567890abcdef1234567890abcdef";
      expect(() => parseABIDynamicArrayReturnData(hex)).toThrowError("Invalid return data: Not enough data to parse");
    });
  });

  describe("valid return data", () => {
    const { summary, data } = parseABIDynamicArrayReturnData(returnData);

    it("splits hex into 32-byte words", () => {
      expect(data).toMatchObject(words);
      expect(data.length).toBe(24);
    });

    it("extracts parsed 32-byte data length", () => {
      expect(summary.length).toBe(7);
    });

    describe("parsed ABI data", () => {
      it("parses each location of length index", () => {
        for (const [i, expectedIndex] of expected.locationOfLengthIndex.entries()) {
          expect(summary[i].locationOfLengthIndex).toBe(expectedIndex);
        }
      });

      it("parses each location of length index", () => {
        for (const [i, expectedIndex] of expected.locationOfLengthIndex.entries()) {
          expect(summary[i].locationOfLengthIndex).toBe(expectedIndex);
        }
      });

      it("parses each length index", () => {
        for (const [i, expectedIndex] of expected.lengthIndexes.entries()) {
          expect(summary[i].lengthIndex).toBe(expectedIndex);
        }
      });

      it("reads each length index correctly", () => {
        const arr = words.slice(2, 9); // location of lengths;

        for (const [i, lengthIndex] of arr.entries()) {
          const locationOfLength = Number(BigInt(lengthIndex) / 32n) + 2;
          expect(locationOfLength).toBe(expected.lengthIndexes[i]);
        }
      });

      it("parses each length", () => {
        for (const [i, expectedLength] of expected.lengths.entries()) {
          expect(summary[i].length).toBe(expectedLength);
        }
      });

      it("reads each return data and its index", () => {
        for (const [i, datum] of expected.data.entries()) {
          expect(summary[i].data).toMatchObject(datum);
        }
      });

      it("data indexes are > length index", () => {
        for (const [i, returnData] of summary.entries()) {
          for (const datum of returnData.data) {
            expect(datum.index).toBeGreaterThan(returnData.lengthIndex);
          }
        }
      });

      it("length index > location of length index", () => {
        for (const returnData of summary) {
          expect(returnData.locationOfLengthIndex).toBeLessThan(returnData.lengthIndex);
        }
      });
    });
  });
});

describe("extractABIDynamicArrayCopySlot", () => {
  it("returns the correct copy slot", () => {
    const extracted = extractABIDynamicArrayCopySlot(returnData, 4, 0);
    expect(extracted.copySlot).toBe(20);
  });
  it("throws if param index cannot be found", () => {
    const fn = () => extractABIDynamicArrayCopySlot(returnData, 4, 1);
    expect(fn).toThrowError("Unable to determine copy slot");
  });
  it("throws if function slot < 0", () => {
    const fn = () => extractABIDynamicArrayCopySlot(returnData, -1, 0);
    expect(fn).toThrowError("Invalid function or parameter index");
  });

  it("throws if param index < 0", () => {
    const fn = () => extractABIDynamicArrayCopySlot(returnData, 0, -1);
    expect(fn).toThrowError("Invalid function or parameter index");
  });

  it("throws if function slot > summary.length", () => {
    const fn = () => extractABIDynamicArrayCopySlot(returnData, 10, 0);
    expect(fn).toThrowError("Unable to determine copy slot");
  });
});

// DATA FOR TESTING.

const returnData: HashString =
  "0x0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000700000000000000000000000000000000000000000000000000000000000000e0000000000000000000000000000000000000000000000000000000000000012000000000000000000000000000000000000000000000000000000000000001a000000000000000000000000000000000000000000000000000000000000001e00000000000000000000000000000000000000000000000000000000000000220000000000000000000000000000000000000000000000000000000000000026000000000000000000000000000000000000000000000000000000000000002a000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000cb160455a3a6b94000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000001328f4e20a40438a4000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000";

const words: HashString[] = [
  // headers
  "0x0000000000000000000000000000000000000000000000000000000000000020", // 0
  "0x0000000000000000000000000000000000000000000000000000000000000007", // 1

  // pointers to length
  "0x00000000000000000000000000000000000000000000000000000000000000e0", // 2
  "0x0000000000000000000000000000000000000000000000000000000000000120", // 3
  "0x00000000000000000000000000000000000000000000000000000000000001a0", // 4
  "0x00000000000000000000000000000000000000000000000000000000000001e0", // 5
  "0x0000000000000000000000000000000000000000000000000000000000000220", // 6
  "0x0000000000000000000000000000000000000000000000000000000000000260", // 7
  "0x00000000000000000000000000000000000000000000000000000000000002a0", // 8

  // lengths -> data
  "0x0000000000000000000000000000000000000000000000000000000000000020", // 9
  "0x0000000000000000000000000000000000000000000000000000000000000001", // 10

  "0x0000000000000000000000000000000000000000000000000000000000000060", // 11
  "0x0000000000000000000000000000000000000000000000000000000000000020", // 12
  "0x0000000000000000000000000000000000000000000000000000000000000020", // 13
  "0x0000000000000000000000000000000000000000000000000000000000000001", // 14

  "0x0000000000000000000000000000000000000000000000000000000000000020", // 15
  "0x0000000000000000000000000000000000000000000000000cb160455a3a6b94", // 16

  "0x0000000000000000000000000000000000000000000000000000000000000020", // 17
  "0x0000000000000000000000000000000000000000000000000000000000000001", // 18

  "0x0000000000000000000000000000000000000000000000000000000000000020", // 19
  "0x000000000000000000000000000000000000000000000001328f4e20a40438a4", // 20

  "0x0000000000000000000000000000000000000000000000000000000000000020", // 21
  "0x0000000000000000000000000000000000000000000000000000000000000001", // 22

  "0x0000000000000000000000000000000000000000000000000000000000000000", // 23
];

const nonPrefixedHex = "1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef";
const testHex = `0x${nonPrefixedHex}`;

const expected = {
  locationOfLengthIndex: [2, 3, 4, 5, 6, 7, 8],
  lengthIndexes: [9, 11, 15, 17, 19, 21, 23],
  lengths: [1, 3, 1, 1, 1, 1, 0],
  data: [
    [{ data: "0x0000000000000000000000000000000000000000000000000000000000000001", index: 10 }],
    [
      { data: "0x0000000000000000000000000000000000000000000000000000000000000020", index: 12 },
      { data: "0x0000000000000000000000000000000000000000000000000000000000000020", index: 13 },
      { data: "0x0000000000000000000000000000000000000000000000000000000000000001", index: 14 },
    ],
    [{ data: "0x0000000000000000000000000000000000000000000000000cb160455a3a6b94", index: 16 }],
    [{ data: "0x0000000000000000000000000000000000000000000000000000000000000001", index: 18 }],
    [{ data: "0x000000000000000000000000000000000000000000000001328f4e20a40438a4", index: 20 }],
    [{ data: "0x0000000000000000000000000000000000000000000000000000000000000001", index: 22 }],
    [],
  ],
} as const;
