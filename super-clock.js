class SuperClock extends HTMLElement {
	
	static getValues(id, defaultValue = []) {
		
		return document.getElementById(id)?.valueOf?.() ?? defaultValue;
		
	}
	
	static tick() {
		
		const	{ from, last, origin, speed, style, timing } = this,
				lastUpdatedClocks = last[SuperClock.updated],
				clocks = this.querySelectorAll('[data-clock]'), l = clocks.length,
				current = Date.now(), lag = this.tack ? (current - this.tack) - timing : 0,
				updateValue = {};
		let i,i0,k, updated;
		
		this.tack && (this.accumulation += lag),
		i = i0 = -1, this.now = new Date(origin + (current - from) * speed), lastUpdatedClocks.length = 0;
		//this.now = new Date(origin + ((current - this.accumulation) - from) * speed);
		while (++i < l) (updated = this.write(clocks[i])),
			(updateValue[typeof updated === 'string' ? updated : (lastUpdatedClocks[++i0] = updated).name] = updated);
		
		for (k in last) k in updateValue || (delete last[k]);
		
		if (i0 !== -1) {
			
			for (k in last) 'v' in last[k] && (style.setProperty('--clock-tack-' + k, last[k].v), delete last[k].v);
			
			this.dispatchEvent(new CustomEvent('tick', { detail: [ ...lastUpdatedClocks ] }));
			
		}
		
		this.tack = Date.now(), this.clock = setTimeout(this.tick, timing);
		
	}
	
	static getDateValue(date, valueName, timeZone) {
		
		return date['get' + (timeZone ? 'UTC' : '') + valueName[0].toUpperCase() + valueName.slice(1)]();
		
	}
	
	static {
		
		this.PAD = 0,
		this.PADSTR = '0',
		this.SETDATA = 'clock-value',
		this.SPEED = 1,
		this.TACK = 'tack',
		this.TIMING = 67,
		this.VALUE = 't',
		
		this.dn = [ 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat' ],
		this.hn = [ 'AM', 'PM' ],
		
		this.updated = Symbol('SuperClock.updated');
		
	}
	
	constructor() {
		
		super(),
		
		this.tick = SuperClock.tick.bind(this),
		
		this.last = { [SuperClock.updated]: [] };
		
	}
	connectedCallback() {
		
		this.auto && this.start();
		
	}
	
	start() {
		
		this.accumulation = 0,
		this.from ??= Date.now(),
		
		this.clock || this.tick();
		
	}
	stop() {
		
		clearInterval(this.clock),
		delete this.clock;
		
	}
	
	fetchClockData(element) {
		
		const	{ adjacent, pad, padPseudo, padStr, tackName, timeZone, value } = this,
				{ dataset } = element,
				padRaw = 'clockPad' in element.dataset ? parseInt(element.dataset.clockPad) : NaN;
		
		return	{
						asHTML: 'clockAsHTML' in dataset,
						forceText: 'clockForceText' in dataset,
						pad: Number.isNaN(padRaw) ? pad : padRaw,
						padPseudo: 'clockPadPseudo' in dataset || !!('clockDisabledPadPseudo' in dataset) || padPseudo,
						padStr: 'clockPadStr' in dataset ? dataset.clockPadStr : padStr,
						tack: 'clockTack' in dataset ? dataset.clockTack : tackName,
						timeZone: 'clockTimeZone' in dataset || timeZone,
						value: 'clock' in dataset ? dataset.clock : value,
						values: 'clockValues' in dataset ? SuperClock.getValues(dataset.clockValues) : []
					};
		
	}
	
	write(clock) {
		
		if (!(clock instanceof HTMLElement)) return;
		
		const	{ getDateValue } = SuperClock,
				{ now } = this,
				{ asHTML, forceText, pad, padPseudo, padStr, tack, timeZone, value, values } = this.fetchClockData(clock),
				padAbs = Math.abs(pad);
		let i,i0,v,v0, from, remained,value0,vk;
		
		switch (value0 = value?.toLowerCase?.()) {
			
			case 'y':
			i = getDateValue(now, 'fullYear', timeZone),
			from = [ now.getFullYear() + 1,0,1, 0,0,0,0 ];
			break;
			
			case 'm':
			const m = now.getMonth(), nm = m === 11 ? 0 : m + 1;
			i = getDateValue(now, 'month', timeZone),
			i0 = m + 1,
			from = [ now.getFullYear() + !nm,nm,1,0,0,0,0 ];
			break;
			
			case 'd':
			i = getDateValue(now, 'date', timeZone),
			from = [
				new Date(
					now.getFullYear(),
					now.getMonth(),
					now.getDate(),
					0,0,0,0
				).getTime() + 86400000
			];
			break;
			
			case 'h':
			i = getDateValue(now, 'hours', timeZone);
			case 'h12':
			i ?? ((i = getDateValue(now, 'hours', timeZone)) > 11 && (i -= 12)),
			from = [
				new Date(
					now.getFullYear(),
					now.getMonth(),
					now.getDate(),
					now.getHours(),
					0,0,0
				).getTime() + 3600000
			];
			break;
			
			case 'mi':
			i = getDateValue(now, 'minutes', timeZone),
			from = [
				new Date(
					now.getFullYear(),
					now.getMonth(),
					now.getDate(),
					now.getHours(),
					now.getMinutes(),
					0,0
				).getTime() + 60000
			];
			break;
			
			case 's':
			i = getDateValue(now, 'seconds', timeZone),
			from = [
				new Date(
					now.getFullYear(),
					now.getMonth(),
					now.getDate(),
					now.getHours(),
					now.getMinutes(),
					now.getSeconds(),
					0
				).getTime() + 1000
			];
			break;
			
			case 'ms':
			from = [ (i = now.getTime()) + 1 ];
			break;
			
			case 'dn':
			i = getDateValue(now, 'day', timeZone), vk = 'vDN',
			from = [
				new Date(
					now.getFullYear(),
					now.getMonth(),
					now.getDate(),
					0,0,0,0
				).getTime() + 86400000
			];
			break;
			
			case 'hn':
			i = parseInt((v0 = getDateValue(now, 'hours', timeZone)) / 12), vk = 'vHN',
			from = [
				new Date(
					now.getFullYear(),
					now.getMonth(),
					now.getDate(),
					now.getHours(),
					0,0,0
				).getTime() +
				43200000 - (v0 - (12 * i)) * 3600000
			];
			break;
			
			default:
			value0 = 't', from = [ (i = now.getTime()) + 1 ];
			
		}
		
		v = values[i] ?? this[vk ||= 'v' + value0[0].toUpperCase() + value0.slice(1)][i] ?? i0 ?? i;
		
		if (pad && padPseudo && padStr) {
			
			const l = (''+v).length, cnt = l < padAbs ? parseInt((padAbs - l) / padStr.length) + 1 : 0,
					padded = cnt && padStr.repeat(cnt);
			
			clock.dataset.clockPadAttr = cnt ? pad < 0 ? padded.slice(pad + l) : padded.slice(0, pad - l) : '';
			
		} else pad && (v = (''+v)['pad' + (pad < 0 ? 'End' : 'Start')](padAbs, padStr));
		
		const last = this.last[value0] ??= {};
		
		if (last.i === i) return value0;
		
		// timing を対象の値に近い値（例えば data-clock="s" を指定した要素を含む時に、timing="1000" にするなど）にすると、
		// 処理時間などによって生じる誤差を丸め切れずに、時間の変更間隔が不正確になる場合がある。
		// 例えば timing="1000" で、1000,2000,3001,4002,... と、経過時間+処理時間で 1 ミリ秒ずつ増えるなど。
		// 開発ツールで対象の要素の CSS 変数 --clock-tack-time の変化を追い続けるとこの誤差を視覚的に確認し易い。
		// 実際のところ、対応不能かどうか判断しきれないところがあるが、現状は timing の値を 100 ミリ秒以下にすることでこの問題を回避できる。
		// 対応としては、この関数の実行時間を常に 0.0 秒 と仮定すれば次の時間までの厳密な差を得ることができるが（例えば一秒後は常に一秒後になる）、
		// 誤差は常に存在し続けるので、現実の時間と実行時間との差が一秒以上開いた時にこの時計の時間は二秒進むことになる。
		// これは例えば現実の時間が 2.3 秒の時、3.3 秒を一秒後にすれば、差は常に厳密に 1 秒だが、
		// 現実の時間の取得には常にラグが加算され続けるので、2.4,2.5,2.6... とミリ秒が増えてゆく。
		// その間、時計は常に 2 秒を示し続けるが、この誤差が 2 秒の範囲を超えた時、それまで 2 秒を示し続けていた時計は、
		// 2.0 + 0.9(誤差) + 1.0(次の秒) < 4, 2.0 + 1.0(誤差) + 1.0(次の秒) === 4 となり、2 秒の次の秒が 4 秒になる。
		
		const updated = { name: value0, clock };
		
		last.i = i,
		
		this.mute || clock.dataset.clockMute ||
			(clock[forceText || (!asHTML && !this.asHTML) ? 'textContent' : 'innerHTML'] = v),
		
		clock.hasAttribute('data-clock-disabled-setdata') || (
			clock.hasAttribute('data-clock-value') && (clock.dataset.clockValue = v),
			this.hasAttribute('setdata') && clock.setAttribute('data-' + this.setdata, v)
		),
		
		updated.tack = (new Date(...from).getTime() - now.getTime()) * this.speed,
		
		tack && !clock.hasAttribute('data-clock-disabled-tack') && (
						clock.style.setProperty('--clock-' + tack + '-time', last.v = updated.tack + 'ms'),
						clock.classList.remove(tack), void clock.offsetWidth, clock.classList.add(tack)
					),
		
		this.dispatchEvent(new CustomEvent('tick-' + value0, { detail: updated }));
		
		return updated;
		
	}
	
	getDiff() {
		
		const origin = this.getAttribute('origin')?.trim?.() ?? '';
		
		// 以下のようにビット演算子で値を整数に変換すると、値が符号付き 32 ビットの範囲(-2147483648 から 2147483647) を超えると
		// ビット演算子の仕様に基づき正負が反転する。（例: 2147483648|0) そのため parseInt を用いて変換するように改修。
		//return origin ? origin[0] === '+' ? origin.slice(1)|0 : origin[0] === '-' ? -origin.slice(1)|0 : origin : origin;
		
		return	origin ?
						origin[0] === '+' ? parseInt(origin.slice(1)) :
							origin[0] === '-' ? -parseInt(origin.slice(1)) : origin :
						origin;
		
	}
	
	getValues(key, defaultValue) {
		
		return SuperClock.getValues(this.getAttribute('v-' + key), defaultValue);
		
	}
	
	get asHTML() { return this.hasAttribute('as-html'); }
	set asHTML(v) { v || typeof v === 'string' ? this.setAttribute('as-html', v) : this.removeAttribute('as-html'); }
	
	get auto() { return this.hasAttribute('auto'); }
	set auto(v) {
		
		v || typeof v === 'string' ?
			this.clock || (this.start(), this.setAttribute('auto', '')) : this.removeAttribute('auto');
		
	}
	
	get tackName () { return this.hasAttribute('tack') && (this.getAttribute('tack') || SuperClock.TACK); }
	set tackName (v) { return v || typeof v === 'string' ? this.setAttribute('tack', v) : this.removeAttribute('tack'); }
	
	get floor() { return this.hasAttribute('floor'); }
	set floor(v) {
		v || typeof v === 'string' ? this.setAttribute('floor', v) : this.removeAttribute('floor');
	}
	
	get mute() { return this.hasAttribute('mute'); }
	set mute(v) {
		v || typeof v === 'string' ? this.setAttribute('mute', v) : this.removeAttribute('mute');
	}
	
	get origin() {
		
		const	{ from = 0 } = this, diff = this.getDiff(),
				origin = typeof diff === 'number' ? from + diff : diff ? new Date(parseInt(diff))?.getTime?.() : from;
		
		return this.floor ? parseInt(origin / 1000) * 1000 : origin;
		
	}
	set origin(v) { this.setAttribute('origin', v); }
	
	get pad() {
		
		const v = parseInt(this.getAttribute('pad'));
		
		return Number.isNaN(v) ? SuperClock.PAD : v;
		
	}
	set pad(v) { this.setAttribute('pad', v); }
	
	get padStr() { return this.hasAttribute('pad-str') ? this.getAttribute('pad-str') : SuperClock.PADSTR; }
	set padStr(v) { this.setAttribute('pad-str', v); }
	
	get padPseudo() { return this.hasAttribute('pad-pseudo'); }
	set padPseudo(v) {
		v || typeof v === 'string' ? this.setAttribute('pad-pseudo', v) : this.removeAttribute('pad-psuedo');
	}
	
	get setdata() { return this.getAttribute('setdata') || SuperClock.SETDATA; }
	set setdata(v) { this.setAttribute('setdata', v); }
	
	get speed() {
		const v = this.getAttribute('speed') || SuperClock.SPEED, v0 = +v;
		return Number.isNaN(v0) ? SuperClock.SPEED : v0;
	}
	set speed(v) { this.setAttribute('speed', v); }
	
	get timeZone() { return this.hasAttribute('time-zone'); }
	set timeZone(v) { this.toggleAttribute('time-zone', !!v); }
	
	get timing() {
		
		const v = Math.abs(parseInt(this.getAttribute('timing')));
		
		return Number.isNaN(v) || !v ? SuperClock.TIMING : v;
		
	}
	set timing(v) { this.setAttribute('timing', v); }
	
	get vY() { return this.getValues('y'); }
	set vY(v) { this.setAttribute('v-y', v); }
	get vM() { return this.getValues('m'); }
	set vM(v) { this.setAttribute('v-m', v); }
	get vD() { return this.getValues('d'); }
	set vD(v) { this.setAttribute('v-d', v); }
	
	get vDN() { return this.getValues('dn', SuperClock.dn); }
	set vDN(v) { this.setAttribute('v-dn', v); }
	get vHN() { return this.getValues('hn', SuperClock.hn); }
	set vHN(v) { this.setAttribute('v-hn', v); }
	get vH12() { return this.getValues('h12'); }
	set vH12(v) { this.setAttribute('v-h12', v); }
	
	get vH() { return this.getValues('h'); }
	set vH(v) { this.setAttribute('v-h', v); }
	get vMi() { return this.getValues('mi'); }
	set vMi(v) { this.setAttribute('v-mi', v); }
	get vS() { return this.getValues('s'); }
	set vS(v) { this.setAttribute('v-s', v); }
	get vMS() { return this.getValues('ms'); }
	set vMS(v) { this.setAttribute('v-ms', v); }
	get vT() { return this.getValues('t'); }
	set vT(v) { this.setAttribute('v-t', v); }
	
	get value() { return this.getAttribute('value') || SuperClock.VALUE; }
	set value(v) { this.setAttribute('value', v); }
	
}

class EnumValues extends HTMLElement {
	
	constructor() {
		
		super();
		
	}
	
	valueOf() {
		
		const	enumerated = this.querySelectorAll(':scope > enum-value, :scope > enum-values'),
				l = enumerated.length, values = [];
		let i,i0,v,k, value;
		
		i = i0 = -1;
		while (++i < l) values[(k = (value = enumerated[i]).key) ? k : ++i0] = value.valueOf();
		
		return values;
		
	}
	
	get key() { return this.getAttribute('key'); }
	set key(v) { this.setAttribute('key', v); }
	
}
class EnumValue extends HTMLElement {
	
	constructor() {
		
		super();
		
	}
	
	valueOf() {
		
		const v = this.textContent, fixed = v.trim().toLowerCase();
		
		switch (this.type) {
			case 'bool': return fixed === 'true' ? true : fixed === 'false' || fixed === '0' ? false : !!fixed;
			case 'int': return Number.parseInt(fixed);
			case 'float': return Number.parseFloat(fixed);
			default: return v;
		}
		
	}
	
	get key() { return this.getAttribute('key'); }
	set key(v) { this.setAttribute('key', v); }
	
	get type() { return this.getAttribute('type'); }
	set type(v) { this.setAttribute('type', v); }
	
}

customElements.define('enum-values', EnumValues),
customElements.define('enum-value', EnumValue),
customElements.define('super-clock', SuperClock);