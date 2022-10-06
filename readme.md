# 概要
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

# 属性
　末尾にアスタリスク ``*`` が付いている属性の動作は未検証です。
## auto
　論理属性で、指定されていると要素がドキュメントに接続された時に自動的に時間の更新を開始します。JavaScript を通じて操作を行なわない場合、あらかじめこの属性を指定しておく以外で時間の更新を開始させる方法はありません。
## floor
　論理属性で、指定されていると開始時間のミリ秒を ``0`` に切り下げます。
## mute
　論理属性で、指定されていると時間の更新を行なっていても、子孫要素内のテキストの設定および更新は行ないません。
## origin*
　日時の開始時間を任意の [UNIX 元期](https://ja.wikipedia.org/wiki/UNIX%E6%99%82%E9%96%93)で指定します。接頭辞に ``+`` と ``-`` があり、``+`` を付けると、それに続くミリ秒単位の時間分、現在時刻を進ませた値を開始時間に設定します。``-`` の場合は、逆に現在時刻から指定された値分遡らせます。既定値は現在時刻です。
## pad
　日時を示す文字列の文字数の上限を整数で指定します。文字数が上限に満たない場合、属性 ``pad-str`` で指定された文字列で補います。既定では不足する文字数分は左方向に対して補われますが、負の整数を指定した場合は右方向へ補われます。
## pad-pseudo
　論理属性で、指定されていると、属性 ``pad``, ``pad-str`` によって補われた文字列（日時部分は含まない）を、子孫要素内にテキストとして直接埋め込むのではなく、該当子孫要素の属性 ``data-clock-pad-attr`` の値として設定します。この値は、通常 CSS 関数 [attr()](https://developer.mozilla.org/ja/docs/Web/CSS/attr) を通じて要素内の擬似要素 [::before](https://developer.mozilla.org/ja/docs/Web/CSS/::before) および [::after](https://developer.mozilla.org/ja/docs/Web/CSS/::after) に表示することができます。
## pad-str
　日時を示す文字列の文字数が属性 ``pad`` で指定された値に満たない場合、この属性に指定された値で不足を補います。既定値は文字列の ``0`` です。
## setdata
　指定されていると、その値を子孫要素の属性 ``data-`` の名前として、その値に更新された時間を設定します。空文字を設定すると ``clock-value`` が使われます。
## speed*
　時間の進む速さを設定します。具体的には、属性 ``timing`` で指定された値にこの属性に指定された値を乗算します。
## timing
　時間の更新間隔をミリ秒単位で指定します。値を小さくするほど、日時の更新は頻繁に行なわれます。これはミリ秒を表示させたい時に有利ですが、一方で極端に頻繁な更新はウェブページ全体のパフォーマンスを低下させる恐れがあります。

　主に技術的な理由で、この属性の値は ``100`` 以下を目安としてください。特に ``1000`` 以上か、それに近い値に設定すると、現実の時間との誤差が生じる可能性が強まります。既定値は ``67`` です。
## v-y
## v-m
## v-d
## v-h
## v-mi
## v-s
## v-ms
## v-dn
## v-hn
## v-h12
## v-t
## value
　子孫要素に設定できる属性 ``data-clock`` の既定値を設定します。既定値は ``t`` です。

# CSS変数
　以下の [CSS 変数](https://developer.mozilla.org/ja/docs/Web/CSS/--*) は、属性 ``data-clock`` を指定された子孫要素に自動的に設定されます。
## --clock-tack-time
　``data-clock`` が示す日時の値が、次の値に切り替わるまでにかかる時間を CSS のデータ型 [<time>](https://developer.mozilla.org/ja/docs/Web/CSS/time) で示します。単位は秒単位の ``s`` です。例えば、``data-clock="s"`` である場合、``--clock-tack-time`` の値は概ね ``1s`` に近い値を示します。

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
　この変数には、変数名の末尾の time を、``data-clock`` に指定した文字列に置き換えたエイリアスがあります。例えば ``data-clock="s"`` のエイリアスは ``--clock-tack-s``です。``--clock-tack-time`` は、該当の子孫要素に設定されますが、エイリアスはそれらの親となる ```<super-clock>``` 自身に設定されます。これは、子孫要素はすべてエイリアス変数が参照可能であることを意味します。

# 子孫要素に設定可能な data- 属性
## data-clock
## data-clock-disabled-setdata
## data-clock-mute
## data-clock-pad
## data-clock-padPseudo
## data-clock-padStr
## data-clock-value
## data-clock-values
