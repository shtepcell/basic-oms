block('inline-form')(
	content()(
		{
			elem: 'controls',
			content: [
				{
					block: 'button',
					text: 'Сохранить',
					mods: {
						theme: 'islands',
						size: 'm',
						type: 'submit'
					},
					mix: {
						block: 'inline-form',
						elem: 'save-btn'
					}
				}
			]
		}
	),
	tag()('form'),
	js()(true)
);

block('inline-form').elem('controls').wrap()(function() {
	var _content = this.ctx.content;

	return {
		block: 'control-group',
		content: _content
	}
});