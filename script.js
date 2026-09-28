/* =========================================================
   Math AI
   数学I・A Calculator Engine
========================================================= */


/* =========================================================
   ELEMENTS
========================================================= */

const input = document.getElementById("mathInput");
const result = document.getElementById("result");
const calculateButton = document.getElementById("calculateButton");
const solution = document.getElementById("solution");

const themeToggle = document.getElementById("themeToggle");
const aiToggle = document.getElementById("aiToggle");
const aiPanel = document.getElementById("aiPanel");
const aiClose = document.getElementById("aiClose");


/* =========================================================
   MAIN
========================================================= */

function calculate() {

    const raw = input.value.trim();

    if (raw === "") {
        showEmpty();
        return;
    }

    const text = normalizeText(raw);


    /* -----------------------------------------
       日本語数学問題
    ----------------------------------------- */

    const japanese =
        solveJapaneseProblem(text);

    if (japanese !== null) {
        showAnswer(
            japanese.answer,
            japanese.solution
        );
        return;
    }


    /* -----------------------------------------
       数式
    ----------------------------------------- */

    const equation =
        solveEquation(text);

    if (equation !== null) {
        showAnswer(
            equation.answer,
            equation.solution
        );
        return;
    }


    /* -----------------------------------------
       普通の計算
    ----------------------------------------- */

    const expression =
        solveExpression(text);

    if (expression !== null) {
        showAnswer(
            expression.answer,
            expression.solution
        );
        return;
    }


    showError();
}


/* =========================================================
   NORMALIZE
========================================================= */

function normalizeText(text) {

    return text
        .replace(/　/g, "")
        .replace(/\s+/g, "")
        .replace(/×/g, "*")
        .replace(/÷/g, "/")
        .replace(/＋/g, "+")
        .replace(/−/g, "-")
        .replace(/ー/g, "-")
        .replace(/＝/g, "=")
        .replace(/√/g, "√")
        .replace(/²/g, "^2")
        .replace(/³/g, "^3")
        .replace(/π/g, "π")
        .replace(/，/g, ",")
        .replace(/、/g, ",");
}


/* =========================================================
   JAPANESE PROBLEM ENGINE
========================================================= */

