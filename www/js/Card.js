riot.tag('card', '<div class="day, delay" if="{ day.delay != \'\' }"> { day.delay } </div> <div class="day"> <h3>{ day.date }</h3> <line each="{ chapter, k in day.chapters }" chapter="{ chapter }" k="{ k }" ></line> </div>', function(opts) {
  this.day = opts.day;
  this.j = opts.j;
})