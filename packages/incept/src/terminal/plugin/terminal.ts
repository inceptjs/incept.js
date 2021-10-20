import Pluggable from '@inceptjs/framework/dist/presets/Pluggable';

import TerminalPlugin from '..';

export default function(ctx: Pluggable) {
  ctx.plugin('terminal', new TerminalPlugin(ctx))
}