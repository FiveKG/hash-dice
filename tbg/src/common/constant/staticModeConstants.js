// @ts-check

// 按规则每段可分配的收益占比
const STATIC_MODE_BASE = 100
// 前十的比例
const FIRST = 30
const SECOND = 20
const THIRD = 15
const FOURTH = 10
const FIFTH = 5
const SIXTH = 3.5
const SEVENTH = 2.5
const EIGHTH = 1.5
const NINTH = 1
const TENTH = 0.5
// 后二十个的用户可分配比例
const NEXT_TWENTY = 6
// 最后可分配的二十个的用户可分配比例
const LAST_TWENTY = 5

/**
 * @type { Constant }
 */
const CONSTANT = {
        "STATIC_MODE_BASE": STATIC_MODE_BASE,
        "FIRST": FIRST,
        "SECOND": SECOND,
        "THIRD": THIRD,
        "FOURTH": FOURTH,
        "FIFTH": FIFTH,
        "SIXTH": SIXTH,
        "SEVENTH": SEVENTH,
        "EIGHTH": EIGHTH,
        "NINTH": NINTH,
        "TENTH": TENTH,
        "NEXT_TWENTY": NEXT_TWENTY,
        "LAST_TWENTY": LAST_TWENTY
}

module.exports = CONSTANT

/**
 * @description 常量
 * @typedef { Object } Constant
 * @property { Number } STATIC_MODE_BASE
 * @property { Number } FIRST
 * @property { Number } SECOND
 * @property { Number } THIRD
 * @property { Number } FOURTH
 * @property { Number } FIFTH
 * @property { Number } SIXTH
 * @property { Number } SEVENTH
 * @property { Number } EIGHTH
 * @property { Number } NINTH
 * @property { Number } TENTH
 * @property { Number } NEXT_TWENTY
 * @property { Number } LAST_TWENTY
 */