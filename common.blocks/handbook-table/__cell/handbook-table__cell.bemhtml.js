block('handbook-table').elem('cell')(
    tag()('td'),
    attrs()(function() {
        if (this.ctx.colspan) {
            return { colspan: this.ctx.colspan};
        }
    })
);