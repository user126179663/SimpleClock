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
		
		const { from, origin, speed } = this, clocks = this.querySelectorAll('[data-clock]'), l = clocks.length;
		let i;
		
		i = -1, this.now = new Date(origin + (Date.now() - from) * speed);
		while (++i < l) this.write(clocks[i]);
		
	};
	
	static {
		
		this.dn = [ 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat' ],
		this.hn = [ 'AM', 'PM' ];
		
	}
	
	constructor() {
		
		super(),
		
		this.tick = SuperClock.tick.bind(this);
		
		this.last = {};
		
	}
	connectedCallback() {
		
		this.set();
		
	}
	
	set() {
		
		this.from ??= Date.now(),
		
		this.tick(), this.clock ||= setInterval(this.tick, this.timing);
		
	}
	stop() {
		
		clearInterval(this.clock),
		this.clock = null;
		
	}
	
	write(clock) {
		
		if (!(clock instanceof HTMLElement)) return;
		
		const	{ now } = this,
				{ pad, padPseudo, padStr, value, values } = SuperClock.fetch(clock, this),
				padAbs = Math.abs(pad);
		let i,i0,v,v0, from, remained,value0,vk;
		
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
			from = [ (i = now.getTime()) + 1 ];
			
		}
		
		v = values[i] ?? this[vk ||= 'v' + value0[0].toUpperCase() + value0.slice(1)][i] ?? i0 ?? i;
		
		if (pad && padPseudo && padStr) {
			
			const l = (''+v).length, cnt = l < padAbs ? ((padAbs - l) / padStr.length |0) + 1 : 0,
					padded = cnt && padStr.repeat(cnt);
			
			clock.dataset.clockPadAttr = cnt ? pad < 0 ? padded.slice(pad + l) : padded.slice(0, pad - l) : '';
			
		} else pad && (v = (''+v)['pad' + (pad < 0 ? 'End' : 'Start')](padAbs, padStr));
		
		// timing を対象の値に近い値（例えば data-clock="s" を指定した要素を含む時に、timing="1000" にするなど）にすると、
		// 処理時間などによって生じる誤差を丸め切れずに、時間の変更間隔が不正確になる場合がある。
		// 例えば timing="1000" で、1000,2000,3001,4002,... と、経過時間+処理時間で 1 ミリ秒ずつ増えるなど。
		// 実際のところ、対応不能かどうか判断しきれないところがあるが、現状は timing の値を 100 ミリ秒以下にすることでこの問題を回避できる。
		this.last[value0] === i || (
			
			clock.style.setProperty(
					'--clock-tack-time',
					(v0 = (new Date(...from).getTime() - now.getTime()) / this.speed) / 1000 + 's'
				),
			
			this.last[value0] = i, resetCSSAnime(clock, 'tick'),
			
			clock.textContent = v,
			
			this.dispatchEvent(new CustomEvent('tick-' + value0, { detail: { clock, tack: v0 } }))
			
		);
		
	}
	
	getDiff() {
		
		const origin = this.getAttribute('origin')?.trim?.() ?? '';
		
		return origin ? origin[0] === '+' ? origin.slice(1)|0 : origin[0] === '-' ? -origin.slice(1)|0 : origin : origin;
		
	}
	
	getValues(key, defaultValue) {
		
		return SuperClock.getValues(this.getAttribute('v-' + key), defaultValue);
		
	}
	
	get origin() {
		
		const	{ from = 0 } = this, diff = this.getDiff(),
				origin = typeof diff === 'number' ? from + diff : diff ? new Date(diff|0)?.getTime?.() : from;
		
		return this.floor ? (origin / 1000|0) * 1000 : origin;
		
	}
	set origin(v) { this.setAttribute('origin', v); }
	
	get timing() {
		
		const v = Math.abs(+this.getAttribute('timing')|0);
		
		return Number.isNaN(v) ? 1000 : v;
		
	}
	set timing(v) { this.setAttribute('timing', v); }
	
	get pad() {
		
		const v = +this.getAttribute('pad')|0;
		
		return Number.isNaN(v) ? 0 : v;
		
	}
	set pad(v) { this.setAttribute('pad', v); }
	
	get padStr() { return this.getAttribute('pad-str') ?? ''; }
	set padStr(v) { this.setAttribute('pad-str', v); }
	
	get padPseudo() { return this.hasAttribute('pad-pseudo'); }
	set padPseudo(v) { this.setAttribute('pad-pseudo', v); }
	
	get floor() { return this.hasAttribute('floor'); }
	set floor(v) { this.setAttribute('floor', v); }
	
	get speed() {
		const v = +this.getAttribute('speed') ?? 1;
		return Number.isNaN(v) ? 1 : v;
	}
	set speed(v) { this.setAttribute('speed', v); }
	
	get value() { return this.getAttribute('value'); }
	set value(v) { this.setAttribute('value', v); }
	
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
	
}

class EnumValues extends HTMLElement {
	
	constructor() {
		
		super();
		
	}
	
	valueOf() {
		
		const enumerated = this.querySelectorAll(':scope > enum-value'), l = enumerated.length, values = [];
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