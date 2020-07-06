define("scripts/timeline.js", function(exports, require, module) {
  "use strict";

  /**
   * a easy timeline manager
   * @version 1.0
   * @author dron
   */

  var timerCache = {};

  // var timer = timeline;
  // <or>
  // var timer = timeline.use( name ).init( 10 ); // to use a new timeline instance
  // 
  // var t = timer.createTask(...);
  // t.stop();
  // 
  // timer.getFPS();

  function ClassTimer() {
    this.tasks = [];
    this.addingTasks = [];
    this.adding = 0;
  }

  /**
   * initialize timeline
   */
  ClassTimer.prototype.init = function(ms) {
    var me = this;

    if (me.inited) {
      return;
    }

    me.inited = 1;

    me.startTime = now();
    me.intervalTime = ms || 5;
    me.count = 0;

    me.intervalFn = function() {
      me.count++;
      me.update(now());
    };

    me.start();

    return me;
  };


  /**
   * create a task
   * @param  {Object} conf 		the config
   * @return {Task} 			a task instance
   */
  ClassTimer.prototype.createTask = function(conf) {
    /* e.g. timer.createTask({
    	start: 500, duration: 2000, data: [a, b, c,..], object: module, 
    	onTimeUpdate: fn(time, a, b, c,..), onTimeStart: fn(a, b, c,..), onTimeEnd: fn(a, b, c,..),
    	recycle: []
    }); */
    var task = createTask(conf);
    this.addingTasks.unshift(task);
    this.adding = 1;

    if (conf.recycle)
      this.taskList(conf.recycle, task);

    this.start();

    return task;
  };

  /**
   * use an array to recycle the task
   * @param  {Array} queue		be used for recycling task
   * @param  {Task} task 		a task instance
   * @return {Array}			this queue
   */
  ClassTimer.prototype.taskList = function(queue, task) {
    if (!queue.clear)
      queue.clear = function() {
        var i = this.length;
        while (i--) {
          task = this[i];
          task.stop();
          this.splice(i, 1);
        }
        return this;
      };

    if (task)
      queue.unshift(task);

    return queue;
  };

  /**
   * get the current fps
   * @return {Number} fps number
   */
  ClassTimer.prototype.getFPS = function() {
    var t = now(),
      c = this.count,
      fps = c / (t - this.startTime) * 1e3;
    if (c > 1e3)
      this.count = 0,
      this.startTime = t;
    return fps;
  };

  // privates

  ClassTimer.prototype.start = function() {
    clearInterval(this.interval);
    this.interval = setInterval(this.intervalFn, this.intervalTime);
  };

  ClassTimer.prototype.stop = function() {
    clearInterval(this.interval);
  };

  ClassTimer.prototype.update = function(time) {
    var tasks = this.tasks,
      addingTasks = this.addingTasks,
      adding = this.adding;
    var i = tasks.length,
      t, task, start, duration, data;

    while (i--) {
      task = tasks[i];
      start = task.start;
      duration = task.duration;

      if (time >= start) {

        if (task.stopped) {
          tasks.splice(i, 1);
          continue;
        }

        checkStartTask(task);
        if ((t = time - start) < duration)
          updateTask(task, t);
        else
          updateTask(task, duration),
          task.onTimeEnd.apply(task.object, task.data.slice(1)),
          tasks.splice(i, 1);
      }
    }

    if (adding)
      tasks.unshift.apply(tasks, addingTasks),
      addingTasks.length = adding = 0;

    if (!tasks.length)
      this.stop();
  };

  function use(name) {
    var module;

    if (module = timerCache[name])
      return module;
    else
      module = timerCache[name] = new ClassTimer;

    return module;
  };

  /**
   * @functions
   */

  var now = function() {
    return new Date().getTime();
  };

  var createTask = function(conf) {
    var object = conf.object || {};
    conf.start = conf.start || 0;
    return {
      start: conf.start + now(),
      duration: conf.duration == -1 ? 86400000 : conf.duration,
      data: conf.data ? [0].concat(conf.data) : [0],
      started: 0,
      object: object,
      onTimeStart: conf.onTimeStart || object.onTimeStart || function() {},
      onTimeUpdate: conf.onTimeUpdate || object.onTimeUpdate || function() {},
      onTimeEnd: conf.onTimeEnd || object.onTimeEnd || function() {},
      stop: function() {
        this.stopped = 1;
      }
    }
  };

  var updateTask = function(task, time) {
    var data = task.data;
    data[0] = time;
    task.onTimeUpdate.apply(task.object, data);
  };

  var checkStartTask = function(task) {
    if (!task.started)
      task.started = 1,
      task.onTimeStart.apply(task.object, task.data.slice(1)),
      updateTask(task, 0);
  };

  module.exports = use("default").init(10);
  module.exports.use = use;

});
