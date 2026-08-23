/*
 * Editorial classification for the Civilian Access Atlas.
 * Scope: 193 UN member states + Palestine and Vatican City.
 * Taiwan and Kosovo are supplemental and excluded from headline counts.
 * Reviewed: 2026-08-23.
 */
window.GUN_ATLAS_DATA = {
  codePairs: `AFG:AF AGO:AO ALB:AL AND:AD ARE:AE ARG:AR ARM:AM ATG:AG AUS:AU AUT:AT AZE:AZ BDI:BI BEL:BE BEN:BJ BFA:BF BGD:BD BGR:BG BHR:BH BHS:BS BIH:BA BLR:BY BLZ:BZ BOL:BO BRA:BR BRB:BB BRN:BN BTN:BT BWA:BW CAF:CF CAN:CA CHE:CH CHL:CL CHN:CN CIV:CI CMR:CM COD:CD COG:CG COL:CO COM:KM CPV:CV CRI:CR CUB:CU CYP:CY CZE:CZ DEU:DE DJI:DJ DMA:DM DNK:DK DOM:DO DZA:DZ ECU:EC EGY:EG ERI:ER ESP:ES EST:EE ETH:ET FIN:FI FJI:FJ FRA:FR FSM:FM GAB:GA GBR:GB GEO:GE GHA:GH GIN:GN GMB:GM GNB:GW GNQ:GQ GRC:GR GRD:GD GTM:GT GUY:GY HND:HN HRV:HR HTI:HT HUN:HU IDN:ID IND:IN IRL:IE IRN:IR IRQ:IQ ISL:IS ISR:IL ITA:IT JAM:JM JOR:JO JPN:JP KAZ:KZ KEN:KE KGZ:KG KHM:KH KIR:KI KNA:KN KOR:KR KWT:KW LAO:LA LBN:LB LBR:LR LBY:LY LCA:LC LIE:LI LKA:LK LSO:LS LTU:LT LUX:LU LVA:LV MAR:MA MCO:MC MDA:MD MDG:MG MDV:MV MEX:MX MHL:MH MKD:MK MLI:ML MLT:MT MMR:MM MNE:ME MNG:MN MOZ:MZ MRT:MR MUS:MU MWI:MW MYS:MY NAM:NA NER:NE NGA:NG NIC:NI NLD:NL NOR:NO NPL:NP NRU:NR NZL:NZ OMN:OM PAK:PK PAN:PA PER:PE PHL:PH PLW:PW PNG:PG POL:PL PRK:KP PRT:PT PRY:PY PSE:PS QAT:QA ROU:RO RUS:RU RWA:RW SAU:SA SDN:SD SEN:SN SGP:SG SLB:SB SLE:SL SLV:SV SMR:SM SOM:SO SRB:RS SSD:SS STP:ST SUR:SR SVK:SK SVN:SI SWE:SE SWZ:SZ SYC:SC SYR:SY TCD:TD TGO:TG THA:TH TJK:TJ TKM:TM TLS:TL TON:TO TTO:TT TUN:TN TUR:TR TUV:TV TWN:TW TZA:TZ UGA:UG UKR:UA URY:UY USA:US UZB:UZ VAT:VA VCT:VC VEN:VE VNM:VN VUT:VU WSM:WS YEM:YE ZAF:ZA ZMB:ZM ZWE:ZW XKX:XK`,

  accessibleCodes: `AFG AND ARM AUT AZE CAN CYP CZE SLV GTM HND IRQ ITA JOR KAZ KGZ LIE MCO NZL NIC PAK PAN RUS SSD CHE TJK TUR GBR USA URY YEM`,

  exceptionalCodes: `AGO BEN BTN BFA BWA CAF CHN DJI DOM FJI GAB HTI IDN KIR LAO MLI MMR MOZ MYS NER PNG SDN TCD TWN UGA VEN VNM`,

  prohibitedCodes: `BRN KHM COM ERI GNB MDV MHL NRU PRK PLW SLB SOM TLS VAT SYC`,

  supplementalCodes: `TWN XKX`,

  customNames: {
    ja: { XKX: "コソボ", TWN: "台湾", ARE: "アラブ首長国連邦", SWZ: "エスワティニ" },
    en: { XKX: "Kosovo", TWN: "Taiwan", CZE: "Czechia", SWZ: "Eswatini" },
  },

  geometryAliases: {
    "-99": "CYP",
    OSA: "XKX",
    SDS: "SSD",
    ABV: "SOM",
  },

  notes: {
    AFG: "比較表上は、散弾銃など一部銃種について特定目的を要しない取得経路があります。政情と法執行の実態は別途確認が必要です。",
    AUS: "州・準州ごとの免許と登録が必要で、狩猟・競技などの真正な理由を求めます。自衛は通常、取得理由として認められません。",
    AUT: "一部の反復式長銃などは欠格審査と登録を中心に取得でき、拳銃・半自動銃には追加許可が必要です。",
    BRA: "狩猟・競技・収集などの目的、適格性審査、登録が必要です。銃種と用途に強い制限があります。",
    CAN: "免許（PAL）と適格性審査が必要です。非制限長銃には取得経路がありますが、拳銃や特定銃種には厳しい制限があります。",
    CHE: "一部銃種は契約・欠格要件を中心に取得でき、拳銃や半自動銃などには取得許可または特別許可が必要です。",
    CHN: "一般市民の取得は原則として厳しく制限され、狩猟地域や競技団体などの狭い例外に限られます。",
    CZE: "適格性要件と免許手続きを満たせば取得できる制度で、特定の正当目的の立証は原則として限定的です。",
    DEU: "狩猟・競技・収集などの必要性、専門知識、信頼性、保管要件を満たす許可制です。",
    FJI: "2000年に民間向け銃器免許の発給が停止され、一般市民の新規取得は実務上認められていません。",
    GBR: "散弾銃・一部ライフルは証明書制度の対象です。グレートブリテンでは大半の拳銃が禁止され、北アイルランドは制度が異なります。",
    JPN: "狩猟・有害鳥獣駆除・標的射撃など、認められた目的と警察の許可が必要です。一般市民の拳銃所持は原則として認められていません。",
    KHM: "一般市民による銃器の所持は法令上原則禁止です。軍・警察など公的機関の例外はこの分類に含みません。",
    KOR: "狩猟・競技目的などに限る許可制で、銃器は通常、警察署など指定施設で保管されます。",
    MEX: "狩猟・競技・収集などの目的と登録が必要です。合法販売経路と認められる口径・銃種は強く限定されています。",
    NZL: "免許と適格性審査により一般的な長銃を取得できますが、拳銃や禁止・規制銃器には追加要件があります。",
    PRK: "2009年の法制度において一般市民による銃器所持は原則禁止と整理されています。",
    PSE: "ヨルダン川西岸は許可制、ガザ地区は制度と運用が異なります。地域差が大きいため概括的な区分です。",
    RUS: "散弾銃には通常の免許経路があり、ライフルは一定期間の散弾銃所持歴など追加要件を伴います。",
    SGP: "射撃競技などの限定目的に対する厳格な許可制で、一般的な自宅保管・自衛目的の取得は想定されていません。",
    SOM: "一般市民の所持は法制度上原則禁止と整理しています。実際の武器流通・統治状況とは一致しない場合があります。",
    TWN: "先住民族の狩猟など狭い例外を除き、一般市民による実銃の新規取得は極めて限定的です。",
    UKR: "狩猟・競技・収集などを目的とする許可制です。戦時下の特例・運用は通常制度と異なる場合があります。",
    USA: "連邦法の欠格要件に加え、取得許可・登録・待機期間などは州ごとに大きく異なります。多くの州では一部銃種に購入許可を要しません。",
    VAT: "一般市民による銃器の取得・所持は原則として認められていないと整理しています。",
    VEN: "新規の民間販売と取得が強く制限され、競技などの特別な経路を除く一般市民の取得は実務上困難です。",
    YEM: "比較表上は、一般市民による多くの銃器取得に許可を要しない制度と整理されています。地域ごとの実効的な統治状況は別問題です。",
  },

  officialSources: {
    AUS: "https://www.ag.gov.au/crime/firearms",
    CAN: "https://rcmp.ca/en/firearms",
    GBR: "https://www.gov.uk/government/collections/firearms",
    JPN: "https://elaws.e-gov.go.jp/document?lawid=333AC0000000006",
    USA: "https://www.atf.gov/firearms",
  },

  markers: {
    AND: [1.6, 42.5], ATG: [-61.8, 17.1], BHR: [50.6, 26.1], BRB: [-59.5, 13.2],
    CPV: [-23.6, 15.1], COM: [43.3, -11.7], DMA: [-61.4, 15.4], FSM: [158.2, 6.9],
    GRD: [-61.7, 12.1], KIR: [-157.4, 1.9], KNA: [-62.8, 17.3], LCA: [-61.0, 13.9],
    LIE: [9.6, 47.2], MCO: [7.4, 43.7], MDV: [73.2, 3.2], MHL: [171.2, 7.1],
    MLT: [14.4, 35.9], MUS: [57.6, -20.3], NRU: [166.9, -0.5], PLW: [134.6, 7.5],
    SMR: [12.5, 43.9], STP: [6.6, 0.2], SYC: [55.5, -4.7], SGP: [103.8, 1.35],
    TON: [-175.2, -21.2], TUV: [179.2, -8.5], VAT: [12.45, 41.9], VCT: [-61.2, 13.2],
    WSM: [-172.1, -13.8],
  },
};