function solveJapaneseProblem(text) {


    /* =====================================================
       場合の数
    ===================================================== */


    /* -----------------------------------------
       円順列
    ----------------------------------------- */

    let match =
        text.match(
            /(\d+)人.*?(円形|円.*?並|円.*?ならべ)/
        );

    if (match) {

        const n = Number(match[1]);

        if (n >= 1) {

            const answer =
                factorial(n - 1);

            return {
                answer: `${answer}通り`,
                solution: steps([
                    ["STEP 1", `${n}人を円形に並べる`],
                    ["STEP 2", `円順列なので (${n}−1)!`],
                    ["STEP 3", `${n - 1}! = ${answer}`],
                    ["ANSWER", `${answer}通り`]
                ])
            };
        }
    }


    /* -----------------------------------------
       「会長、副会長」など役職
    ----------------------------------------- */

    match =
        text.match(
            /(\d+)人.*?(?:から|中から).*?(\d+)人.*?(会長|委員長|代表|部長|書記).*?,.*?(\d+)人.*?(副会長|副委員長|副代表|副部長).*?選/
        );

    if (match) {

        const n = Number(match[1]);
        const r1 = Number(match[2]);
        const role1 = match[3];

        const r2 = Number(match[4]);
        const role2 = match[5];

        if (r1 + r2 <= n) {

            const a = combination(n, r1);
            const b = combination(n - r1, r2);

            const answer = a * b;

            return {
                answer: `${answer}通り`,
                solution: steps([
                    ["STEP 1",
                        `${role1}：${n}人から${r1}人 → ${a}通り`
                    ],
                    ["STEP 2",
                        `${role2}：残り${n-r1}人から${r2}人 → ${b}通り`
                    ],
                    ["STEP 3",
                        `${a} × ${b} = ${answer}`
                    ],
                    ["ANSWER",
                        `${answer}通り`
                    ]
                ])
            };
        }
    }


    /* -----------------------------------------
       重複組合せ
    ----------------------------------------- */

    match =
        text.match(
            /(\d+)種類.*?(\d+)個.*?(?:選|組)/
        );

    if (match && text.includes("重複")) {

        const n = Number(match[1]);
        const r = Number(match[2]);

        const answer =
            combination(n + r - 1, r);

        return {
            answer: `${answer}通り`,
            solution: steps([
                ["STEP 1",
                    `${n}種類から${r}個を重複を許して選ぶ`
                ],
                ["STEP 2",
                    `重複組合せ：${n+r-1}C${r}`
                ],
                ["STEP 3",
                    `${answer}通り`
                ],
                ["ANSWER",
                    `${answer}通り`
                ]
            ])
        };
    }


    /* -----------------------------------------
       順列
    ----------------------------------------- */

    match =
        text.match(
            /(\d+)人.*?(?:から|中から).*?(\d+)人.*?(?:選んで)?(?:並べ|順番)/
        );

    if (match) {

        const n = Number(match[1]);
        const r = Number(match[2]);

        if (r <= n) {

            const answer =
                permutation(n, r);

            return {
                answer: `${answer}通り`,
                solution: steps([
                    ["STEP 1",
                        `${n}人から${r}人を選んで並べる`
                    ],
                    ["STEP 2",
                        `${n}P${r}`
                    ],
                    ["STEP 3",
                        `${n} × ${n-1} × … = ${answer}`
                    ],
                    ["ANSWER",
                        `${answer}通り`
                    ]
                ])
            };
        }
    }


    /* -----------------------------------------
       組合せ
    ----------------------------------------- */

    match =
        text.match(
            /(\d+)人.*?(?:から|中から).*?(\d+)人.*?選/
        );

    if (match) {

        const n = Number(match[1]);
        const r = Number(match[2]);

        if (r <= n) {

            const answer =
                combination(n, r);

            return {
                answer: `${answer}通り`,
                solution: steps([
                    ["STEP 1",
                        `${n}人から${r}人を選ぶ`
                    ],
                    ["STEP 2",
                        `${n}C${r}`
                    ],
                    ["STEP 3",
                        `${n}! / (${r}! × ${n-r}!) = ${answer}`
                    ],
                    ["ANSWER",
                        `${answer}通り`
                    ]
                ])
            };
        }
    }


    /* =====================================================
       確率
    ===================================================== */


    /* -----------------------------------------
       「○個のうち○個」
    ----------------------------------------- */

    match =
        text.match(
            /全体(?:が|は)?(\d+).*?(?:うち|中).*?(\d+).*?(?:確率|確率を求め)/
        );

    if (match) {

        const total = Number(match[1]);
        const favorable = Number(match[2]);

        const answer =
            favorable / total;

        return {
            answer:
                `${fraction(favorable, total)} ≒ ${decimal(answer)}`,
            solution: steps([
                ["STEP 1",
                    `全体：${total}`
                ],
                ["STEP 2",
                    `求める場合：${favorable}`
                ],
                ["STEP 3",
                    `${favorable}/${total}`
                ],
                ["ANSWER",
                    `${fraction(favorable,total)} ≒ ${decimal(answer)}`
                ]
            ])
        };
    }


    /* -----------------------------------------
       コイン
    ----------------------------------------- */

    match =
        text.match(
            /コイン.*?(\d+)回/
        );

    if (match) {

        const n = Number(match[1]);

        const total =
            Math.pow(2, n);

        return {
            answer: `${total}通り`,
            solution: steps([
                ["STEP 1",
                    `コイン1回につき2通り`
                ],
                ["STEP 2",
                    `2^${n}`
                ],
                ["ANSWER",
                    `${total}通り`
                ]
            ])
        };
    }


    /* -----------------------------------------
       サイコロ
    ----------------------------------------- */

    match =
        text.match(
            /サイコロ.*?(\d+)回/
        );

    if (match) {

        const n = Number(match[1]);

        const total =
            Math.pow(6, n);

        return {
            answer: `${total}通り`,
            solution: steps([
                ["STEP 1",
                    `サイコロ1回につき6通り`
                ],
                ["STEP 2",
                    `6^${n}`
                ],
                ["ANSWER",
                    `${total}通り`
                ]
            ])
        };
    }


    /* =====================================================
       整数
    ===================================================== */


    /* -----------------------------------------
       最大公約数
    ----------------------------------------- */

    match =
        text.match(
            /(?:最大公約数|GCD).*?(\d+).*?(\d+)/
        );

    if (match) {

        const a = Number(match[1]);
        const b = Number(match[2]);

        const answer =
            gcd(a, b);

        return {
            answer: `${answer}`,
            solution: steps([
                ["STEP 1",
                    `${a}と${b}の最大公約数`
                ],
                ["STEP 2",
                    `ユークリッドの互除法`
                ],
                ["ANSWER",
                    `${answer}`
                ]
            ])
        };
    }


    /* -----------------------------------------
       最小公倍数
    ----------------------------------------- */

    match =
        text.match(
            /(?:最小公倍数|LCM).*?(\d+).*?(\d+)/
        );

    if (match) {

        const a = Number(match[1]);
        const b = Number(match[2]);

        const answer =
            lcm(a, b);

        return {
            answer: `${answer}`,
            solution: steps([
                ["STEP 1",
                    `${a}と${b}の最小公倍数`
                ],
                ["STEP 2",
                    `${a} × ${b} ÷ ${gcd(a,b)}`
                ],
                ["ANSWER",
                    `${answer}`
                ]
            ])
        };
    }


    /* -----------------------------------------
       素因数分解
    ----------------------------------------- */

    match =
        text.match(
            /(\d+).*?素因数分解/
        );

    if (match) {

        const n = Number(match[1]);

        const factors =
            primeFactorization(n);

        return {
            answer:
                factors.join(" × "),
            solution: steps([
                ["STEP 1",
                    `${n}を素数で分解`
                ],
                ["STEP 2",
                    factors.join(" × ")
                ],
                ["ANSWER",
                    factors.join(" × ")
                ]
            ])
        };
    }


    /* =====================================================
       図形と計量
    ===================================================== */


    /* -----------------------------------------
       sin
    ----------------------------------------- */

    match =
        text.match(
            /sin\s*([0-9.]+)/
        );

    if (match) {

        const degree =
            Number(match[1]);

        const answer =
            Math.sin(
                degree * Math.PI / 180
            );

        return {
            answer: decimal(answer),
            solution: steps([
                ["STEP 1",
                    `sin ${degree}°`
                ],
                ["STEP 2",
                    `度をラジアンに変換`
                ],
                ["ANSWER",
                    decimal(answer)
                ]
            ])
        };
    }


    /* -----------------------------------------
       cos
    ----------------------------------------- */

    match =
        text.match(
            /cos\s*([0-9.]+)/
        );

    if (match) {

        const degree =
            Number(match[1]);

        const answer =
            Math.cos(
                degree * Math.PI / 180
            );

        return {
            answer: decimal(answer),
            solution: steps([
                ["STEP 1",
                    `cos ${degree}°`
                ],
                ["STEP 2",
                    `度をラジアンに変換`
                ],
                ["ANSWER",
                    decimal(answer)
                ]
            ])
        };
    }


    /* -----------------------------------------
       tan
    ----------------------------------------- */

    match =
        text.match(
            /tan\s*([0-9.]+)/
        );

    if (match) {

        const degree =
            Number(match[1]);

        const answer =
            Math.tan(
                degree * Math.PI / 180
            );

        return {
            answer: decimal(answer),
            solution: steps([
                ["STEP 1",
                    `tan ${degree}°`
                ],
                ["ANSWER",
                    decimal(answer)
                ]
            ])
        };
    }


    /* -----------------------------------------
       三角形の面積
       1/2 ab sin C
    ----------------------------------------- */

    match =
        text.match(
            /(?:辺|2辺).*?(\d+(?:\.\d+)?).*?(\d+(?:\.\d+)?).*?角.*?(\d+(?:\.\d+)?)/
        );

    if (match && text.includes("面積")) {

        const a = Number(match[1]);
        const b = Number(match[2]);
        const angle = Number(match[3]);

        const area =
            0.5 *
            a *
            b *
            Math.sin(
                angle * Math.PI / 180
            );

        return {
            answer: `${decimal(area)}`,
            solution: steps([
                ["STEP 1",
                    `S = 1/2 ab sin C`
                ],
                ["STEP 2",
                    `S = 1/2 × ${a} × ${b} × sin ${angle}°`
                ],
                ["ANSWER",
                    `${decimal(area)}`
                ]
            ])
        };
    }


    /* =====================================================
       データの分析
    ===================================================== */


    /* -----------------------------------------
       平均
       例：1,2,3,4,5の平均
    ----------------------------------------- */

    match =
        text.match(
            /([0-9.,]+).*?(?:平均|平均値)/
        );

    if (match) {

        const numbers =
            parseNumberList(match[1]);

        if (numbers.length > 0) {

            const answer =
                mean(numbers);

            return {
                answer: decimal(answer),
                solution: steps([
                    ["STEP 1",
                        numbers.join(" + ")
                    ],
                    ["STEP 2",
                        `合計 = ${sum(numbers)}`
                    ],
                    ["STEP 3",
                        `データ数 = ${numbers.length}`
                    ],
                    ["ANSWER",
                        `${decimal(answer)}`
                    ]
                ])
            };
        }
    }


    /* -----------------------------------------
       中央値
    ----------------------------------------- */

    match =
        text.match(
            /([0-9.,]+).*?(?:中央値|メジアン)/
        );

    if (match) {

        const numbers =
            parseNumberList(match[1]);

        if (numbers.length > 0) {

            const answer =
                median(numbers);

            return {
                answer: `${answer}`,
                solution: steps([
                    ["STEP 1",
                        "データを小さい順に並べる"
                    ],
                    ["STEP 2",
                        sortNumbers(numbers).join(", ")
                    ],
                    ["ANSWER",
                        `${answer}`
                    ]
                ])
            };
        }
    }


    /* -----------------------------------------
       最頻値
    ----------------------------------------- */

    match =
        text.match(
            /([0-9.,]+).*?(?:最頻値|モード)/
        );

    if (match) {

        const numbers =
            parseNumberList(match[1]);

        const answer =
            mode(numbers);

        return {
            answer:
                answer.join(", "),
            solution: steps([
                ["STEP 1",
                    numbers.join(", ")
                ],
                ["STEP 2",
                    "最も多く出現する値を調べる"
                ],
                ["ANSWER",
                    answer.join(", ")
                ]
            ])
        };
    }


    /* -----------------------------------------
       分散
    ----------------------------------------- */

    match =
        text.match(
            /([0-9.,]+).*?(?:分散)/
        );

    if (match) {

        const numbers =
            parseNumberList(match[1]);

        const answer =
            variance(numbers);

        return {
            answer: decimal(answer),
            solution: steps([
                ["STEP 1",
                    `平均 = ${decimal(mean(numbers))}`
                ],
                ["STEP 2",
                    "各データと平均の差を2乗"
                ],
                ["STEP 3",
                    `分散 = ${decimal(answer)}`
                ],
                ["ANSWER",
                    `${decimal(answer)}`
                ]
            ])
        };
    }


    /* -----------------------------------------
       標準偏差
    ----------------------------------------- */

    match =
        text.match(
            /([0-9.,]+).*?(?:標準偏差)/
        );

    if (match) {

        const numbers =
            parseNumberList(match[1]);

        const answer =
            standardDeviation(numbers);

        return {
            answer: decimal(answer),
            solution: steps([
                ["STEP 1",
                    `分散 = ${decimal(variance(numbers))}`
                ],
                ["STEP 2",
                    "標準偏差 = √分散"
                ],
                ["ANSWER",
                    `${decimal(answer)}`
                ]
            ])
        };
    }


    return null;
}


