﻿# \<super-clock\>: 日時更新要素
```html
<!DOCTYPE html>
<html lang="ja">
	<head>
		<meta charset="utf-8">
		<title>SuperClock</title>
		<script src="super-clock.js"></script>
	</head>
	<body>
		
		<super-clock auto><span data-clock></span></super-clock>
		
	</body>
</html>
```
　要素に指定された属性値に基づいて子孫要素に日時を示す文字列を設定し、更新し続けるカスタム要素です。OBS のソース「ブラウザー」を通じて読み込み、映像上に日時表示を埋め込む使い方を想定しています。そのため要素や各属性の動的な変更への対応は不十分です。

## 属性
　末尾にアスタリスク ``*`` が付いている属性の動作は未検証です。
### as-html
　論理属性で、指定されていると日時の値を HTML として対象の子孫要素の内容に書き込みます。既定では日時の値は [Node.textContent](https://developer.mozilla.org/ja/docs/Web/API/Node/textContent) を使って書き込みますが、この論理属性を設定していると [Element.innerHTML](https://developer.mozilla.org/ja/docs/Web/API/Element/innerHTML) を使って書き込みます。
### auto
　論理属性で、指定されていると要素がドキュメントに接続された時に自動的に時間の更新を開始します。JavaScript を通じて操作を行なわない場合、あらかじめこの属性を指定しておく以外で時間の更新を開始させる方法はありません。
### floor
　論理属性で、指定されていると開始時間のミリ秒を ``0`` に切り下げます。
### mute
　論理属性で、指定されていると時間の更新を行なっていても、子孫要素内のテキストの設定および更新は行ないません。
### origin*
　日時の開始時間を任意の [UNIX 元期](https://ja.wikipedia.org/wiki/UNIX%E6%99%82%E9%96%93)の時間(ミリ秒単位)で指定します。接頭辞に ``+`` と ``-`` があり、``+`` を付けると、それに続くミリ秒単位の時間分、現在時刻を進ませた値を開始時間に設定します。``-`` の場合は、逆に現在時刻から指定された値分遡らせます。既定値は現在時刻です。
### pad
　日時を示す文字列の文字数の上限を整数で指定します。文字数が上限に満たない場合、属性 *[pad-str](#pad-str)* で指定された文字列で補います。既定では不足する文字数分は左方向に対して補われますが、負の整数を指定した場合は右方向へ補われます。
### pad-pseudo
　論理属性で、指定されていると、属性 *[pad](#pad)*, *[pad-str](#pad-str)* によって補われた文字列（日時部分は含まない）を、子孫要素内にテキストとして直接埋め込むのではなく、該当子孫要素の属性 ``data-clock-pad-attr`` の値として設定します。この値は、通常 CSS 関数 [attr()](https://developer.mozilla.org/ja/docs/Web/CSS/attr) を通じて要素内の擬似要素 [::before](https://developer.mozilla.org/ja/docs/Web/CSS/::before) および [::after](https://developer.mozilla.org/ja/docs/Web/CSS/::after) に表示することができます。
### pad-str
　日時を示す文字列の文字数が属性 *[pad](#pad)* で指定された値に満たない場合、この属性に指定された値で不足を補います。既定値は文字列の ``0`` です。
### setdata
　指定されていると、その値を子孫要素の属性 ``data-`` の名前として、その値に更新された時間を設定します。空文字を設定すると子孫要素の属性 *[clock-value](#clock-value)* の値が使われます。
### speed*
　時間の進む速さを設定します。具体的には、属性 *[timing](timing)* で指定された値にこの属性に指定された値を乗算します。
### timing
　時間の更新間隔をミリ秒単位で指定します。値を小さくするほど、日時の更新は頻繁に行なわれます。これはミリ秒を表示させたい時に有利ですが、一方で極端に頻繁な更新はウェブページ全体のパフォーマンスを低下させる恐れがあります。

　主に技術的な理由で、この属性の値は ``100`` 以下を目安としてください。特に ``1000`` 以上か、それに近い値に設定すると、現実の時間との誤差が生じる可能性が強まります。既定値は ``67`` です。
### v-y
　指定された値と一致する属性 [id](https://developer.mozilla.org/ja/docs/Web/HTML/Global_attributes/id) を持つ *[\<enum-values\>](#enum-values-値列挙要素)* の値で、現在の「年」の値を置き換えます。詳細は子孫要素に指定できる[カスタムデータ属性](https://developer.mozilla.org/ja/docs/Web/HTML/Global_attributes/data-*) *[data-clock-values](#data-clock-values)* を参照してください。
### v-m
　指定された値と一致する属性 [id](https://developer.mozilla.org/ja/docs/Web/HTML/Global_attributes/id) を持つ *[\<enum-values\>](#enum-values-値列挙要素)* の値で、現在の「月」の値を置き換えます。詳細は子孫要素に指定できる[カスタムデータ属性](https://developer.mozilla.org/ja/docs/Web/HTML/Global_attributes/data-*) *[data-clock-values](#data-clock-values)* を参照してください。
### v-d
　指定された値と一致する属性 [id](https://developer.mozilla.org/ja/docs/Web/HTML/Global_attributes/id) を持つ *[\<enum-values\>](#enum-values-値列挙要素)* の値で、現在の「日」の値を置き換えます。詳細は子孫要素に指定できる[カスタムデータ属性](https://developer.mozilla.org/ja/docs/Web/HTML/Global_attributes/data-*) *[data-clock-values](#data-clock-values)* を参照してください。
### v-h
　指定された値と一致する属性 [id](https://developer.mozilla.org/ja/docs/Web/HTML/Global_attributes/id) を持つ *[\<enum-values\>](#enum-values-値列挙要素)* の値で、現在の「時」の値を置き換えます。詳細は子孫要素に指定できる[カスタムデータ属性](https://developer.mozilla.org/ja/docs/Web/HTML/Global_attributes/data-*) *[data-clock-values](#data-clock-values)* を参照してください。
### v-mi
　指定された値と一致する属性 [id](https://developer.mozilla.org/ja/docs/Web/HTML/Global_attributes/id) を持つ *[\<enum-values\>](#enum-values-値列挙要素)* の値で、現在の「分」の値を置き換えます。詳細は子孫要素に指定できる[カスタムデータ属性](https://developer.mozilla.org/ja/docs/Web/HTML/Global_attributes/data-*) *[data-clock-values](#data-clock-values)* を参照してください。
### v-s
　指定された値と一致する属性 [id](https://developer.mozilla.org/ja/docs/Web/HTML/Global_attributes/id) を持つ *[\<enum-values\>](#enum-values-値列挙要素)* の値で、現在の「秒」の値を置き換えます。詳細は子孫要素に指定できる[カスタムデータ属性](https://developer.mozilla.org/ja/docs/Web/HTML/Global_attributes/data-*) *[data-clock-values](#data-clock-values)* を参照してください。
### v-ms
　指定された値と一致する属性 [id](https://developer.mozilla.org/ja/docs/Web/HTML/Global_attributes/id) を持つ *[\<enum-values\>](#enum-values-値列挙要素)* の値で、現在の「ミリ秒」の値を置き換えます。詳細は子孫要素に指定できる[カスタムデータ属性](https://developer.mozilla.org/ja/docs/Web/HTML/Global_attributes/data-*) *[data-clock-values](#data-clock-values)* を参照してください。
### v-dn
　指定された値と一致する属性 [id](https://developer.mozilla.org/ja/docs/Web/HTML/Global_attributes/id) を持つ *[\<enum-values\>](#enum-values-値列挙要素)* の値で、現在の「曜日」の値を置き換えます。詳細は子孫要素に指定できる[カスタムデータ属性](https://developer.mozilla.org/ja/docs/Web/HTML/Global_attributes/data-*) *[data-clock-values](#data-clock-values)* を参照してください。
### v-hn
　指定された値と一致する属性 [id](https://developer.mozilla.org/ja/docs/Web/HTML/Global_attributes/id) を持つ *[\<enum-values\>](#enum-values-値列挙要素)* の値で、現在の「午前」、「午後」の値を置き換えます。詳細は子孫要素に指定できる[カスタムデータ属性](https://developer.mozilla.org/ja/docs/Web/HTML/Global_attributes/data-*) *[data-clock-values](#data-clock-values)* を参照してください。
### v-h12
　指定された値と一致する属性 [id](https://developer.mozilla.org/ja/docs/Web/HTML/Global_attributes/id) を持つ *[\<enum-values\>](#enum-values-値列挙要素)* の値で、現在の12時間制の「時」の値を置き換えます。詳細は子孫要素に指定できる[カスタムデータ属性](https://developer.mozilla.org/ja/docs/Web/HTML/Global_attributes/data-*) *[data-clock-values](#data-clock-values)* を参照してください。
### v-t
　指定された値と一致する属性 [id](https://developer.mozilla.org/ja/docs/Web/HTML/Global_attributes/id) を持つ *[\<enum-values\>](#enum-values-値列挙要素)* の値で、現在の [UNIX 元期](https://ja.wikipedia.org/wiki/UNIX%E6%99%82%E9%96%93)の時間の値を置き換えます。詳細は子孫要素に指定できる[カスタムデータ属性](https://developer.mozilla.org/ja/docs/Web/HTML/Global_attributes/data-*) *[data-clock-values](#data-clock-values)* を参照してください。
### value
　子孫要素に設定できる属性 *[data-clock](#data-clock)* の既定値を設定します。既定値は ``t`` です。

## イベント
### tick
　日時のいずれかの値が切り替わった時に *[\<super-clock\>](#super-clock-日時更新要素)* を発生源として通知されるイベントです。コールバック関数の第一引数に与えられるイベントオブジェクトのプロパティ ``detail`` には、更新された情報を示す *[SuperClockTickEventObject](#SuperClockTickEventObject)* を列挙した [Array](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Array) が設定されます。

> #### SuperClockTickEventObject
> ##### clock
> 更新された子孫要素です。
> ##### name
> 更新された日時を示すパラメータ名です。
> ##### tack
> 更新された日時の、次の更新までにかかる時間をミリ秒単位で示す整数値です。

### tick-*
　特定の日時が切り替わった時に、該当する子孫要素を発生源として通知されるイベントです。アスタリスク ``*`` は *[日時を示す各パラメータ名](#日時のパラメータ名)* です。コールバック関数の第一引数に与えられるイベントオブジェクトのプロパティ ``detail`` には *[SuperClockTickEventObject](#SuperClockTickEventObject)* が設定されます。

## CSS変数
　以下の [CSS 変数](https://developer.mozilla.org/ja/docs/Web/CSS/--*) は、属性 *[data-clock](#data-clock)* を指定された子孫要素に自動で設定されます。
### --clock-tack-time
　子孫要素の属性 *[data-clock](#data-clock)* が示す日時の値が、次の値に切り替わるまでにかかる時間を CSS のデータ型 [\<time\>](https://developer.mozilla.org/ja/docs/Web/CSS/time) で示します。単位は ``s`` です。例えば、``data-clock="s"`` である場合、``--clock-tack-time`` の値は概ね ``1s`` に近い値を示します。

　この CSS 変数が必要な理由は、日時の値が切り替わる時に、切り替わりに掛かる時間が常に一定とは限らないためです。例えば秒数に応じて要素をアニメーションさせたい時、``animation: keyframes 1s linear 0s infinite...`` とすれば一秒毎にアニメーションが再生されますが、仮に時計の開始時間が 19:30 2.5 である場合、秒が次の値に切り替わる時間は 0.5 秒であるため、19:30 3.0 になっても、アニメーションが再生されるのはその 0.5 秒後になります。これはミリ秒や秒であれば無視できる差かもしれませんが、それ以外では決定的な差を生じさせます。時計の開始時間が 19:30 30.0 で、アニメーションの指定が ``animation: keyframes 60s linear 0s infinite...`` であれば、実際に分が切り替わってから 30 秒もあとにアニメーションが再生されることになります。この時、``--clock-tack-time`` には、``30s`` に近い値が設定され、その後、19:31 0.0 に切り替わった際は、``--clock-tack-time`` には ``60s`` に近い値が改めて設定されます。

　この CSS 変数を CSS プロパティ [animation-iteration-count](https://developer.mozilla.org/ja/docs/Web/CSS/animation-iteration-count) の値を ```infinite``` に設定した上で [animation-duration](https://developer.mozilla.org/ja/docs/Web/CSS/animation-duration) に指定することは推奨されません。再生中のアニメーションは、プロパティに指定された CSS 変数の変化を反映しないためです。このカスタム要素は、この CSS 変数を設定すると同時に、日時の値が切り替わった時に、該当の子孫要素のクラス名に ``tack`` を追加します。これは切り替わる度に追加操作が行なわれ、その際に要素に設定されたアニメーションを、その再生状態を問わずに初期化します。この動作に基づいて、以下の例のように指定すると、値の切り替わりと同時に要素を繰り返しアニメーションさせられます。
```CSS
.tack {
	animation: tack var(--clock-tack-time) linear 0s 1 normal forwards running;
}
@keyframes tack {
	from { opacity: 1; }
	to { opacity: 0; }
}
```

### --clock-tack-*
　*[\<super-clock\>](#super-clock-日時更新要素)* に設定される、各日時の次の値に切り替わるまでの時間を CSS のデータ型 [\<time\>](https://developer.mozilla.org/ja/docs/Web/CSS/time) で示した変数です。単位は ``s`` です。アスタリスク ``*`` は *[各日時のパラメータ名](#日時のパラメータ名)* になります。

　この変数が設定されるのは、子孫要素の *[data-clock](#data-clock)* に指定された *[日時のパラメータ名](#日時のパラメータ名)* に限ります。例えば子孫要素に ``data-clock="s"`` しかない場合、 *[\<super-clock\>](#super-clock-日時更新要素)* に設定される変数は ``--clock-tack-s`` だけです。

## 対応する子孫要素のカスタムデータ属性
　*[\<super-clock\>](#super-clock-日時更新要素)* に包含されるすべての要素は以下の[カスタムデータ属性(data-*)](https://developer.mozilla.org/ja/docs/Web/HTML/Global_attributes/data-\*)を指定することで、 *[\<super-clock\>](#super-clock-日時更新要素)* によって行なわれる処理を制御できます。
### data-clock
　要素が *[\<super-clock\>](#super-clock-日時更新要素)* によって日時のどの部分として認識されるかを以下のパラメータ名によって示します。既定値は ``t`` です。 *[\<super-clock\>](#super-clock-日時更新要素)* は、この属性が指定された子孫要素のみを処理の対象とします。
#### 日時のパラメータ名
##### y
　西暦の「年」を示します。
##### m
　西暦の「月」を示します。
##### d
　西暦の「日」を示します。
##### h
　24時間制の「時」を示します。
##### mi
　「分」を示します。
##### s
　「秒」を示します。
##### ms
　「ミリ秒」を示します。
##### dn
　「曜日」を示します。曜日は整数値で表され、日曜日を ``0`` として、土曜日まで ``1`` ずつ加算されていきます。
##### hn
　「午前」、「午後」を示します。午前は ``0``、午後は ``1`` で表されます。
##### h12
　12時間制の「時」を示します。
##### t
　UNIX 元期の時間を示します。
### data-clock-as-html
　*[\<super-clock\>](#super-clock-日時更新要素)* の属性 *[as-html](#as-html)* と同等ですが、この属性に指定された値は *[\<super-clock\>](#super-clock-日時更新要素)* の指定を上書きし、また該当要素に対してのみ適用されます。
### data-clock-force-text
　*[\<super-clock\>](#super-clock-日時更新要素)* の属性 *[as-html](#as-html)* とこの要素に *[data-clock-as-html](#data-clock-as-html)* の指定にかかわらず、 *[\<super-clock\>](#super-clock-日時更新要素)* によってこの要素の内容として書き込まれる値をプレーンテキストとして扱うことを強制します。
### data-clock-disabled-setdata
　論理属性で、この属性が指定された要素は *[setdata](#setdata)* による ``data-`` への書き込みが行なわれません。
### data-clock-mute
　論理属性で、この属性が指定された要素は該当する日時が更新されてもその値をテキストとして書き込みする処理が行なわれません。
### data-clock-pad
　*[\<super-clock\>](#super-clock-日時更新要素)* の属性 *[pad](#pad)* と同等ですが、この属性に指定された値は *[\<super-clock\>](#super-clock-日時更新要素)* の指定を上書きし、また該当要素に対してのみ適用されます。
### data-clock-pad-pseudo
　*[\<super-clock\>](#super-clock-日時更新要素)* の属性 *[pad-pseudo](#pad-pseudo)* と同等ですが、この属性に指定された値は *[\<super-clock\>](#super-clock-日時更新要素)* の指定を上書きし、また該当要素に対してのみ適用されます。
### data-clock-pad-str
　*[\<super-clock\>](#super-clock-日時更新要素)* の属性 *[pad-str](#pad-str)* と同等ですが、この属性に指定された値は *[\<super-clock\>](#super-clock-日時更新要素)* の指定を上書きし、また該当要素に対してのみ適用されます。
### data-clock-values
　指定された値と一致する属性 [id](https://developer.mozilla.org/ja/docs/Web/HTML/Global_attributes/id) を持つ *[\<enum-values\>](#enum-values-値列挙要素)* の値で、 *[data-clock](#data-clock)* に指定された日時の値を置き換えます。 *[\<super-clock\>](#super-clock-日時更新要素)* の属性 ```v-*``` と同等ですが、この属性に指定された値は *[\<super-clock\>](#super-clock-日時更新要素)* の指定を上書きし、また該当要素に対してのみ適用されます。現在の日時の値は *[\<enum-values\>](#enum-values-値列挙要素)* 内の子要素 *[\<enum-value\>](#enum-value-列挙値要素)* の位置か、属性 *[key](#key)* の値と対応します。位置は、最初の子要素を ``0`` とします。
```HTML
<!--
	以下の時、data-clock を持つ要素の日時値は 1 であるため、この 1 は、
	data-clock-values が示す <enum-values> 内の二番目の <enum-value> の内容である「月」に置き換えられる。
-->

<enum-values id="dn">
	<enum-value>日</enum-value>
	<enum-value>月</enum-value>
	<enum-value>火</enum-value>
	<enum-value>水</enum-value>
	<enum-value>木</enum-value>
	<enum-value>金</enum-value>
	<enum-value>土</enum-value>
</enum-values>

<super-clock auto>
	<span data-clock="dn" data-clock-values="dn">1</span>
</super-clock>
```

# \<enum-values\>: 値列挙要素
　この要素に内包された *[\<enum-value\>](#enum-value-列挙値要素)* を、列挙された一連の値として示すカスタム要素です。列挙された *[\<enum-value\>](#enum-value-列挙値要素)* は、先頭を ``0`` として、末尾までその順番に応じた位置番号を割り振られます。

　*[\<enum-values\>](#enum-values-値列挙要素)* を子要素として持つこともでき、この場合、内包された *[\<enum-values\>](#enum-values-値列挙要素)* 内の子要素 *[\<enum-value\>](#enum-value-列挙値要素)* は、内包する要素内のネストした値として扱われます。
## 属性
### key
　内包される *[\<enum-value\>](#enum-value-列挙値要素)* におけるこの要素が示す値の名前を指定された値で代替します。この属性を指定した場合、この要素の値には *[\<enum-values\>](#enum-values-値列挙要素)* 内の番号は割り振られません。この属性が指定された要素に割り振られるはずだった番号は、それに続くこの属性が指定されていない要素に割り振られます。
# \<enum-value\>: 列挙値要素
　この要素が *[\<enum-values\>](#enum-values-値列挙要素)* に内包されている時に、この要素の内容を値として示すカスタム要素です。値に特定の型が指定されている場合は、その値を [String.prototype.trim()](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/String/trim) の引数にして得た戻り値が値として使われます。
## 属性
### key
　*[\<enum-values\>](#enum-values-値列挙要素)* の *[key](#key)* と同等です。
### type
　この要素の内容の値の型を指定します。指定できる型には以下のものがあり、未指定かそれら以外の値を指定した場合は、値は文字列として扱われます。
> #### bool
> 　値は [Boolean](https://developer.mozilla.org/ja/docs/Glossary/Boolean) として扱われます。内容が ``false`` か ``0``、または空文字である場合、値は ``false`` になり、それ以外の場合は ``true`` になります。
> #### int
> 　値は *[parseInt](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/parseInt)* で変換されます。
> #### float
> 　値は *[parseFloat](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/parseFloat)* で変換されます。