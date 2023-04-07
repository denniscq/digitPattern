import Digit from "./digit";
import assert from "assert";

async function main() {
    const digit = new Digit();

    const case1 = await digit.detectPatterns('333');
    assert.deepEqual(case1, new Set(["AAA", "999"]));
    console.log('case1 passed');

    const case2 = await digit.detectPatterns('2112');
    assert.deepEqual(case2, new Set(["ABBA", "10K"]));
    console.log('case2 passed');

    const case3 = await digit.detectPatterns('45555');
    assert.deepEqual(case3, new Set(["ABBBB", "100K"]));
    console.log('case3 passed');

    const case4 = await digit.detectPatterns('888000');
    assert.deepEqual(case4, new Set(["AAABBB", "XXX000"]));
    console.log('case4 passed');

    const case5 = await digit.detectPatterns('0098');
    assert.deepEqual(case5, new Set(["10K", "AABC", "0XXX", "00XX"]));
    console.log('case5 passed');

    const case6 = await digit.detectPatterns('0x9832');
    assert.deepEqual(case6, new Set(["0X10K"]));
    console.log('case6 passed');

    const case7 = await digit.detectPatterns('0311');
    assert.deepEqual(case7, new Set(["ABCC", "0XXX", "10K", "MMDD"]));
    console.log('case7 passed');
}

main();