/* =========================================================
   EQUATION ENGINE
========================================================= */

function solveEquation(text) {

    /* -----------------------------------------
       1次方程式
    ----------------------------------------- */

    let match =
        text.match(
            /^([+-]?\d*\.?\d*)x([+-]\d*\.?\d*)=([+-]?\d+\.?\d*)$/
        );

    if (match) {

        let a =
            coefficient(match[1]);

        let b =
            numberOrZero(match[2]);

        const c =
            Number(match[3]);

        if (a !== 0) {

            const x =
                (c - b) / a;

            return {
                answer:
                    `x = ${decimal(x)}`,
                solution: steps([
                    ["STEP 1",
                        `${a}x + ${b} = ${c}`
                    ],
                    ["STEP 2",
                        `${a}x = ${c-b}`
                    ],
                    ["STEP 3",
                        `x = ${c-b} ÷ ${a}`
                    ],
                    ["ANSWER",
                        `x = ${decimal(x)}`
                    ]
                ])
            };
        }
    }


    /* -----------------------------------------
       2次方程式
    ----------------------------------------- */

    if (
        text.includes("x^2") &&
        text.includes("=")
    ) {

        const quadratic =
            parseQuadratic(text);

        if (quadratic) {

            const {
                a,
                b,
                c
            } = quadratic;

            const d =
                b*b - 4*a*c;


            if (d < 0) {

                return {
                    answer:
                        "実数解なし",
                    solution: steps([
                        ["STEP 1",
                            `D = b² − 4ac`
                        ],
                        ["STEP 2",
                            `D = ${d}`
                        ],
                        ["ANSWER",
                            "実数解なし"
                        ]
                    ])
                };
            }


            const x1 =
                (-b + Math.sqrt(d))
                / (2*a);

            const x2 =
                (-b - Math.sqrt(d))
                / (2*a);


            if (Math.abs(x1-x2) < 1e-10) {

                return {
                    answer:
                        `x = ${decimal(x1)}`,
                    solution: steps([
                        ["STEP 1",
                            `a = ${a}, b = ${b}, c = ${c}`
                        ],
                        ["STEP 2",
                            `D = ${d}`
                        ],
                        ["STEP 3",
                            `x = −b / 2a`
                        ],
                        ["ANSWER",
                            `x = ${decimal(x1)}`
                        ]
                    ])
                };
            }


            return {
                answer:
                    `x = ${decimal(x1)}, ${decimal(x2)}`,
                solution: steps([
                    ["STEP 1",
                        `a = ${a}, b = ${b}, c = ${c}`
                    ],
                    ["STEP 2",
                        `D = b² − 4ac = ${d}`
                    ],
                    ["STEP 3",
                        `x = (−b ± √D) / 2a`
                    ],
                    ["ANSWER",
                        `x = ${decimal(x1)}, ${decimal(x2)}`
                    ]
                ])
            };
        }
    }


    return null;
}


