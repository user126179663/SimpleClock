class SuperClock extends HTMLElement {
	
	static getValues(id, defaultValue = []) {
		
		return document.getElementById(id)?.valueOf?.() ?? defaultValue;
		
	}
	
	static fetch(element, sc) {
		
		const	{ pad, padPseudo, padStr, value } = sc,
				{ dataset } = element,
				padRaw = 'clockPad' in element.dataset ? +element.dataset.clockPad|0 : NaN;
		
		return	{
						pad: Number.isNaN(padRaw) ? pad : padRaw,
						padPseudo: 'clockPadPseudo' in dataset || !!('clockDisabledPadPseudo' in dataset) || padPseudo,
						padStr: 'clockPadStr' in dataset ? dataset.clockPadStr : padStr,
						value: 'clock' in dataset ? dataset.clock : value,
						values: 'clockValues' in dataset ? SuperClock.getValues(dataset.clockValues) : []
					};
		
	}
	
	static tick() {
		
		const	{ from, last, origin, speed, style, timing } = this,
				clocks = this.querySelectorAll('[data-clock]'), l = clocks.length,
				current = Date.now(), lag = this.tack ? (current - this.tack) - timing : 0;
		let i,k;
		
		this.tack && (this.accumulation += lag),
		i = -1, this.now = new Date(origin + (current - from) * speed), last.updated.length = 0;
		//this.now = new Date(origin + ((current - this.accumulation) - from) * speed);
		while (++i < l) this.write(clocks[i]);
		
		if (last.updated.length) {
			
			for (k in last) style.setProperty('--clock-tack-' + k, last[k].v);
			
			this.dispatchEvent(new CustomEvent('tick', { detail: [ ...last.updated ] }));
			
		}
		
		this.tack = Date.now(), this.clock = setTimeout(this.tick, timing);
		
	};
	
	static {
		
		this.PAD = 0,
		this.PADSTR = '0',
		this.SETDATA = 'clockValue',
		this.SPEED = 1,
		this.TIMING = 67,
		this.VALUE = 't',
		
		this.dn = [ 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat' ],
		this.hn = [ 'AM', 'PM' ];
		
	}
	
	constructor() {
		
		super(),
		
		this.tick = SuperClock.tick.bind(this),
		
		this.last = { updated: [] };
		
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
	
	write(clock) {
		
		if (!(clock instanceof HTMLElement)) return;
		
		const	{ now } = this,
				{ pad, padPseudo, padStr, value, values } = SuperClock.fetch(clock, this),
				padAbs = Math.abs(pad);
		let i,i0,v,v0, from, remained,value0,vk, updated;
		
		switch (value0 = value?.toLowerCase?.()) {
			
			case 'y':
			from = [ (i = now.getFullYear()) + 1,0,1, 0,0,0,0 ];
			break;
			
			case 'm':
			const m = now.getMonth(), nm = m === 11 ? 0 : m + 1;
			from = [ now.getFullYear() + !nm,nm,1,0,0,0,0 ], i0 = (i = nm ? m : 0) + 1;
			break;
			
			case 'd':
			from = [ new Date(now.getFullYear(),now.getMonth(),i = now.getDate(), 0,0,0,0).getTime() + 86400000 ];
			break;
			
			case 'h':
			from =
				[ new Date(now.getFullYear(),now.getMonth(),now.getDate(), i = now.getHours(),0,0,0).getTime() + 3600000 ];
			break;
			case 'h12':
			(i = now.getHours()) > 11 && (i -= 12),
			from = [ new Date(now.getFullYear(),now.getMonth(),now.getDate(), now.getHours(),0,0,0).getTime() + 3600000 ];
			break;
			
			case 'mi':
			from = [
				new Date(
					now.getFullYear(),now.getMonth(),now.getDate(),
					now.getHours(),i = now.getMinutes(),0,0
				).getTime() + 60000
			];
			break;
			
			case 's':
			from = [
				new Date(
					now.getFullYear(),now.getMonth(),now.getDate(),
					now.getHours(),now.getMinutes(),i = now.getSeconds(),0
				).getTime() + 1000
			];
			break;
			
			case 'ms':
			from = [ (i = now.getTime()) + 1 ];
			break;
			
			case 'dn':
			i = now.getDay(), vk = 'vDN',
			from = [ new Date(now.getFullYear(),now.getMonth(),now.getDate(), 0,0,0,0).getTime() + 86400000 ];
			break;
			
			case 'hn':
			i = (v0 = now.getHours()) / 12|0, vk = 'vHN',
			from = [
				new Date(
					now.getFullYear(),now.getMonth(),now.getDate(),
					now.getHours(),0,0,0
				).getTime() +
				43200000 - (v0 - (12 * i)) * 3600000
			];
			break;
			
			default:
			value0 = 't', from = [ (i = now.getTime()) + 1 ];
			
		}
		
		v = values[i] ?? this[vk ||= 'v' + value0[0].toUpperCase() + value0.slice(1)][i] ?? i0 ?? i;
		
		if (pad && padPseudo && padStr) {
			
			const l = (''+v).length, cnt = l < padAbs ? ((padAbs - l) / padStr.length |0) + 1 : 0,
					padded = cnt && padStr.repeat(cnt);
			
			clock.dataset.clockPadAttr = cnt ? pad < 0 ? padded.slice(pad + l) : padded.slice(0, pad - l) : '';
			
		} else pad && (v = (''+v)['pad' + (pad < 0 ? 'End' : 'Start')](padAbs, padStr));
		
		const last = this.last[value0] ??= {};
		
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
		last.i === i || (
			
			clock.style.setProperty(
					'--clock-tack-time',
					last.v = (v0 = (new Date(...from).getTime() - now.getTime()) * this.speed) / 1000 + 's'
				),
			
			this.last.updated[this.last.updated.length] = updated = { name: value0, clock, tack: v0 },
			
			clock.hasAttribute('data-clock-disabled-setdata') || (
				clock.hasAttribute('data-clock-value') && (clock.dataset.clockValue = v),
				this.hasAttribute('setdata') && clock.setAttribute('data-' + this.setdata, v)
			),
			
			last.i = i,
			clock.classList.remove('tick'), void clock.offsetWidth, clock.classList.add('tick'),
			
			this.mute || clock.dataset.clockMute || (clock.textContent = v),
			
			this.dispatchEvent(new CustomEvent('tick-' + value0, { detail: updated }))
			
		);
		
	}
	
	getDiff() {
		
		const origin = this.getAttribute('origin')?.trim?.() ?? '';
		
		return origin ? origin[0] === '+' ? origin.slice(1)|0 : origin[0] === '-' ? -origin.slice(1)|0 : origin : origin;
		
	}
	
	getValues(key, defaultValue) {
		
		return SuperClock.getValues(this.getAttribute('v-' + key), defaultValue);
		
	}
	
	get auto() { return this.hasAttribute('auto'); }
	set auto(v) {
		
		!!v ? this.clock || (this.start(), this.setAttribute('auto', '')) : this.removeAttribute('auto');
		
	}
	
	get origin() {
		
		const	{ from = 0 } = this, diff = this.getDiff(),
				origin = typeof diff === 'number' ? from + diff : diff ? new Date(diff|0)?.getTime?.() : from;
		
		return this.floor ? (origin / 1000|0) * 1000 : origin;
		
	}
	set origin(v) { this.setAttribute('origin', v); }
	
	get timing() {
		
		const v = Math.abs(+this.getAttribute('timing')|0);
		
		return Number.isNaN(v) || !v ? SuperClock.TIMING : v;
		
	}
	set timing(v) { this.setAttribute('timing', v); }
	
	get pad() {
		
		const v = +this.getAttribute('pad')|0;
		
		return Number.isNaN(v) ? SuperClock.PAD : v;
		
	}
	set pad(v) { this.setAttribute('pad', v); }
	
	get padStr() { return this.hasAttribute('pad-str') ? this.getAttribute('pad-str') : SuperClock.PADSTR; }
	set padStr(v) { this.setAttribute('pad-str', v); }
	
	get padPseudo() { return this.hasAttribute('pad-pseudo'); }
	set padPseudo(v) { this.setAttribute('pad-pseudo', v); }
	
	get floor() { return this.hasAttribute('floor'); }
	set floor(v) { this.setAttribute('floor', v); }
	
	get mute() { return this.hasAttribute('mute'); }
	set mute(v) { this.setAttribute('mute', v); }
	
	get speed() {
		const v = this.getAttribute('speed') || SuperClock.SPEED, v0 = +v;
		return Number.isNaN(v0) ? SuperClock.SPEED : v0;
	}
	set speed(v) { this.setAttribute('speed', v); }
	
	get value() { return this.getAttribute('value') || SuperClock.VALUE; }
	set value(v) { this.setAttribute('value', v); }
	
	get setdata() { return this.getAttribute('setdata') || SuperClock.SETDATA; }
	set setdata(v) { this.setAttribute('setdata', v); }
	
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
	
}
class EnumValue extends HTMLElement {
	
	constructor() {
		
		super();
		
	}
	
	valueOf() {
		
		const v = this.textContent, fixed = v.trim().toLowerCase();
		
		switch (this.type) {
			case 'bool': return fixed === 'true' ? true : fixed === 'false' || fixed === '0' ? false : !!fixed;
			case 'int': return parseInt(fixed);
			case 'float': return parseFloat(fixed);
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