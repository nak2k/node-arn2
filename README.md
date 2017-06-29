# arn2

Amazon Resource Name utility.

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

Parse `arn`, and return an object.

- `arn`
    - A string of Amazon Resource Name.
- `callback(err, arnObj)`
    - A callback to receive parsed results.
    - If omitted, the result is returned as a return value.

If `callback` is omitted, it returns the following return value.

``` javascript
[err, arnObj]
```

- `err`
    - An Error object when an error occurred.
- `arnObj`
    - An object resulting from parsing.

## License

MIT
