	var passiveEvent = false;
try {
    var opts = Object.defineProperty({}, 'passive', {
        get: function () {
            passiveEvent = true;
        }
    });
    window.addEventListener("test", null, opts);
} catch (e) { throw "jblihb";}

passiveEvent = passiveEvent ? { capture: true, passive: true } : true;

//////////////////////////////////////////////////////////////////////////


class Card {
	constructor(elt, opacity=0.1 /*En pourcentage*/, cornerRadius=16/*en pixels*/,_progressive=false /*Boolean that says if the blur effect is progressive or not*/, _progressiveXOffset=0, _progressiveYOffset=0)
	{
		this.card = elt;
		this.progressive = _progressive;
		this.opacity = opacity;
		this.cornerRadius = cornerRadius;
		this.active = false;
		this.currentX = 0;
		this.currentY = 0;
		this.initialX = 0;
		this.initialY = 0;
		this.xOffset = 0;
		this.yOffset = 0;
		this.progressiveXOffset = _progressiveXOffset;
		this.progressiveYOffset = _progressiveYOffset;
		this.init();
	}
	init()
	{
		document.getElementById(this.card).addEventListener("mousedown", this.start.bind(this), false);
		document.getElementById(this.card).addEventListener("mouseup", this.stop.bind(this), false);
		document.getElementById(this.card).addEventListener("mousemove", this.move.bind(this), false);

		document.getElementById(this.card).addEventListener("touchstart", this.start.bind(this), passiveEvent);
		document.getElementById(this.card).addEventListener("touchend", this.stop.bind(this), passiveEvent);
		document.getElementById(this.card).addEventListener("touchmove", this.move.bind(this), passiveEvent);

		document.getElementById(this.card).style.position = "absolute";
		document.getElementById(this.card).style.float = "left";
		document.getElementById(this.card).style.zIndex = 1;
		document.getElementById(this.card).style.backgroundColor = `rgba(255,255,255,${this.opacity/100})`;
		document.getElementById(this.card).style.borderRadius = `${this.cornerRadius}px`;
		document.getElementById(this.card).style.backdropFilter = `blur(3px)`;
		document.getElementById(this.card).style.boxShadow = `0px 4px 30px 0px rgba(0,0,0,0.3)`;
		document.getElementById(this.card).style.border = `1px solid rgba(255,255,255,0.1)`;

	}
	start(e) {
		if(e.type == "touchstart"){
			this.initialX = e.touches[0].clientX - this.xOffset;
			this.initialY = e.touches[0].clientY - this.yOffset;
		} else {
			this.initialX = e.clientX - this.xOffset;
			this.initialY = e.clientY - this.yOffset;}
		if (e.target === document.getElementById(this.card)) this.active = true;
	}
	move(e) {
		if (this.active) {
			if (e.type == "touchmove") {
				this.currentX = e.touches[0].clientX - this.initialX;
				this.currentY = e.touches[0].clientY - this.initialY;
			} else {
				e.preventDefault();
				this.currentX = e.clientX - this.initialX;
				this.currentY = e.clientY - this.initialY;
			}
			this.xOffset = this.currentX;
			this.yOffset = this.currentY;
			this.translate(this.currentX, this.currentY, document.getElementById(this.card));
		}
	}
	translate(_posx, _posy, elt) {
		elt.style.transform = `translate3d(${_posx}px, ${_posy}px, 0)`;
		if(this.progressive) {elt.style.backdropFilter = `blur(${Math.abs(((this.currentX+this.progressiveXOffset)+(this.currentY+this.progressiveYOffset)*4)/50)}px)`;}
	}	
	stop() {
		this.initialX = this.currentX;
		this.initialY = this.currentY;
		this.active = false;
	}
}
