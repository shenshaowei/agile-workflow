// Generated by LiveScript 1.2.0
(function(){
  var h;
  h = require('./test-helpers');
  describe('持久化测试', function(){
    beforeEach(function(done){
      h.extendShould();
      h.createEngine(done);
    });
    return describe("多个工作流中断后重新读取正常恢复执行", function(done){
      return can("同时执行工作流: 'A + B = C （同时开始AB）'和'苹果买卖'正常\n", function(done){
        return h.loadWorkflow('a-plus-b-two-start-active-steps', function(plus){
          h.loadWorkflow('apple-split-steps', function(apple){
            var appleId, plusId;
            plus.activeStepsShouldBe(['Get A', 'Get B']);
            apple.activeStepsShouldBe(['Start Trade']);
            plus.humanDo('Get A', {
              a: 2
            });
            plus.activeStepsShouldBe(['Get B', 'Judge']);
            apple.humanDo('Start Trade', {
              apple: 10
            });
            apple.activeStepsShouldBe(['Sale Apple']);
            apple.actingStepsShouldBe([]);
            appleId = apple.id;
            plusId = plus.id;
            h.destoryCurrentEngine(function(){
              h.recreateEngineAndResumeWorkflows([appleId, plusId], function(workflows){
                var plus, apple;
                debug("------ resumed workflow: " + workflows);
                plus = workflows[plusId];
                apple = workflows[appleId];
                plus.humanDo('Get B', {
                  b: 3
                });
                plus.activeStepsShouldBe(['Judge']);
                apple.apple.humanDo('Sale Apple', {
                  apple: 0,
                  money: 0
                });
                apple.activeStepsShouldBe(['End Trade']);
                apple.actingStepsShouldBe([]);
                plus.humanDo('Judge', {
                  c: 5
                });
                plus.activeAndActingStepsShouldBe([]);
                apple.humanDo('End Trade');
                apple.activeAndActingStepsShouldBe([]);
                done();
              });
            });
          });
        });
      });
    });
  });
}).call(this);