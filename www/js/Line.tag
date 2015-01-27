<line>
  <div class={ chapter: true, current: isCurrent } onclick={ setCurrent }>
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

  this.isCurrent = false;
  this.chapter = opts.chapter;
  this.j = this.parent.parent.j;
  this.k = this.parent.k;
  this.litterature = $(this.parent.parent.parent.root);
  this.player = this.parent.parent.parent.parent;
  this.playlistId = undefined;

  setCurrent(e) {
    var screen = document.body.offsetHeight;

    var top = e.currentTarget.offsetTop;
    var height = e.currentTarget.offsetHeight;

    var newTop = Math.max(0, top - (height / 2) - (screen * 0.3));

    this.isCurrent = true;

    this.player.setCurrent(this, this.j, this.k);

    this.litterature.animate({
      scrollTop: newTop
    }, 'slow');
  }

  unsetCurrent(e) {
    this.isCurrent = false;
    this.update();
  }

  isTwitter() {
    return (this.chapter.type == "twitter");
  }

  isYoutube() {
    return (this.chapter.type == "youtube");
  }
</line>