/* =========================================================
   EXPRESSION ENGINE
========================================================= */

function solveExpression(text) {

    let expression =
        text
            .replace(/√(\d+(?:\.\d+)?)/g,
                "Math.sqrt($1)")
            .replace(/(\d+(?:\.\d+)?)\^2/g,
                "($1**2)")
            .replace(/(\d+(?:\.\d+)?)\^3/g,
                "($1**3)")
            .replace(/π/g,
                "Math.PI")
            .replace(/\^/g,
                "**");


    /*
    sin / cos / tan
    */

    expression =
        expression.replace(
            /sin\(([^)]+)\)/g,
            "Math.sin(($1)*Math.PI/180)"
        );

    expression =
        expression.replace(
            /cos\(([^)]+)\)/g,
            "Math.cos(($1)*Math.PI/180)"
        );

    expression =
        expression.replace(
            /tan\(([^)]+)\)/g,
            "Math.tan(($1)*Math.PI/180)"
        );


    /*
    数式として安全そうな文字だけ許可
    */

    if (
        !/^[0-9+\-*/().,\sA-Za-z_]*$/.test(expression)
    ) {

        return null;
    }


    try {

        const answer =
            Function(
                `"use strict"; return (${expression})`
            )();


        if (
            typeof answer !== "number" ||
            !Number.isFinite(answer)
        ) {

            return null;
        }


        const value =
            decimal(answer);


        return {
            answer: `${value}`,
            solution: steps([
                ["INPUT",
                    text
                ],
                ["CALCULATION",
                    expression
                ],
                ["ANSWER",
                    `${value}`
                ]
            ])
        };

    } catch {

        return null;
    }
}


