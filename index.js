const { join } = require('path');
const minimatch = require('minimatch');

/**
 * Register the `require` hook that processes files as workers.
 *
 * @param globMatch - A glob pattern to match files against
 * @param transform - A function to transform the source through
 */
exports.register = (globMatch, transform = x => x) => {
  const handleJS = require.extensions['.js'];

  require.extensions['.js'] = function(module, name) {
    const path = name.slice(process.cwd().length + 1);

    // If this is not a valid worker script, treat as JS.
    if (!minimatch(path, globMatch)) {
      return handleJS.apply(this, arguments);
    }

    module._compile(`
      class FakeWorker {
        constructor() {
          const self = this.self = {
            postMessage: msg => process.nextTick(() => {
              this.onmessage && this.onmessage({
                data: JSON.stringify(msg)
              });
            }),
          };

          ${transform(name)}
        }

        postMessage(msg) {
          process.nextTick(() => {
            if (this.self.onmessage) {
              this.self.onmessage({ data: JSON.stringify(msg) });
            }
          });
        }

        terminate() {
          /* Do nothing */
        }
      }

      module.exports = FakeWorker;
    `, name);
  };
};
