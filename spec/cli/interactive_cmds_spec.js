import h from 'spec/spec_helper';
import { t, _ } from 'azk';
import { Command, UI as OriginalUI } from 'azk/cli/command';
import { InteractiveCmds } from 'azk/cli/interactive_cmds';

describe('Azk cli interactive cmds class', function() {
  var outputs = [];
  var UI = h.mockUI(beforeEach, outputs);

  class TestCmd extends InteractiveCmds {
    action(opts) {
      this.verbose_msg(1, 'nivel-1');
      this.verbose_msg(2, 'nivel-2');
      this.verbose_msg(3, () => {
        this.dir('nivel-3');
      });
      this.dir(opts);
    }

    verbose(data) {
      this.dir(data);
    }

    tKeyPath(...keys) {
      return ['test', 'commands', this.name, ...keys];
    }

    run(...args) {
      while(outputs.length > 0) { outputs.pop(); }
      return super(...args);
    }
  }

  describe('whith quiet option', function() {
    var cmd = new TestCmd('test_options', UI);

    it('should true', function () {
      cmd.run(['--quiet']);
      h.expect(outputs).to.eql([{ verbose: 0, __leftover: [], quiet: true}]);
    });
  });

  describe('whith verbose option', function() {
    var cmd = new TestCmd('test_options', UI);

    it("should run with verbose outputs", function() {
      cmd.run([]);
      h.expect(outputs).to.eql([{ verbose: 0, __leftover: [], quiet: false }]);
      cmd.run(['--verbose']);
      h.expect(outputs).to.eql(['nivel-1', { verbose: 1, __leftover: [], quiet: false }]);
      cmd.run(['--verbose', '-vv']);
      h.expect(outputs).to.eql([
        'nivel-1', 'nivel-2', 'nivel-3',
        { verbose: 3, __leftover: [], quiet: false },
      ]);
    });
  });
});