/* =========================================================
   QUADRATIC PARSER
========================================================= */

function parseQuadratic(text) {

    const left =
        text.split("=")[0]
            .replace(/−/g, "-")
            .replace(/\+/g, "+");


    let a = 0;
    let b = 0;
    let c = 0;


    const aMatch =
        left.match(
            /([+-]?\d*\.?\d*)x\^2/
        );

    if (!aMatch) {
        return null;
    }


    a =
        coefficient(aMatch[1]);


    const bMatch =
        left.match(
            /([+-]\d*\.?\d*)x(?!\^)/
        );

    if (bMatch) {

        b =
            numberOrZero(bMatch[1]);

    }


    const cMatch =
        left.match(
            /([+-]\d*\.?\d+)(?!x)/
        );

    if (cMatch) {

        c =
            Number(cMatch[1]);

    }


    return {
        a,
        b,
        c
    };
}


/* =========================================================
   FACTORIAL
========================================================= */

function factorial(n) {

    if (n < 0 || !Number.isInteger(n)) {
        return NaN;
    }

    let value = 1;

    for (let i = 2; i <= n; i++) {
        value *= i;
    }

    return value;
}


/* =========================================================
   PERMUTATION
========================================================= */

function permutation(n, r) {

    if (
        r < 0 ||
        r > n
    ) {
        return 0;
    }

    let value = 1;

    for (
        let i = 0;
        i < r;
        i++
    ) {
        value *= n - i;
    }

    return value;
}


