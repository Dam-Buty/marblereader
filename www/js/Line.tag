<line>
  <div class="chapter" onclick={ setCurrent }>
  // ng-click="current.set(current.season, $parent.$index, $index)"
    <span class="time"><u>{ chapter.time }</u> : </span>
    <span if={ chapter.type == 'youtube' }>
      <i class="fa fa-youtube-square marron"></i>
      &nbsp;{ chapter.title }
    </span>

    <span if={ chapter.type=='twitter' }>
      <i class="fa fa-twitter-square marron"></i>
      &nbsp;{ chapter.content }
    </span>

    <span if={ chapter.type=='youtube' } class="author">&nbsp;--&nbsp;{ chapter.account }</span>
  </div>

  this.chapter = opts.chapter

  this.idx = opts.idx

  setCurrent() {
    console.log(this)
  }
</line>
