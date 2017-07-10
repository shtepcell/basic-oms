block('b-modal-dynamic-popup').replace()(function() {
	return {
		block: 'modal',
		js: true,
		mods: {
			theme: 'islands',
			closable: this.ctx.closable
		},
		mix: [
			{ 
				block: 'b-modal-dynamic-popup',
				mods: this.ctx.mods
			}
		],
		content: 'lalala1lalalal'
	};
});

block('modal').elem('content').mix()({
	block: 'b-modal-dynamic-popup',
	elem: 'content'
});