class SuperClock extends HTMLElement {
	
	static {
		
		this.PAD = 0,
		this.PADSTR = '0',
		this.SETDATA = 'clock-value',
		this.SPEED = 1,
		this.TACK = 'tack',
		this.TIMING = 67,
		this.VALUE = 't',
		
		this.dn = [ 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat' ],
		this.hn = [ 'AM', 'PM' ];
		
		//this.observedAttributesValue = [ 'since' ];
		
	}
	//static get observedAttributes() {
	//	
	//	return this.observedAttributesValue;
	//	
	//}
	
	static getDiff(v) {
		
		// 以下のようにビット演算子で値を整数に変換すると、値が符号付き 32 ビットの範囲(-2147483648 から 2147483647) を超えると
		// ビット演算子の仕様に基づき正負が反転する。（例: 2147483648|0) そのため parseInt を用いて変換するように改修。
		//return v ? v[0] === '+' ? v.slice(1)|0 : v[0] === '-' ? -v.slice(1)|0 : v : v;
		
		return	(v = v?.trim?.() ?? '') ?	v[0] === '+' ? parseInt(v.slice(1)) :
														v[0] === '-' ? -parseInt(v.slice(1)) : v :
														v;
		
	}
	
	static getValues(id, defaultValue = []) {
		
		return document.getElementById(id)?.valueOf?.() ?? defaultValue;
		
	}
	
	static tick() {
		
		const	{ from, last, names, origin, reached, speed, style, ticked, timing } = this,
				clocks = this.querySelectorAll('[data-clock]'), cl = clocks.length,
				current = Date.now(), lag = this.tack ? (current - this.tack) - timing : 0,
				updates = [];
		let i,l,i0,i1,k,v,v0,v1, clock;
		
		this.tack && (this.accumulation += lag),
		i = i0 = -1, this.now = new Date(origin + (current - from) * speed), updates.length = 0;
		//this.now = new Date(origin + ((current - this.accumulation) - from) * speed);
		while (++i < cl)	(clock = clocks[i]).closest('super-clock') === this &&
									names.indexOf(v = this.write(clock).name) === -1 && (names[++i0] = v);
		
		i0 = -1;
		for (k in last) {
			
			if (names.indexOf(k) === -1) {
				
				delete last[k];
				
			} else if ('v' in (v = last[k])) {
				
				style.setProperty('--clock-tack-' + k, v.v),
				
				delete v.v, v.i = v.i0, delete v.i0,
				
				i = -1, l = (v0 = v.updates).length, i1 = (v1 = ticked[v.as] ??= []).length;
				while (++i < l) updates[++i0] = v1[i1++] = v0[i];
				
				v0.length = 0;
				
			}
			
		}
		
		for (k in ticked)	(v = ticked[k])?.length ?
			(this.dispatchEvent(new CustomEvent('tick-' + k, { detail: [ ...v ] })), v.length = 0) : delete ticked[k];
		
		names.length = 0,
		
		updates.length && this.dispatchEvent(new CustomEvent('tick', { detail: updates })),
		
		reached.length && (this.dispatchEvent(new CustomEvent('tack', { detail: [ ...reached ] })), reached.length = 0),
		
		this.tack = Date.now(), this.clock = setTimeout(this.tick, timing);
		
	}
	
	static getDateValue(date, valueName, timeZone) {
		
		return date['get' + (timeZone ? 'UTC' : '') + valueName[0].toUpperCase() + valueName.slice(1)]();
		
	}
	static getStaticDateMod(source, timeZone) {
		
		source instanceof Date || (source = Array.isArray(source) ? new Date(...source) : new Date(source));
		
		const { getDateValue } = SuperClock, h = getDateValue(source, 'hours', timeZone);
		
		return	{
						
						source,
						
						y: getDateValue(source, 'fullYear', timeZone),
						m: getDateValue(source, 'month', timeZone),
						d: getDateValue(source, 'date', timeZone),
						h,
						mi: getDateValue(source, 'minutes', timeZone),
						s: getDateValue(source, 'seconds', timeZone),
						ms: getDateValue(source, 'milliseconds', timeZone),
						
						time: source.getTime()
						
					};
			
	}
	static getElapseMod(to = 0, from = new Date(), timeZone) {
		
		const { getElapseMod, getStaticDateMod } = SuperClock;
		
		if ((to = getStaticDateMod(to, timeZone)).time > (from = getStaticDateMod(from, timeZone)).time) {
			
			const elapsed = getElapseMod(from.source, to.source, timeZone);
			let k;
			
			k = elapsed.to, elapsed.to = elapsed.from, elapsed.from = k;
			
			for (k in elapsed) typeof elapsed[k] === 'number' && (elapsed[k] = -elapsed[k]);
			
			return elapsed;
			
		}
		
		const monthly = [];
		let i, daysCount, mo, isLeap, time,y,d,m,h,mi,s,ms, _y,_m,_d,_h,_mi,_s,_ms;
		
		i = m = -1, y = 0,
		daysCount = _d = parseInt(parseInt((time = from.time - to.time) / 1000) / 86400),
		mo = from.m + 1, isLeap = !((_y = from.y) % 4 || !(_y % 100) && _y % 400), ++to.m;
		while ((daysCount -= monthly[i] ?? 0) >= 0) {
			
			monthly[++i] = --mo === 1 ? isLeap ? 29 : 28 : mo === 3 || mo === 5 || mo === 8 || mo === 10 ? 30 : 31,
			
			mo ||= 12,
			
			++m === 12 && (++y, m = 0, isLeap = !(--_y % 4 || !(_y % 100) && _y % 400));
			
		}
		
		m = (y ||= null) === null && !m ? null : m,
		d = (monthly[i] += daysCount) ? monthly[i] : m === null ? null : 0,
		
		h = from.h < to.h ? (24 - to.h) + from.h : from.h - to.h,
		mi = from.mi < to.mi ? (60 - to.mi) + from.mi : from.mi - to.mi,
		s = from.s < to.s ? ((60 - to.s) + (from.s)) : from.s - to.s,
		ms = from.ms < to.ms ? ((1000 - to.ms) + from.ms) : from.ms - to.ms,
		
		from.s < to.s && (_mi = --mi) < 0 && (mi = 60 + mi),
		from.mi <= to.mi && from.s <= to.s && (mi || _mi !== undefined) && (_h = --h) < 0 && (h = 24 + h),
		
		d === null && !h && (h = null, mi || (mi = null, s || (s = null, ms || (ms = null)))),
		
		_m = (((_y = y) || 0) * 12 + m) || null,
		_h = (((_d ||= null) || 0) * 24 + h) || null,
		_mi = ((_h || 0) * 60 + mi) || null,
		_s = ((_mi || 0) * 60 + s) || null,
		_ms = ((_s || 0) * 1000 + ms) || null;
		
		return { y, m, d, h, mi, s, ms, '-y': _y, '-m': _m, '-d': _d, '-h': _h, '-mi': _mi, '-s': _s, '-ms': _ms, direction: 1 };
		
	}
	
	constructor() {
		
		super(),
		
		this.tick = SuperClock.tick.bind(this),
		
		this.last = {}, this.ticked = {}, this.names = [], this.reached = [];
		
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
		
		const	{ isNaN } = Number,
				{ dataset } = element,
				{ asHTML, invert, pad, padPseudo, padStr, pause, since, tackName, timeZone, value } = this,
				padRaw = 'clockPad' in dataset ? parseInt(dataset.clockPad) : NaN,
				sinceRaw = 'clockSince' in dataset ?
					SuperClock.prototype.getAttrTimeValue.call(element, 'data-clock-since', this.origin, 0) : NaN;
		
		return	{
						asHTML: !('clockForceText' in dataset) && ('clockAsHTML' in dataset || asHTML),
						invert: 'clockInvert' in dataset || invert,
						pad: isNaN(padRaw) ? pad : padRaw,
						padPseudo: 'clockPadPseudo' in dataset || !!('clockDisabledPadPseudo' in dataset) || padPseudo,
						padStr: 'clockPadStr' in dataset ? dataset.clockPadStr : padStr,
						pause: 'clockPause' in dataset ? dataset.clockPause : pause,
						since: isNaN(sinceRaw) ? since : sinceRaw,
						tack: 'clockTack' in dataset ? dataset.clockTack : tackName,
						timeZone: 'clockTimeZone' in dataset || timeZone,
						value: 'clock' in dataset ? dataset.clock : value,
						values: 'clockValues' in dataset ? SuperClock.getValues(dataset.clockValues) : undefined
					};
		
	}
	
	write(clock) {
		
		if (!(clock instanceof Element)) return;
		
		const	{ isNaN } = Number,
				{ getDateValue, getElapseMod } = SuperClock,
				{ last, now, reached: reachedClocks } = this,
				{ asHTML, invert, pad, padPseudo, padStr, pause, since, tack, timeZone, value, values } =
					this.fetchClockData(clock),
				accumulates = value[0] === '-',
				slicePosition = accumulates && value[1] === '-' ? 2 : 1,
				padAbs = Math.abs(pad),
				sinceValue = isNaN(since) ? 0 : typeof since === 'number' ? since : (since?.getTime?.() ?? 0),
				nowTime = now.getTime(),
				timeZoneMsecs = now.getTimezoneOffset() * 60000;
		let i,i0,v,v0, from, remained,value0,vk, across, paused;
		
		switch (value0 = accumulates ? value.slice(slicePosition) : value) {
			
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
			from = [ (i = (i = +(''+nowTime).slice(-3) + 1) > 999 ? 0 : i) ];
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
			value0 = 't', from = [ (i = nowTime) + 1 ];
			
		}
		
		(across = sinceValue < nowTime) ?
			clock.classList.contains('clock-reached') ||
				(clock.classList.add('clock-reached'), paused = pause) :
			clock.classList.remove('clock-reached'),
		
		v = accumulates ?
			(
				i =	(v0 = getElapseMod(sinceValue - timeZoneMsecs, nowTime - timeZoneMsecs, timeZone))[value.slice(1)] ??
							0 * v0.direction
			) :
			values?.[i] ?? this?.[vk ||= 'v' + value0[0].toUpperCase() + value0.slice(1)]?.[i] ?? i0 ?? i,
		
		isNaN(+v) || (invert && (v ? (v *= -1) : (v = Object.is(v, 0) ? -0 : 0)));
		
		const reached = across && pause !== null,
				lastValue = last[value] ??= {},
				event = {
						as: lastValue.as = value0,
						clock,
						name: value,
						reached,
						paused: reached && paused !== undefined,
						pausing: reached,
						reached: across && paused !== undefined,
						reaching: across
					},
				signed = typeof v === 'number' && (v ? v < 0 : Object.is(v, -0)),
				pv = '' + (signed ? v * -1 : v);
		
		if (pad && padPseudo && padStr) {
			
			const	l = pv.length, cnt = l < padAbs ? parseInt((padAbs - l) / padStr.length) + 1 : 0,
					padded = cnt && padStr.repeat(cnt);
			
			clock.dataset.clockPadAttr = cnt ? pad < 0 ? padded.slice(pad + l) : padded.slice(0, pad - l) : '', v = pv;
			
		} else v = pad ? pv['pad' + (pad < 0 ? 'End' : 'Start')](padAbs, padStr) : pv;
		
		signed && (v = '-' + v),
		
		event.reached && (reachedClocks[reachedClocks.length] = event);
		
		if (lastValue.i !== i) {
			
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
			
			lastValue.i0 ||= i,
			
			(reached && paused === undefined) || this.mute || clock.dataset.clockMute ||
				(clock[asHTML ? 'innerHTML' : 'textContent'] = paused ?? v),
			
			clock.hasAttribute('data-clock-disabled-setdata') ||
				(
					clock.hasAttribute('data-clock-value') && (clock.dataset.clockValue = v),
					this.hasAttribute('setdata') && clock.setAttribute('data-' + this.setdata, v)
				),
			
			event.tack = (new Date(...from).getTime() - nowTime) * this.speed,
			
			lastValue.v ||= event.tack + 'ms',
			
			tack && !clock.hasAttribute('data-clock-disabled-tack') &&
				(
					clock.style.setProperty('--clock-' + tack + '-time', lastValue.v),
					clock.classList.remove(tack), void clock.offsetWidth, clock.classList.add(tack)
				),
			
			(lastValue.updates ||= [])[lastValue.updates.length] = event;
			
		}
		
		return event;
		
	}
	
	getValues(key, defaultValue) {
		
		return SuperClock.getValues(this.getAttribute('v-' + key), defaultValue);
		
	}
	
	getAttrTimeValue(name, value = this.from ?? 0, defaultValue = value) {
		
		let attr, asDateString;
		
		attr = (asDateString = (attr = (attr = this.getAttribute(name))?.trim?.() ?? attr)?.[0] === '@') ?
			Number.isNaN(attr = Date.parse(attr.slice(1).trimStart())) ? (asDateString = false, defaultValue) : attr :
			(
				attr ?	attr[0] === '+' ? parseInt(attr.slice(1)) :
							attr[0] === '-' ? -parseInt(attr.slice(1)) : attr :
							attr
			),
		
		asDateString ||
			(
				attr =	typeof attr === 'number' ? value + attr :
								attr ? Number.isNaN(attr = parseInt(attr)) ? defaultValue : attr : defaultValue
			);
		
		return this.floor ? Math.floor(parseInt(attr / 1000) * 1000) : attr;
		
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
	
	get invert() { return this.hasAttribute('invert'); }
	set invert(v) { this.toggleAttribute('invert', !!v); }
	
	get mute() { return this.hasAttribute('mute'); }
	set mute(v) {
		v || typeof v === 'string' ? this.setAttribute('mute', v) : this.removeAttribute('mute');
	}
	
	get origin() {
		
		return this.getAttrTimeValue('origin');
		
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
	
	get pause() { return this.getAttribute('pause'); }
	set pause(v) { this.setAttribute('pause', v); }
	
	get setdata() { return this.getAttribute('setdata') || SuperClock.SETDATA; }
	set setdata(v) { this.setAttribute('setdata', v); }
	
	get since() {
		
		return this.getAttrTimeValue('since', this.origin, 0);
		
	}
	set since(v) { this.setAttribute('since', v); }
	
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
	
	get value() { return (this.getAttribute('value') || SuperClock.VALUE).trim().toLowerCase(); }
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