/* =========================================================
   COMBINATION
========================================================= */

function combination(n, r) {

    if (
        r < 0 ||
        r > n
    ) {
        return 0;
    }

    r =
        Math.min(
            r,
            n-r
        );

    let value = 1;

    for (
        let i = 1;
        i <= r;
        i++
    ) {

        value =
            value *
            (n-i+1) /
            i;
    }

    return Math.round(value);
}


/* =========================================================
   GCD
========================================================= */

function gcd(a, b) {

    a = Math.abs(a);
    b = Math.abs(b);

    while (b !== 0) {

        const temp = b;

        b = a % b;
        a = temp;
    }

    return a;
}


/* =========================================================
   LCM
========================================================= */

function lcm(a, b) {

    if (a === 0 || b === 0) {
        return 0;
    }

    return Math.abs(
        a * b / gcd(a,b)
    );
}


/* =========================================================
   PRIME FACTORIZATION
========================================================= */

function primeFactorization(n) {

    const factors = [];

    let divisor = 2;

    while (n > 1) {

        while (n % divisor === 0) {

            factors.push(divisor);

            n /= divisor;
        }

        divisor++;
    }

    return factors;
}


/* =========================================================
   STATISTICS
========================================================= */

function sum(numbers) {

    return numbers.reduce(
        (a,b) => a+b,
        0
    );
}


function mean(numbers) {

    return sum(numbers) / numbers.length;
}


function sortNumbers(numbers) {

    return [...numbers].sort(
        (a,b) => a-b
    );
}


function median(numbers) {

    const sorted =
        sortNumbers(numbers);

    const middle =
        Math.floor(
            sorted.length / 2
        );

    if (
        sorted.length % 2 === 0
    ) {

        return (
            sorted[middle-1] +
            sorted[middle]
        ) / 2;
    }

    return sorted[middle];
}


function mode(numbers) {

    const count = {};

    numbers.forEach(
        n => {
            count[n] =
                (count[n] || 0) + 1;
        }
    );


    let max = 0;

    Object.values(count)
        .forEach(
            value => {
                if (value > max) {
                    max = value;
                }
            }
        );


    return Object.keys(count)
        .filter(
            key =>
                count[key] === max
        )
        .map(Number);
}


function variance(numbers) {

    const average =
        mean(numbers);

    return (
        numbers.reduce(
            (total, value) =>
                total +
                Math.pow(
                    value-average,
                    2
                ),
            0
        )
        /
        numbers.length
    );
}


