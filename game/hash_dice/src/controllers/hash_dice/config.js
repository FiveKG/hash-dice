const BIG = "big";
const SMALL = "small";
const TWINS = "twins";

const GAME_RATE ={
	"1": {
		"odds_rate": "98",
		"winning_probability": "1%",
		"num_interval": "0-99",
		"bet_type": "smaller"
	},
	"2": {
		"odds_rate": "49",
		"winning_probability": "2%",
		"num_interval": "0-99",
		"bet_type": "smaller"
	},
	"3": {
		"odds_rate": "32.66",
		"winning_probability": "3%",
		"num_interval": "0-99",
		"bet_type": "smaller"
	},
	"4": {
		"odds_rate": "24.5",
		"winning_probability": "4%",
		"num_interval": "0-99",
		"bet_type": "smaller"
	},
	"5": {
		"odds_rate": "19.6",
		"winning_probability": "5%",
		"num_interval": "0-99",
		"bet_type": "smaller"
	},
	"6": {
		"odds_rate": "16.33",
		"winning_probability": "6%",
		"num_interval": "0-99",
		"bet_type": "smaller"
	},
	"7": {
		"odds_rate": "14",
		"winning_probability": "7%",
		"num_interval": "0-99",
		"bet_type": "smaller"
	},
	"8": {
		"odds_rate": "12.25",
		"winning_probability": "8%",
		"num_interval": "0-99",
		"bet_type": "smaller"
	},
	"9": {
		"odds_rate": "10.88",
		"winning_probability": "9%",
		"num_interval": "0-99",
		"bet_type": "smaller"
	},
	"10": {
		"odds_rate": "9.8",
		"winning_probability": "10%",
		"num_interval": "0-99",
		"bet_type": "smaller"
	},
	"11": {
		"odds_rate": "8.9",
		"winning_probability": "11%",
		"num_interval": "0-99",
		"bet_type": "smaller"
	},
	"12": {
		"odds_rate": "8.16",
		"winning_probability": "12%",
		"num_interval": "0-99",
		"bet_type": "smaller"
	},
	"13": {
		"odds_rate": "7.53",
		"winning_probability": "13%",
		"num_interval": "0-99",
		"bet_type": "smaller"
	},
	"14": {
		"odds_rate": "7",
		"winning_probability": "14%",
		"num_interval": "0-99",
		"bet_type": "smaller"
	},
	"15": {
		"odds_rate": "6.53",
		"winning_probability": "15%",
		"num_interval": "0-99",
		"bet_type": "smaller"
	},
	"16": {
		"odds_rate": "6.12",
		"winning_probability": "16%",
		"num_interval": "0-99",
		"bet_type": "smaller"
	},
	"17": {
		"odds_rate": "5.76",
		"winning_probability": "17%",
		"num_interval": "0-99",
		"bet_type": "smaller"
	},
	"18": {
		"odds_rate": "5.44",
		"winning_probability": "18%",
		"num_interval": "0-99",
		"bet_type": "smaller"
	},
	"19": {
		"odds_rate": "5.15",
		"winning_probability": "19%",
		"num_interval": "0-99",
		"bet_type": "smaller"
	},
	"20": {
		"odds_rate": "4.9",
		"winning_probability": "20%",
		"num_interval": "0-99",
		"bet_type": "smaller"
	},
	"21": {
		"odds_rate": "4.66",
		"winning_probability": "21%",
		"num_interval": "0-99",
		"bet_type": "smaller"
	},
	"22": {
		"odds_rate": "4.45",
		"winning_probability": "22%",
		"num_interval": "0-99",
		"bet_type": "smaller"
	},
	"23": {
		"odds_rate": "4.26",
		"winning_probability": "23%",
		"num_interval": "0-99",
		"bet_type": "smaller"
	},
	"24": {
		"odds_rate": "4.08",
		"winning_probability": "24%",
		"num_interval": "0-99",
		"bet_type": "smaller"
	},
	"25": {
		"odds_rate": "3.92",
		"winning_probability": "25%",
		"num_interval": "0-99",
		"bet_type": "smaller"
	},
	"26": {
		"odds_rate": "3.76",
		"winning_probability": "26%",
		"num_interval": "0-99",
		"bet_type": "smaller"
	},
	"27": {
		"odds_rate": "3.62",
		"winning_probability": "27%",
		"num_interval": "0-99",
		"bet_type": "smaller"
	},
	"28": {
		"odds_rate": "3.5",
		"winning_probability": "28%",
		"num_interval": "0-99",
		"bet_type": "smaller"
	},
	"29": {
		"odds_rate": "3.37",
		"winning_probability": "29%",
		"num_interval": "0-99",
		"bet_type": "smaller"
	},
	"30": {
		"odds_rate": "3.26",
		"winning_probability": "30%",
		"num_interval": "0-99",
		"bet_type": "smaller"
	},
	"31": {
		"odds_rate": "3.16",
		"winning_probability": "31%",
		"num_interval": "0-99",
		"bet_type": "smaller"
	},
	"32": {
		"odds_rate": "3.06",
		"winning_probability": "32%",
		"num_interval": "0-99",
		"bet_type": "smaller"
	},
	"33": {
		"odds_rate": "2.96",
		"winning_probability": "33%",
		"num_interval": "0-99",
		"bet_type": "smaller"
	},
	"34": {
		"odds_rate": "2.88",
		"winning_probability": "34%",
		"num_interval": "0-99",
		"bet_type": "smaller"
	},
	"35": {
		"odds_rate": "2.8",
		"winning_probability": "35%",
		"num_interval": "0-99",
		"bet_type": "smaller"
	},
	"36": {
		"odds_rate": "2.72",
		"winning_probability": "36%",
		"num_interval": "0-99",
		"bet_type": "smaller"
	},
	"37": {
		"odds_rate": "2.64",
		"winning_probability": "37%",
		"num_interval": "0-99",
		"bet_type": "smaller"
	},
	"38": {
		"odds_rate": "2.57",
		"winning_probability": "38%",
		"num_interval": "0-99",
		"bet_type": "smaller"
	},
	"39": {
		"odds_rate": "2.51",
		"winning_probability": "39%",
		"num_interval": "0-99",
		"bet_type": "smaller"
	},
	"40": {
		"odds_rate": "2.45",
		"winning_probability": "40%",
		"num_interval": "0-99",
		"bet_type": "smaller"
	},
	"41": {
		"odds_rate": "2.39",
		"winning_probability": "41%",
		"num_interval": "0-99",
		"bet_type": "smaller"
	},
	"42": {
		"odds_rate": "2.33",
		"winning_probability": "42%",
		"num_interval": "0-99",
		"bet_type": "smaller"
	},
	"43": {
		"odds_rate": "2.27",
		"winning_probability": "43%",
		"num_interval": "0-99",
		"bet_type": "smaller"
	},
	"44": {
		"odds_rate": "2.22",
		"winning_probability": "44%",
		"num_interval": "0-99",
		"bet_type": "smaller"
	},
	"45": {
		"odds_rate": "2.17",
		"winning_probability": "45%",
		"num_interval": "0-99",
		"bet_type": "smaller"
	},
	"46": {
		"odds_rate": "2.13",
		"winning_probability": "46%",
		"num_interval": "0-99",
		"bet_type": "smaller"
	},
	"47": {
		"odds_rate": "2.08",
		"winning_probability": "47%",
		"num_interval": "0-99",
		"bet_type": "smaller"
	},
	"48": {
		"odds_rate": "2.04",
		"winning_probability": "48%",
		"num_interval": "0-99",
		"bet_type": "smaller"
	},
	"49": {
		"odds_rate": "2",
		"winning_probability": "49%",
		"num_interval": "0-99",
		"bet_type": "smaller"
	},
	"50": {
		"odds_rate": "1.96",
		"winning_probability": "50%",
		"num_interval": "0-99",
		"bet_type": "smaller"
	},
	"51": {
		"odds_rate": "1.92",
		"winning_probability": "51%",
		"num_interval": "0-99",
		"bet_type": "smaller"
	},
	"52": {
		"odds_rate": "1.88",
		"winning_probability": "52%",
		"num_interval": "0-99",
		"bet_type": "smaller"
	},
	"53": {
		"odds_rate": "1.84",
		"winning_probability": "53%",
		"num_interval": "0-99",
		"bet_type": "smaller"
	},
	"54": {
		"odds_rate": "1.81",
		"winning_probability": "54%",
		"num_interval": "0-99",
		"bet_type": "smaller"
	},
	"55": {
		"odds_rate": "1.78",
		"winning_probability": "55%",
		"num_interval": "0-99",
		"bet_type": "smaller"
	},
	"56": {
		"odds_rate": "1.75",
		"winning_probability": "56%",
		"num_interval": "0-99",
		"bet_type": "smaller"
	},
	"57": {
		"odds_rate": "1.71",
		"winning_probability": "57%",
		"num_interval": "0-99",
		"bet_type": "smaller"
	},
	"58": {
		"odds_rate": "1.68",
		"winning_probability": "58%",
		"num_interval": "0-99",
		"bet_type": "smaller"
	},
	"59": {
		"odds_rate": "1.66",
		"winning_probability": "59%",
		"num_interval": "0-99",
		"bet_type": "smaller"
	},
	"60": {
		"odds_rate": "1.63",
		"winning_probability": "60%",
		"num_interval": "0-99",
		"bet_type": "smaller"
	},
	"61": {
		"odds_rate": "1.6",
		"winning_probability": "61%",
		"num_interval": "0-99",
		"bet_type": "smaller"
	},
	"62": {
		"odds_rate": "1.58",
		"winning_probability": "62%",
		"num_interval": "0-99",
		"bet_type": "smaller"
	},
	"63": {
		"odds_rate": "1.55",
		"winning_probability": "63%",
		"num_interval": "0-99",
		"bet_type": "smaller"
	},
	"64": {
		"odds_rate": "1.53",
		"winning_probability": "64%",
		"num_interval": "0-99",
		"bet_type": "smaller"
	},
	"65": {
		"odds_rate": "1.5",
		"winning_probability": "65%",
		"num_interval": "0-99",
		"bet_type": "smaller"
	},
	"66": {
		"odds_rate": "1.48",
		"winning_probability": "66%",
		"num_interval": "0-99",
		"bet_type": "smaller"
	},
	"67": {
		"odds_rate": "1.46",
		"winning_probability": "67%",
		"num_interval": "0-99",
		"bet_type": "smaller"
	},
	"68": {
		"odds_rate": "1.44",
		"winning_probability": "68%",
		"num_interval": "0-99",
		"bet_type": "smaller"
	},
	"69": {
		"odds_rate": "1.42",
		"winning_probability": "69%",
		"num_interval": "0-99",
		"bet_type": "smaller"
	},
	"70": {
		"odds_rate": "1.4",
		"winning_probability": "70%",
		"num_interval": "0-99",
		"bet_type": "smaller"
	},
	"71": {
		"odds_rate": "1.38",
		"winning_probability": "71%",
		"num_interval": "0-99",
		"bet_type": "smaller"
	},
	"72": {
		"odds_rate": "1.36",
		"winning_probability": "72%",
		"num_interval": "0-99",
		"bet_type": "smaller"
	},
	"73": {
		"odds_rate": "1.34",
		"winning_probability": "73%",
		"num_interval": "0-99",
		"bet_type": "smaller"
	},
	"74": {
		"odds_rate": "1.32",
		"winning_probability": "74%",
		"num_interval": "0-99",
		"bet_type": "smaller"
	},
	"75": {
		"odds_rate": "1.3",
		"winning_probability": "75%",
		"num_interval": "0-99",
		"bet_type": "smaller"
	},
	"76": {
		"odds_rate": "1.28",
		"winning_probability": "76%",
		"num_interval": "0-99",
		"bet_type": "smaller"
	},
	"77": {
		"odds_rate": "1.27",
		"winning_probability": "77%",
		"num_interval": "0-99",
		"bet_type": "smaller"
	},
	"78": {
		"odds_rate": "1.25",
		"winning_probability": "78%",
		"num_interval": "0-99",
		"bet_type": "smaller"
	},
	"79": {
		"odds_rate": "1.24",
		"winning_probability": "79%",
		"num_interval": "0-99",
		"bet_type": "smaller"
	},
	"80": {
		"odds_rate": "1.22",
		"winning_probability": "80%",
		"num_interval": "0-99",
		"bet_type": "smaller"
	},
	"81": {
		"odds_rate": "1.2",
		"winning_probability": "81%",
		"num_interval": "0-99",
		"bet_type": "smaller"
	},
	"82": {
		"odds_rate": "1.19",
		"winning_probability": "82%",
		"num_interval": "0-99",
		"bet_type": "smaller"
	},
	"83": {
		"odds_rate": "1.18",
		"winning_probability": "83%",
		"num_interval": "0-99",
		"bet_type": "smaller"
	},
	"84": {
		"odds_rate": "1.16",
		"winning_probability": "84%",
		"num_interval": "0-99",
		"bet_type": "smaller"
	},
	"85": {
		"odds_rate": "1.15",
		"winning_probability": "85%",
		"num_interval": "0-99",
		"bet_type": "smaller"
	},
	"86": {
		"odds_rate": "1.13",
		"winning_probability": "86%",
		"num_interval": "0-99",
		"bet_type": "smaller"
	},
	"87": {
		"odds_rate": "1.12",
		"winning_probability": "87%",
		"num_interval": "0-99",
		"bet_type": "smaller"
	},
	"88": {
		"odds_rate": "1.11",
		"winning_probability": "88%",
		"num_interval": "0-99",
		"bet_type": "smaller"
	},
	"89": {
		"odds_rate": "1.1",
		"winning_probability": "89%",
		"num_interval": "0-99",
		"bet_type": "smaller"
	},
	"90": {
		"odds_rate": "1.08",
		"winning_probability": "90%",
		"num_interval": "0-99",
		"bet_type": "smaller"
	},
	"91": {
		"odds_rate": "1.07",
		"winning_probability": "91%",
		"num_interval": "0-99",
		"bet_type": "smaller"
	},
	"92": {
		"odds_rate": "1.06",
		"winning_probability": "92%",
		"num_interval": "0-99",
		"bet_type": "smaller"
	},
	"93": {
		"odds_rate": "1.05",
		"winning_probability": "93%",
		"num_interval": "0-99",
		"bet_type": "smaller"
	},
	"94": {
		"odds_rate": "1.04",
		"winning_probability": "94%",
		"num_interval": "0-99",
		"bet_type": "smaller"
	},
	"95": {
		"odds_rate": "1.03",
		"winning_probability": "95%",
		"num_interval": "0-99",
		"bet_type": "smaller"
    },
    "big":{
        "odds_rate": "1.96",
		"winning_probability": "50%",
		"num_interval": "0-99",
		"bet_type": "big"
    },
    "small":{
        "odds_rate": "1.96",
		"winning_probability": "50%",
		"num_interval": "0-99",
		"bet_type": "small"
    },
    "twins":{
        "odds_rate": "9.8",
		"winning_probability": "10%",
		"num_interval": "0-99",
		"bet_type": "twins"
    },
    
	
}
BET_TYPE ={
    big : 50,
    small : 50,
    twins : [00,11,22,33,44,55,66,77,88,99]
}

module.exports ={
    "GAME_RATE": GAME_RATE,
    "BET_TYPE" : BET_TYPE,
    "BIG"      : BIG,
    "SMALL"    : SMALL,
    "TWINS"    : TWINS
}