# CIVILIAN ACCESS ATLAS

世界195か国の「一般市民が合法に銃器を取得・所持するための制度上の入口」を可視化した、インタラクティブなコロプレス図です。

公開サイト: <https://katzkawai.github.io/kklab-gun-ownership/>

## 判定区分

| 区分 | 判定基準 |
| --- | --- |
| 一般要件 | 特定目的の立証を原則とせず、欠格要件・免許・登録などの一般要件で少なくとも一部銃種を取得可能 |
| 目的限定 | 狩猟・競技・収集・自衛など、法律上認められた目的と許可が必要 |
| 例外的 | 特別許可、職業・身分要件、免許発給停止などにより一般市民の新規取得が極めて限定的 |
| 原則禁止 | 一般市民による銃器の新規取得・所持を法令上原則として認めない |

集計対象は国連加盟193か国と国連オブザーバー2か国です。台湾・コソボは比較のため補足表示し、集計から除外しています。

この分類は、所持率、公共空間での携帯、違法銃、軍・警察・民間警備会社のみを対象とする制度を表しません。連邦制、銃種、地域、法執行の実態により例外があります。比較・教育目的の概観であり、法的助言ではありません。

## ローカルで見る

ビルドは不要です。リポジトリのルートでHTTPサーバーを起動してください。

```bash
python3 -m http.server 8000
```

その後、<http://localhost:8000> を開きます。

## ファイル構成

```text
.
├── index.html              # ページ本体
├── styles.css              # レスポンシブUI
├── app.js                  # 地図・検索・フィルター
├── data/
│   ├── countries.js        # 国別区分、注記、出典
│   └── world.geojson       # 地図境界
├── vendor/
│   └── d3.v7.min.js        # D3 v7.9.0
└── .github/workflows/
    └── deploy-pages.yml    # GitHub Pagesへの自動公開
```

## 主な出典

- Small Arms Survey, [Balancing Act: Regulation of Civilian Firearm Possession](https://www.smallarmssurvey.org/sites/default/files/resources/Small-Arms-Survey-2011-Chapter-09-EN.pdf)
- Wikipedia, [Overview of gun laws by nation](https://en.wikipedia.org/wiki/Overview_of_gun_laws_by_nation)（比較表と個別脚注の索引として使用）
- Small Arms Survey, [Global Firearms Holdings questionnaire](https://www.smallarmssurvey.org/database/global-firearms-holdings/questionnaire)
- [Natural Earth / world.geo.json](https://github.com/holtzy/D3-graph-gallery/blob/master/DATA/world.geojson)

最終確認日: 2026-08-23

## ライセンス

サイトのコードは [MIT License](./LICENSE) で公開します。`data/world.geojson` と `vendor/d3.v7.min.js` には、それぞれの配布元のライセンスが適用されます。国別分類は上記資料に基づく編集・要約です。