function standardDeviation(numbers) {

    return Math.sqrt(
        variance(numbers)
    );
}


/* =========================================================
   NUMBER LIST
========================================================= */

function parseNumberList(text) {

    return text
        .split(",")
        .map(Number)
        .filter(
            n => Number.isFinite(n)
        );
}


/* =========================================================
   FRACTION
========================================================= */

function fraction(a, b) {

    const divisor =
        gcd(a,b);

    return `${a/divisor}/${b/divisor}`;
}


/* =========================================================
   DECIMAL
========================================================= */

function decimal(value) {

    if (
        Math.abs(value) < 1e-12
    ) {
        return "0";
    }

    return String(
        Math.round(
            value * 100000000
        ) / 100000000
    );
}


/* =========================================================
   COEFFICIENT
========================================================= */

function coefficient(text) {

    if (
        text === "" ||
        text === "+"
    ) {
        return 1;
    }

    if (text === "-") {
        return -1;
    }

    return Number(text);
}


function numberOrZero(text) {

    if (
        text === "" ||
        text === "+" ||
        text === "-"
    ) {

        return 0;
    }

    return Number(text);
}


/* =========================================================
   SOLUTION HTML
========================================================= */

function steps(items) {

    return items.map(
        item => `

            <div class="step">

                <div class="step-title">
                    ${item[0]}
                </div>

                <div class="step-expression">
                    ${item[1]}
                </div>

            </div>

        `
    ).join("");
}


/* =========================================================
   DISPLAY
========================================================= */

function showAnswer(
    answer,
    solutionHTML
) {

    result.innerHTML = `
        <div class="answer-number">
            ${answer}
        </div>
    `;

    solution.innerHTML =
        solutionHTML;
}


function showEmpty() {

    result.innerHTML = `
        <div class="answer-placeholder">
            答えがここに表示されます
        </div>
    `;

    solution.innerHTML = `

        <div class="solution-placeholder">

            <div class="solution-symbol">
                ∑
            </div>

            <p>
                問題を解くと<br>
                途中式がここに表示されます。
            </p>

        </div>

    `;
}


function showError() {

    result.innerHTML = `
        <div class="answer-placeholder">
            計算できません
        </div>
    `;

    solution.innerHTML = `

        <div class="solution-placeholder">

            <div class="solution-symbol">
                ?
            </div>

            <p>
                問題を読み取れませんでした。<br>
                数式または対応している問題文を入力してください。
            </p>

        </div>

    `;
}


/* =========================================================
   CALCULATOR BUTTONS
========================================================= */

const buttons =
    document.querySelectorAll(
        ".calculator-body button"
    );


buttons.forEach(
    button => {

        button.addEventListener(
            "click",
            () => {

                const value =
                    button.textContent;


                /* C */

                if (value === "C") {

                    input.value = "";

                    showEmpty();

                    input.focus();

                    return;
                }


                /* BACKSPACE */

                if (value === "⌫") {

                    input.value =
                        input.value.slice(
                            0,
                            -1
                        );

                    input.focus();

                    return;
                }


                /* EQUAL */

                if (value === "＝") {

                    calculate();

                    return;
                }


                input.value += value;

                input.focus();

            }
        );

    }
);


/* =========================================================
   ENTER
========================================================= */

input.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Enter"
        ) {

            calculate();

        }

    }
);


/* =========================================================
   CALCULATE BUTTON
========================================================= */

calculateButton.addEventListener(
    "click",
    calculate
);


/* =========================================================
   DARK MODE
========================================================= */

themeToggle.addEventListener(
    "click",
    () => {

        document.body.classList.toggle(
            "dark-mode"
        );

        const dark =
            document.body.classList.contains(
                "dark-mode"
            );

        themeToggle.textContent =
            dark
                ? "LIGHT"
                : "DARK";
    }
);


/* =========================================================
   AI PANEL
========================================================= */

aiToggle.addEventListener(
    "click",
    () => {

        aiPanel.classList.add(
            "open"
        );

    }
);


aiClose.addEventListener(
    "click",
    () => {

        aiPanel.classList.remove(
            "open"
        );

    }
);