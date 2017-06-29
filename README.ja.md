# arn2

Amazon Resource Name ユーティリティパッケージ。

## Installation

```
npm i arn2 -S
```

## Usage

``` javascript
const { parseArn } = require('arn2');

const [err, arnObj] = parseArn(arn);
```

## parseArn(arn, callback = Array)

`arn` をパースして、object を返す。

- `arn`
    - Amazon Resource Name の文字列。
- `callback(err, arnObj)`
    - パースした結果を受け取るコールバック。
    - 省略した場合、戻り値として結果を返す。

`callback` を省略した場合、以下のような戻り値を返す。

``` javascript
[err, arnObj]
```

- `err`
    - エラーが起きた時の Error オブジェクト。
- `arnObj`
    - パースした結果のオブジェクト。

## License

MIT
