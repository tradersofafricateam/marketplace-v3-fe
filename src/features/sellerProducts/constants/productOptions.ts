import type { SelectOption } from "@/components/molecules/SearchableSelect/SearchableSelect";

const countryCodes = "AD AE AF AG AI AL AM AO AQ AR AS AT AU AW AX AZ BA BB BD BE BF BG BH BI BJ BL BM BN BO BQ BR BS BT BV BW BY BZ CA CC CD CF CG CH CI CK CL CM CN CO CR CU CV CW CX CY CZ DE DJ DK DM DO DZ EC EE EG EH ER ES ET FI FJ FK FM FO FR GA GB GD GE GF GG GH GI GL GM GN GP GQ GR GS GT GU GW GY HK HM HN HR HT HU ID IE IL IM IN IO IQ IR IS IT JE JM JO JP KE KG KH KI KM KN KP KR KW KY KZ LA LB LC LI LK LR LS LT LU LV LY MA MC MD ME MF MG MH MK ML MM MN MO MP MQ MR MS MT MU MV MW MX MY MZ NA NC NE NF NG NI NL NO NP NR NU NZ OM PA PE PF PG PH PK PL PM PN PR PS PT PW PY QA RE RO RS RU RW SA SB SC SD SE SG SH SI SJ SK SL SM SN SO SR SS ST SV SX SY SZ TC TD TF TG TH TJ TK TL TM TN TO TR TT TV TW TZ UA UG UM US UY UZ VA VC VE VG VI VN VU WF WS YE YT ZA ZM ZW".split(" ");

export function getCountryOptions(locale: string): SelectOption[] {
  const labels = new Intl.DisplayNames([locale], { type: "region" });
  const names = new Intl.DisplayNames(["en"], { type: "region" });
  return countryCodes.map((code) => ({ value: names.of(code) ?? code, label: labels.of(code) ?? code })).sort((a, b) => a.label.localeCompare(b.label, locale));
}

export const marketplaceUnits: SelectOption[] = [
  {
    "label": "Piece",
    "value": "piece"
  },
  {
    "label": "Unit",
    "value": "unit"
  },
  {
    "label": "Pair",
    "value": "pair"
  },
  {
    "label": "Set",
    "value": "set"
  },
  {
    "label": "Dozen",
    "value": "dozen"
  },
  {
    "label": "Gross (144 pieces)",
    "value": "gross"
  },
  {
    "label": "Pack",
    "value": "pack"
  },
  {
    "label": "Packet",
    "value": "packet"
  },
  {
    "label": "Box",
    "value": "box"
  },
  {
    "label": "Carton",
    "value": "carton"
  },
  {
    "label": "Case",
    "value": "case"
  },
  {
    "label": "Bag",
    "value": "bag"
  },
  {
    "label": "Sack",
    "value": "sack"
  },
  {
    "label": "Pallet",
    "value": "pallet"
  },
  {
    "label": "Crate",
    "value": "crate"
  },
  {
    "label": "Bundle",
    "value": "bundle"
  },
  {
    "label": "Bale",
    "value": "bale"
  },
  {
    "label": "Roll",
    "value": "roll"
  },
  {
    "label": "Reel",
    "value": "reel"
  },
  {
    "label": "Sheet",
    "value": "sheet"
  },
  {
    "label": "Panel",
    "value": "panel"
  },
  {
    "label": "Bottle",
    "value": "bottle"
  },
  {
    "label": "Can",
    "value": "can"
  },
  {
    "label": "Jar",
    "value": "jar"
  },
  {
    "label": "Tube",
    "value": "tube"
  },
  {
    "label": "Drum",
    "value": "drum"
  },
  {
    "label": "Barrel",
    "value": "barrel"
  },
  {
    "label": "Bucket",
    "value": "bucket"
  },
  {
    "label": "Tank",
    "value": "tank"
  },
  {
    "label": "Container",
    "value": "container"
  },
  {
    "label": "20-foot container",
    "value": "20ft container"
  },
  {
    "label": "40-foot container",
    "value": "40ft container"
  },
  {
    "label": "Truckload",
    "value": "truckload"
  },
  {
    "label": "Gram (g)",
    "value": "g"
  },
  {
    "label": "Kilogram (kg)",
    "value": "kg"
  },
  {
    "label": "Milligram (mg)",
    "value": "mg"
  },
  {
    "label": "Metric tonne (t)",
    "value": "tonne"
  },
  {
    "label": "Pound (lb)",
    "value": "lb"
  },
  {
    "label": "Ounce (oz)",
    "value": "oz"
  },
  {
    "label": "US short ton",
    "value": "short ton"
  },
  {
    "label": "Imperial long ton",
    "value": "long ton"
  },
  {
    "label": "Carat (ct)",
    "value": "ct"
  },
  {
    "label": "Litre (L)",
    "value": "litre"
  },
  {
    "label": "Millilitre (mL)",
    "value": "ml"
  },
  {
    "label": "Cubic metre (m\u00b3)",
    "value": "m3"
  },
  {
    "label": "Cubic foot (ft\u00b3)",
    "value": "ft3"
  },
  {
    "label": "US gallon",
    "value": "US gallon"
  },
  {
    "label": "Imperial gallon",
    "value": "imperial gallon"
  },
  {
    "label": "Metre (m)",
    "value": "m"
  },
  {
    "label": "Centimetre (cm)",
    "value": "cm"
  },
  {
    "label": "Millimetre (mm)",
    "value": "mm"
  },
  {
    "label": "Kilometre (km)",
    "value": "km"
  },
  {
    "label": "Foot (ft)",
    "value": "ft"
  },
  {
    "label": "Inch (in)",
    "value": "in"
  },
  {
    "label": "Yard (yd)",
    "value": "yd"
  },
  {
    "label": "Square metre (m\u00b2)",
    "value": "m2"
  },
  {
    "label": "Square foot (ft\u00b2)",
    "value": "ft2"
  },
  {
    "label": "Square yard (yd\u00b2)",
    "value": "yd2"
  },
  {
    "label": "Hectare (ha)",
    "value": "ha"
  },
  {
    "label": "Acre",
    "value": "acre"
  },
  {
    "label": "Bushel",
    "value": "bushel"
  },
  {
    "label": "Board foot",
    "value": "board foot"
  },
  {
    "label": "Head (livestock)",
    "value": "head"
  },
  {
    "label": "Lot",
    "value": "lot"
  }
];
