// @ts-check

// 按规则每段可分配的收益占比
const STATIC_MODE_BASE = 1000
// 前十的比例
const FIRST = 300
const SECOND = 200
const THIRD = 150
const FOURTH = 100
const FIFTH = 50
const SIXTH = 35
const SEVENTH = 25
const EIGHTH = 15
const NINTH = 10
const TENTH = 5
// 后二十个的用户可分配比例
const NEXT_TWENTY = 60
// 最后可分配的二十个的用户可分配比例
const LAST_TWENTY = 50

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