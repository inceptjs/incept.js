import { Pluggable } from '@inceptjs/framework';

import TerminalPlugin from '../terminal';

export default function(ctx: Pluggable) {
  ctx.plugin('terminal', new TerminalPlugin(ctx))
}