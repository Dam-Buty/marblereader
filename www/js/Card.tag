<card>
  <div class="day, delay" if={ day.delay != '' }>
    { day.delay }
  </div>

  <div class="day">
    <h3>{ day.date }</h3>
    <line each={ chapter, k in day.chapters } chapter={ chapter } idx={ k } />
  </div>

  this.day = opts.day;
  this.j = opts.idx;
</card>
