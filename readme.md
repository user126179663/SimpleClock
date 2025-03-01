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
### invert
　論理属性で、指定されていると日時を示す文字列が数値の場合、それが正の数の場合は負の数にし、負の数の場合は正の数にします。日時が負の数になるのは *[since](#since)* を *[origin](#)* より未来の時刻に設定した上で、子孫要素の *[data-clock](#data-clock)* に ``-`` を接頭辞とした *[日時のパラメータ名](#日時のパラメータ名)* を指定した場合です。
### mute
　論理属性で、指定されていると時間の更新を行なっていても、子孫要素内のテキストの設定および更新は行ないません。
### origin*
　日時の開始時間を所定の形式で指定します。既定値は現在時刻です。

　整数を指定した場合、その文字列は [UNIX 元期](https://ja.wikipedia.org/wiki/UNIX%E6%99%82%E9%96%93)の時間(ミリ秒単位)として認識され、その時間を開始時刻に設定します。現在時刻から相対的に時間を指定する場合、接頭辞 ``+`` か ``-`` を使います。``+`` を付けると、それに続くミリ秒単位の時間分、現在時刻を進ませます。``-`` の場合は逆で、現在時刻から指定された時間分遡らせます。

　``@`` を接頭辞にすると、それに続く文字列を日時を示す文字列として認識します。この文字列は [Date() コンストラクター](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Date/Date) にそのまま引数として与えられるため、動作は [JavaScript の Date コンストラクターおよび Date.parse() の引数に指定する日付け文字列](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Date/Date#%E5%BC%95%E6%95%B0)に依存します。なお、``@`` の前後の空白および文字列の末尾の空白は許容されます。
### pad
　日時を示す文字列の文字数の上限を整数で指定します。文字数が上限に満たない場合、属性 *[pad-str](#pad-str)* で指定された文字列で補います。既定では不足する文字数分は左方向に対して補われますが、負の整数を指定した場合は右方向へ補われます。既定値は ``0`` です。 ``0`` の場合、更新された日時がそのまま表示されます。

　日時を示す文字列が負の数を示す場合、符号 ``-`` は文字数としてカウントされません。例えば ``data-clock="ms" pad="3"`` の時に、更新された値が ``-100`` ``-10`` ``-1`` ``1`` の時は、表示される値は ``-100`` ``-010`` ``-001`` ``001`` になります。日時が負の数になるのは *[since](#since)* を *[origin](#)* より未来の時刻に設定した上で、子孫要素の *[data-clock](#data-clock)* に ``-`` を接頭辞とした *[日時のパラメータ名](#日時のパラメータ名)* を指定した場合です。
### pad-pseudo
　論理属性で、指定されていると、属性 *[pad](#pad)*, *[pad-str](#pad-str)* によって補われた文字列（日時部分は含まない）を、子孫要素内にテキストとして直接埋め込むのではなく、該当子孫要素の属性 ``data-clock-pad-attr`` の値として設定します。この値は、通常 CSS 関数 [attr()](https://developer.mozilla.org/ja/docs/Web/CSS/attr) を通じて要素内の擬似要素 [::before](https://developer.mozilla.org/ja/docs/Web/CSS/::before) および [::after](https://developer.mozilla.org/ja/docs/Web/CSS/::after) に表示することができます。
### pad-str
　日時を示す文字列の文字数が属性 *[pad](#pad)* で指定された値に満たない場合、この属性に指定された値で不足を補います。既定値は文字列の ``0`` です。
### pause
　論理属性で、指定されていると日時を示す値が数値の場合、その値が ``0`` をまたいだ時、例えば負の数から始まって ``0`` に達した時に見かけ上の日時の更新を停止します（内部での更新処理そのものは止まりません）。任意の文字列を指定すると、停止した時に表示する値をその文字列で置き換えます。これは特に子孫要素に *[日時のパラメータ名](#日時のパラメータ名)* ``-ms`` を指定して、表示を ``0`` ミリ秒として止めたい時に有効です。大抵の場合、その指定状況では ``0`` のわずか手前（``967`` や``-34`` など）で表示が止まるためです。日時が負の数になるのは *[since](#since)* を *[origin](#)* より未来の時刻に設定した上で、子孫要素の *[data-clock](#data-clock)* に ``-`` を接頭辞とした *[日時のパラメータ名](#日時のパラメータ名)* を指定した場合です。
### setdata
　指定されていると、その値を子孫要素の *[data-clock](#data-clock)* の名前として、更新された時間をその値に設定します。値が未指定か、空文字を指定すると、``data-clock-value`` に更新された値が指定されます。
### since*
　子孫要素のカスタムデータ属性 *[data-clock](#data-clock)* の値に接頭辞 ``-`` がある時に、この属性に指定した値を *[origin](#origin)* が示す日時からの経過時間の開始日時とします。値は *[origin](#origin)* と同じ指定方法が使えます。既定値は ``0`` です。
### speed*
　時間の進む速さを設定します。具体的には、属性 *[timing](#timing)* で指定された値にこの属性に指定された値を乗算します。
### tack
　論理属性で、指定されていると以下の [CSS 変数](https://developer.mozilla.org/ja/docs/Web/CSS/--*)を設定します。任意の値を指定すると、以下の変数名やクラス名に含まれる文字列 *tack* を、その値で置き換えます。
#### --clock-tack-time
　属性 *[data-clock](#data-clock)* を指定された子孫要素に設定され、その属性が示す日時の値が次の値に切り替わるまでにかかる時間を CSS のデータ型 [\<time\>](https://developer.mozilla.org/ja/docs/Web/CSS/time) で示します。単位は ``ms`` です。例えば、``data-clock="s"`` である場合、``--clock-tack-time`` の値は概ね ``1s`` に近い値を示します。

　この CSS 変数が必要な理由は、日時の値が切り替わる時に、切り替わりに掛かる時間が常に一定とは限らないためです。例えば秒数に応じて要素をアニメーションさせたい時、``animation: keyframes 1s linear 0s infinite...`` とすれば一秒毎にアニメーションが再生されますが、仮に時計の開始時間が 19:30 2.5 である場合、秒が次の値に切り替わる時間は 0.5 秒であるため、19:30 3.0 になっても、アニメーションが再生されるのはその 0.5 秒後になります。これはミリ秒や秒であれば無視できる差かもしれませんが、それ以外では決定的な差を生じさせます。時計の開始時間が 19:30 30.0 で、アニメーションの指定が ``animation: keyframes 60s linear 0s infinite...`` であれば、実際に分が切り替わってから 30 秒もあとにアニメーションが再生されることになります。この時、``--clock-tack-time`` には、``30s`` に近い値が設定され、その後、19:31 0.0 に切り替わった際は、``--clock-tack-time`` には ``60s`` に近い値が改めて設定されます。

　この CSS 変数を CSS プロパティ [animation-iteration-count](https://developer.mozilla.org/ja/docs/Web/CSS/animation-iteration-count) の値を ```infinite``` に設定した上で [animation-duration](https://developer.mozilla.org/ja/docs/Web/CSS/animation-duration) に指定することは推奨されません。再生中のアニメーションは、プロパティに指定された CSS 変数の変化を反映しないためです。属性 *[tack](#tack)* が指定されていると、この CSS 変数を設定すると同時に、日時の値が切り替わった時に、該当の子孫要素のクラス名に ``tack`` を追加します。これは切り替わる度に追加操作が行なわれ、その際に要素に設定されたアニメーションを、その再生状態を問わずに初期化します。この動作に基づいて、以下の例のように指定すると、値の切り替わりと同時に要素を繰り返しアニメーションさせられます。
```CSS
.tack {
	animation: tack var(--clock-tack-time) linear 0s 1 normal forwards running;
}
@keyframes tack {
	from { opacity: 1; }
	to { opacity: 0; }
}
```

#### --clock-tack-*
　*[\<super-clock\>](#super-clock-日時更新要素)* に設定される、各日時の次の値に切り替わるまでの時間を CSS のデータ型 [\<time\>](https://developer.mozilla.org/ja/docs/Web/CSS/time) で示した変数です。単位は ``ms`` です。アスタリスク ``*`` は *[各日時のパラメータ名](#日時のパラメータ名)* になります。

　この変数が設定されるのは、子孫要素の *[data-clock](#data-clock)* に指定された *[日時のパラメータ名](#日時のパラメータ名)* に限ります。例えば子孫要素に ``data-clock="s"`` しかない場合、 *[\<super-clock\>](#super-clock-日時更新要素)* に設定される変数は ``--clock-tack-s`` だけです。

### time-zone
　論理属性で、指定されていると現在日時を[協定世界時](https://ja.wikipedia.org/wiki/%E5%8D%94%E5%AE%9A%E4%B8%96%E7%95%8C%E6%99%82)で表示します。未指定の場合、実行端末に設定された時間（一般的には現地時間、日本であれば[日本標準時](https://ja.wikipedia.org/wiki/%E6%97%A5%E6%9C%AC%E6%A8%99%E6%BA%96%E6%99%82)）で表示します。

　属性名が *[time-zone](#time-zone)* であるにもかかわらず、この属性を指定するとタイムゾーンを考慮しない日時を表示することになり紛らわしいですが、これは JavaScript の将来的な拡張を想定し、それに対応した変更を施した時に互換性を保つことを目的として命名しています。

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
### tack
　日時のいずれかの値でそれが数値である時に、その値が 0 に差し掛かった時に*のみ*、 *[\<super-clock\>](#super-clock-日時更新要素)* を発生源として通知されるイベントです。コールバック関数の第一引数に与えられるイベントオブジェクトのプロパティ ``detail`` には、更新された子孫要素の情報を示す *[SuperClockTickEventObject](#superclocktickeventobject)* を列挙した [Array](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Array) が設定されます。

#### SuperClockTickEventObject
##### as
　更新された子孫要素に指定された *[日時パラメータ名](#日時のパラメータ名)* に基づいて決定された、実際の *[日時パラメータ名](#日時のパラメータ名)* を示します。このプロパティを用いると、接頭辞 ``-`` が付いた *[日時パラメータ](#日時のパラメータ名)* を指定した時に対応する *[日時パラメータ](#日時のパラメータ名)* を確認できます。例えば ``data-clock="-h"`` の時は ``h`` を示します。
##### clock
　更新された子孫要素です。
##### name
　更新された *[日時のパラメータ名](#日時のパラメータ名)* です。
##### paused
　[Boolean](https://developer.mozilla.org/ja/docs/Glossary/Boolean) で、更新された *[日時のパラメータ](#日時のパラメータ名)* が示す日時が数値である時に、それが ``0`` に達して、[pause](#pause) ないし [data-clock-pause](#data-clock-pause) により表示の更新を停止した時に*のみ* ``true`` を示します。これは子孫要素の日時更新ライフサイクルの中では一度きりであることが期待されます。
##### pausing
　[Boolean](https://developer.mozilla.org/ja/docs/Glossary/Boolean) で、更新された *[日時のパラメータ](#日時のパラメータ名)* が示す日時が数値である時に、それが ``0`` に達して、[pause](#pause) ないし [data-clock-pause](#data-clock-pause) により表示の更新を停止している時に ``true`` を示し続けます。
##### reached
　[Boolean](https://developer.mozilla.org/ja/docs/Glossary/Boolean) で、更新された *[日時のパラメータ](#日時のパラメータ名)* が示す日時が数値である時に、それが ``0`` に達した時に*のみ* ``true`` を示します。これは子孫要素の日時更新ライフサイクルの中では一度きりであることが期待されます。
##### reaching
　[Boolean](https://developer.mozilla.org/ja/docs/Glossary/Boolean) で、更新された *[日時のパラメータ](#日時のパラメータ名)* が示す日時が数値である時に、それが ``0`` に達すると、それ以後 ``true`` を示し続けます。
##### tack
　更新された日時の、次の更新までにかかる時間をミリ秒単位で示す整数値です。
### tick
　日時のいずれかの値が切り替わった時に *[\<super-clock\>](#super-clock-日時更新要素)* を発生源として通知されるイベントです。コールバック関数の第一引数に与えられるイベントオブジェクトのプロパティ ``detail`` には、更新された子孫要素の情報を示す *[SuperClockTickEventObject](#superclocktickeventobject)* を列挙した [Array](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Array) が設定されます。

### tick-*
　特定の日時が切り替わった時に、 *[\<super-clock\>](#super-clock-日時更新要素)* を発生源として通知されるイベントです。アスタリスク ``*`` は *[日時を示す各パラメータ名](#日時のパラメータ名)* です。コールバック関数の第一引数に与えられるイベントオブジェクトのプロパティ ``detail`` には、更新された子孫要素に基づいて作成された *[SuperClockTickEventObject](#superclocktickeventobject)* を列挙した [Array](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Array) が指定されます。

## 対応する子孫要素のカスタムデータ属性
　*[\<super-clock\>](#super-clock-日時更新要素)* に包含されるすべての要素は以下の[カスタムデータ属性(data-*)](https://developer.mozilla.org/ja/docs/Web/HTML/Global_attributes/data-\*)を指定することで、 *[\<super-clock\>](#super-clock-日時更新要素)* によって行なわれる処理を制御できます。
### data-clock
　要素が *[\<super-clock\>](#super-clock-日時更新要素)* によって日時のどの部分として認識されるかを以下のパラメータ名によって示します。既定値は ``t`` です。 *[\<super-clock\>](#super-clock-日時更新要素)* は、この属性が指定された子孫要素のみを処理の対象とします。
#### 日時のパラメータ名
##### --y
　*[\<super-clock\>](#super-clock-日時更新要素)* の属性 *[since](#since)* に指定した日時からの累計年数を示します。このパラメータを指定した時、 *[\<super-clock\>](#super-clock-日時更新要素)* の属性 *[v-y](#v-y)* および子孫要素のカスタムデータ属性 *[data-clock-values](#data-clock-values)* の指定は無視されます。
##### --m
　*[\<super-clock\>](#super-clock-日時更新要素)* の属性 *[since](#since)* に指定した日時からの累計月数を示します。このパラメータを指定した時、 *[\<super-clock\>](#super-clock-日時更新要素)* の属性 *[v-m](#v-m)* および子孫要素のカスタムデータ属性 *[data-clock-values](#data-clock-values)* の指定は無視されます。
##### --d
　*[\<super-clock\>](#super-clock-日時更新要素)* の属性 *[since](#since)* に指定した日時からの累計日数を示します。このパラメータを指定した時、 *[\<super-clock\>](#super-clock-日時更新要素)* の属性 *[v-d](#v-d)* および子孫要素のカスタムデータ属性 *[data-clock-values](#data-clock-values)* の指定は無視されます。
##### --h
　*[\<super-clock\>](#super-clock-日時更新要素)* の属性 *[since](#since)* に指定した日時からの累計時間を示します。このパラメータを指定した時、 *[\<super-clock\>](#super-clock-日時更新要素)* の属性 *[v-h](#v-h)* および子孫要素のカスタムデータ属性 *[data-clock-values](#data-clock-values)* の指定は無視されます。
##### --mi
　*[\<super-clock\>](#super-clock-日時更新要素)* の属性 *[since](#since)* に指定した日時からの累計分数を示します。このパラメータを指定した時、 *[\<super-clock\>](#super-clock-日時更新要素)* の属性 *[v-mi](#v-mi)* および子孫要素のカスタムデータ属性 *[data-clock-values](#data-clock-values)* の指定は無視されます。
##### --s
　*[\<super-clock\>](#super-clock-日時更新要素)* の属性 *[since](#since)* に指定した日時からの累計秒数を示します。このパラメータを指定した時、 *[\<super-clock\>](#super-clock-日時更新要素)* の属性 *[v-s](#v-s)* および子孫要素のカスタムデータ属性 *[data-clock-values](#data-clock-values)* の指定は無視されます。
##### --ms
　*[\<super-clock\>](#super-clock-日時更新要素)* の属性 *[since](#since)* に指定した日時からの累計ミリ秒数を示します。このパラメータを指定した時、 *[\<super-clock\>](#super-clock-日時更新要素)* の属性 *[v-ms](#v-ms)* および子孫要素のカスタムデータ属性 *[data-clock-values](#data-clock-values)* の指定は無視されます。
##### -y
　*[\<super-clock\>](#super-clock-日時更新要素)* の属性 *[since](#since)* に指定した日時からの経過年数を示します。このパラメータを指定した時、 *[\<super-clock\>](#super-clock-日時更新要素)* の属性 *[v-y](#v-y)* および子孫要素のカスタムデータ属性 *[data-clock-values](#data-clock-values)* の指定は無視されます。
##### -m
　*[\<super-clock\>](#super-clock-日時更新要素)* の属性 *[since](#since)* に指定した日時からの経過月数を示します。このパラメータを指定した時、 *[\<super-clock\>](#super-clock-日時更新要素)* の属性 *[v-m](#v-m)* および子孫要素のカスタムデータ属性 *[data-clock-values](#data-clock-values)* の指定は無視されます。
##### -d
　*[\<super-clock\>](#super-clock-日時更新要素)* の属性 *[since](#since)* に指定した日時からの経過日数を示します。このパラメータを指定した時、 *[\<super-clock\>](#super-clock-日時更新要素)* の属性 *[v-d](#v-d)* および子孫要素のカスタムデータ属性 *[data-clock-values](#data-clock-values)* の指定は無視されます。
##### -h
　*[\<super-clock\>](#super-clock-日時更新要素)* の属性 *[since](#since)* に指定した日時からの経過時間を示します。このパラメータを指定した時、 *[\<super-clock\>](#super-clock-日時更新要素)* の属性 *[v-h](#v-h)* および子孫要素のカスタムデータ属性 *[data-clock-values](#data-clock-values)* の指定は無視されます。
##### -mi
　*[\<super-clock\>](#super-clock-日時更新要素)* の属性 *[since](#since)* に指定した日時からの経過分数を示します。このパラメータを指定した時、 *[\<super-clock\>](#super-clock-日時更新要素)* の属性 *[v-mi](#v-mi)* および子孫要素のカスタムデータ属性 *[data-clock-values](#data-clock-values)* の指定は無視されます。
##### -s
　*[\<super-clock\>](#super-clock-日時更新要素)* の属性 *[since](#since)* に指定した日時からの経過秒数を示します。このパラメータを指定した時、 *[\<super-clock\>](#super-clock-日時更新要素)* の属性 *[v-s](#v-s)* および子孫要素のカスタムデータ属性 *[data-clock-values](#data-clock-values)* の指定は無視されます。
##### -ms
　*[\<super-clock\>](#super-clock-日時更新要素)* の属性 *[since](#since)* に指定した日時からの経過ミリ秒数を示します。このパラメータを指定した時、 *[\<super-clock\>](#super-clock-日時更新要素)* の属性 *[v-ms](#v-ms)* および子孫要素のカスタムデータ属性 *[data-clock-values](#data-clock-values)* の指定は無視されます。
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
　*[\<super-clock\>](#super-clock-日時更新要素)* の属性 *[as-html](#as-html)* と同等で、 *[\<super-clock\>](#super-clock-日時更新要素)* による同属性の指定をこの属性に指定された値で上書きします。
### data-clock-force-text
　*[\<super-clock\>](#super-clock-日時更新要素)* の属性 *[as-html](#as-html)* と、この要素の *[data-clock-as-html](#data-clock-as-html)* の指定にかかわらず、 *[\<super-clock\>](#super-clock-日時更新要素)* によってこの要素の内容として書き込まれる値をプレーンテキストとして扱うことを強制します。
### data-clock-invert
　*[\<super-clock\>](#super-clock-日時更新要素)* の属性 *[invert](#invert)* と同等で、 *[\<super-clock\>](#super-clock-日時更新要素)* による同属性の指定をこの属性に指定された値で上書きします。
### data-clock-disabled-setdata
　論理属性で、この属性が指定された要素は *[setdata](#setdata)* による ``data-`` への書き込みが行なわれません。
### data-clock-disabled-tack
　論理属性で、この属性が指定された要素は *[tack](#tack)* および *[data-clock-tack](#data-clock-tack)* による [CSS 変数](https://developer.mozilla.org/ja/docs/Web/CSS/--*)の作成が行なわれません。
### data-clock-mute
　論理属性で、この属性が指定された要素は該当する日時が更新されてもその値をテキストとして書き込みする処理が行なわれません。
### data-clock-pad
　*[\<super-clock\>](#super-clock-日時更新要素)* の属性 *[pad](#pad)* と同等で、 *[\<super-clock\>](#super-clock-日時更新要素)* による同属性の指定をこの属性に指定された値で上書きします。
### data-clock-pad-pseudo
　*[\<super-clock\>](#super-clock-日時更新要素)* の属性 *[pad-pseudo](#pad-pseudo)* と同等で、 *[\<super-clock\>](#super-clock-日時更新要素)* による同属性の指定をこの属性に指定された値で上書きします。
### data-clock-pad-str
　*[\<super-clock\>](#super-clock-日時更新要素)* の属性 *[pad-str](#pad-str)* と同等で、 *[\<super-clock\>](#super-clock-日時更新要素)* による同属性の指定をこの属性に指定された値で上書きします。
### data-clock-pause
　*[\<super-clock\>](#super-clock-日時更新要素)* の属性 *[pause](#pause)* と同等で、 *[\<super-clock\>](#super-clock-日時更新要素)* による同属性の指定をこの属性に指定された値で上書きします。
### data-clock-since
　*[\<super-clock\>](#super-clock-日時更新要素)* の属性 *[since](#since)* と同等で、 *[\<super-clock\>](#super-clock-日時更新要素)* による同属性の指定をこの属性に指定された値で上書きします。
### data-clock-tack
　*[\<super-clock\>](#super-clock-日時更新要素)* の属性 *[tack](#tack)* と同等で、 *[\<super-clock\>](#super-clock-日時更新要素)* による同属性の指定をこの属性に指定された値で上書きします。
### data-clock-time-zone
　*[\<super-clock\>](#super-clock-日時更新要素)* の属性 *[time-zone](#time-zone)* と同等で、 *[\<super-clock\>](#super-clock-日時更新要素)* による同属性の指定をこの属性に指定された値で上書きします。
### data-clock-value
　論理属性で、指定されていると、更新された値がこのカスタムデータ属性にも設定されます。
### data-clock-values
　指定された値と一致する属性 [id](https://developer.mozilla.org/ja/docs/Web/HTML/Global_attributes/id) を持つ *[\<enum-values\>](#enum-values-値列挙要素)* の値で、 *[data-clock](#data-clock)* に指定された日時の値を置き換えます。 *[\<super-clock\>](#super-clock-日時更新要素)* の属性 ```v-*``` と同等で、 *[\<super-clock\>](#super-clock-日時更新要素)* による同属性の指定をこの属性に指定された値で上書きします。現在の日時の値は *[\<enum-values\>](#enum-values-値列挙要素)* 内の子要素 *[\<enum-value\>](#enum-value-列挙値要素)* の位置か、属性 *[key](#key)* の値と対応します。位置は、最初の子要素を ``0`` とします。
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

# 作例
## 日付け付きの時計
```HTML
<!DOCTYPE html>
<html lang="ja">
	<head>
		<meta charset="utf-8">
		<title>日付け付きの時計 - SuperClock</title>
		<script src="super-clock.js"></script>
	</head>
	<body>
		
		<super-clock pad="2" auto>
			<div>
				<span data-clock="y"></span>/<span data-clock="m"></span>/<span data-clock="d"></span>
			</div>
			<div>
				<span data-clock="h"></span>:<span data-clock="mi"></span>:<span data-clock="s"></span>
			</div>
		</super-clock>
		
	</body>
</html>
```
## 非破壊更新
　通常、日時の値は [Node.textContent](https://developer.mozilla.org/ja/docs/Web/API/Node/textContent) を通じて直接該当する子孫要素に書き込まれますが、その場合、その要素の内容は、更新時にすべて失われてしまいます。しかし、以下の作例のように *[mute](#mute)*, *[setdata](#setdata)* を同時に指定することで、要素の内容を失わずに日時の値を更新および表示することができるようになります。同様に、対象の子孫要素に *[data-clock-mute](#data-clock-mute)*, *[data-clock-value](#data-clock-value)* を同時に設定することで個別にこの動作を設定することもできます。

　一方で、この方法はアクセシビリティの観点からも必ずしも正当とは言えません。第一に、 *[setdata](#setdata)* を通じて表示された値は、ウェブページ上で選択やコピーなどの編集操作を行なえません。そして、インライン要素に *[data-clock](#data-clock)* を指定すれば、テキスト内に独立して日時を埋め込むことは常にできるためです。これらは、HTML の論理構造を明確にすると言う点でも考慮に値すると言えます。
```HTML
<!DOCTYPE html>
<html lang="ja">
	<head>
		<meta charset="utf-8">
		<title>非破壊更新 - SuperClock</title>
		<script src="super-clock.js"></script>
		<style>
			[data-clock] {
				display: flex;
			}
			[data-clock] > :first-child {
				order: 1;
			}
			[data-clock]::before {
				content: attr(data-clock-value);
				order: 2;
			}
			[data-clock] > :last-child {
				order: 3;
			}
		</style>
	</head>
	<body>
		
		<super-clock auto mute setdata><div data-clock><span>1970年1月1日から</span><span>ミリ秒経過中</span></div></super-clock>
		
		<!-- 比較用。data-clock が設定された div は内容を持つが、ページを読み込むと、上記と異なり、日時パラメータの t の値しか表示されない。 -->
		<super-clock auto><div data-clock><span>1970年1月1日から</span><span>ミリ秒経過中</span></div></super-clock>
		
	</body>
</html>
```
## 擬似的な経過時間の計測
　*[origin](#origin)* に ``0`` を指定し、 *[time-zone](#time-zone)* を指定すると、経過時間を計測する時計を作れます。ただしこれは擬似的な計測で、実際には[協定世界時](https://ja.wikipedia.org/wiki/%E5%8D%94%E5%AE%9A%E4%B8%96%E7%95%8C%E6%99%82)における[UNIX 元期](https://ja.wikipedia.org/wiki/UNIX%E6%99%82%E9%96%93)(1970年1月1日0時0分0.0秒)からの経過時間です。

　JavaScript の経験者であれば、この設定を応用して簡易のストップウォッチを作ることを発想するかもしれませんが、この要素は自身の時間を現在時刻と非同期に進行させることはできません。例えば開始から 15 秒後にいったん計測を停止し、3 秒後に計測を再開した時に表示される時間は 15 秒ではなく 18 秒になります。
```HTML
<!DOCTYPE html>
<html lang="ja">
	<head>
		<meta charset="utf-8">
		<title>擬似的な経過時間の計測- SuperClock</title>
		<script src="super-clock.js"></script>
	</head>
	<body>
		
		<super-clock pad="2" origin="0" time-zone auto>
			<span data-clock="h"></span>:<span data-clock="mi"></span>:<span data-clock="s"></span>
		</super-clock>
		
	</body>
</html>
```

　特定の日時からの経過および累計時間を表示することもできます。属性 *[since](#since)* に任意の日時を指定した上で、子孫要素のカスタムデータ属性 *[data-clock](#data-clock)* に接頭辞 ``-`` ないし ``--`` が付いた[日時パラメータ](#日時のパラメータ名)を指定してください。例えば特定の日時からの経過日数を表示したい場合は任意の子孫要素に ``data-clock="-d"`` を指定します。

　これを使えば、例えば配信を始めてから何日目、あるいは何時間目と言ったことを画面に表示することができるようになります。ただし、この処理は通常の日時更新処理と比べて相対的に高コストです。また、配信映像には通常数秒以上のラグが含まれます。このラグは *[origin](#origin)* の ``+`` 指定で見かけ上縮めることはできますが、ラグは映像の受信者の所在地によって上下するため、本質的な解決にはなりません。表示している時間にラグが含まれることを何らかの手段で受信者に伝えるのは決して無意味ではありません。
```HTML
<!DOCTYPE html>
<html lang="ja">
	<head>
		<meta charset="utf-8">
		<title>特定の日時からの経過、累計時間 - SuperClock</title>
		<script src="super-clock.js"></script>
	</head>
	<body>
    	
		<div>
			
			<super-clock since="0" auto>
				
				<div>
					1970年1月1日0時0分0秒から
					<span data-clock="-y"></span>年
					<span data-clock="-m"></span>ヶ月
					<span data-clock="-d"></span>日
					<span data-clock="-h"></span>時間
					<span data-clock="-mi"></span>分
					<span data-clock="-s"></span>秒
					経過中
				</div>
				
				<div>
					1970年1月1日0時0分0秒から <span data-clock="--y"></span> 年経過中<br>
					1970年1月1日0時0分0秒から <span data-clock="--m"></span> ヶ月経過中<br>
					1970年1月1日0時0分0秒から <span data-clock="--d"></span> 日経過中<br>
					1970年1月1日0時0分0秒から <span data-clock="--h"></span> 時間経過中<br>
					1970年1月1日0時0分0秒から <span data-clock="--mi"></span> 分経過中<br>
					1970年1月1日0時0分0秒から <span data-clock="--s"></span> 秒経過中
				</div>
				
			</super-clock>
			d
		</div>
		
	</body>
</html>
```