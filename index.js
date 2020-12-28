var game = class {
    constructor(wrapper) {
        this.wrapper = $(wrapper);
        var g = this;
        this.scene = {
            background: class {
                init() {
                    this.c = "game-background full";
                    this.e = g.d(this.c, g.wrapper);
                    this.changecolor("yellow", true);
                    return this;
                }

                changecolor(c, noanim) {
                    var colors = {
                        yellow: "#FCBB51",
                        orange: "#F07D4C",
                        purple: "#794AB2",
                        white: "#fff"
                    };
                    var newcolor = colors.hasOwnProperty(c.toLowerCase()) ? colors[c.toLowerCase()] : colors["yellow"];
                    if (noanim) anime.set(this.e[0], { backgroundColor: newcolor });
                    else anime({
                        targets: this.e[0],
                        backgroundColor: newcolor,
                        duration: 1000,
                        easing: "easeInOutQuart"
                    });
                }

                overflow() {
                    this.changecolor("white", true);
                    this.changecolor("orange");
                }
            },
            menu: class {
                init() {
                    this.w = g.d("game-menu full", g.wrapper);
                    this.sidestage = g.d("menu-sidestage", this.w);
                    this.mainstage = g.d("menu-stage", this.w).hide();
                    g.d("menu-stage-image", this.mainstage);
                    this.mainstageshadow = g.d("menu-stage-shadow", this.mainstage);
                    g.d("menu-stage-mask", this.mainstage);
                    this.urlform = g.n("form", "", this.w).on("submit", (e) => {
                        e.preventDefault();

                        var url = this.urlinput.val().trim();
                        var id = url.replace(/(http|https):\/\//, "").split("/")[3];
                        if (!id) return;
                        g.loading(true, "Gathering data...<br/>This could take a while.<br/><br/>(a LONG while, sometimes)");
                        this.urlinput.hide();
                        this.urlinstructions.hide();
                        var retrieveerror = () => {
                            this.urlinput.show();
                            this.urlinstructions.show();
                            Swal.fire({
                                icon: "error",
                                title: "Error",
                                html: "<p>An unexpected error occurred when attempting to retrieve the gallery.</p>".concat(
                                    "<p>Please check the gallery link and try again.</p>"
                                )
                            });
                        }
                        $.getJSON("https://fishery.jackboxgames.com/artifact/JackboxTalksGame/".concat(id, "/"), (data) => {
                            g.loading(false);
                            if (data.success == false || data.error) return retrieveerror();
                            g.initArtifact(data);
                        }).catch(() => retrieveerror());

                        return false;
                    });
                    this.urlinput = g.n("input", "menu-artifact-input", this.urlform).attr({
                        type: "text",
                        placeholder: "https://games.jackbox.tv/artifact/JackboxTalksGame/...",
                        maxlength: 100,
                        autocomplete: "off",
                        autocorrect: "off",
                        autocapitalize: "off",
                        spellcheck: "false"
                    });
                    this.urlinstructions = g.d("menu-title", this.w).html("Paste a Talking Points gallery URL below");
                    anime.set(this.mainstage[0], {
                        scale: 2.2,
                        top: 0,
                        right: -400,
                        rotate: 4
                    });
                    anime({
                        targets: this.sidestage[0],
                        right: -500,
                        direction: "reverse",
                        easing: "easeInQuart",
                        duration: 1000
                    });
                    anime({
                        targets: this.sidestage[0],
                        translateX: 20,
                        loop: true,
                        easing: "easeInOutSine",
                        duration: 5000,
                        direction: "alternate"
                    });
                    anime({
                        targets: this.urlinput[0],
                        left: 0,
                        translateX: ["-50%", "-100%"],
                        direction: "reverse",
                        easing: "easeInQuart",
                        duration: 1000
                    });
                    anime({
                        targets: this.urlinstructions[0],
                        left: 0,
                        translateX: "-100%",
                        direction: "reverse",
                        easing: "easeInQuart",
                        duration: 1000,
                        endDelay: 200
                    });

                    /* $.getJSON("/artifact.json", (data) => {
                        this.urlinput.hide();
                        this.urlinstructions.hide();
                        g.initArtifact(data);
                    }); */
                }

                sidestageexit() {
                    anime({
                        targets: this.sidestage[0],
                        right: -200,
                        easing: "easeInOutExpo",
                        duration: 200
                    });
                    setTimeout(() => {
                        //g.elements.background.changecolor("purple");
                        anime.remove(this.sidestage.hide()[0]);
                        anime({
                            targets: this.mainstage.show()[0],
                            scale: 0.7,
                            top: 200,
                            right: 100,
                            rotate: 0,
                            easing: "easeOutQuint",
                            duration: 1000
                        });
                    }, 150);
                }
            },
            playerutil: class {
                init(players) {
                    this.players = players.map((p) => {
                        var avatars = ["Wooden Mannequin", "Deer in Turtleneck", "Ancient Statue", "Astronaut", "Lobster in Bowtie", "Inflatable Dancing Man", "Robot in Suit", "Sock Puppet", "Skeleton", "Balloon Animal Dog", "Suit of Armor", "Clown Figurine", "Dog in Pink Scarf"];
                        var avindex = avatars.indexOf(p.avatar);
                        var f = {
                            name: p.name.toUpperCase(),
                            color: "#".concat(p.color),
                            avatar: "images/avatars/".concat(avindex, ".png"),
                            hand: "images/hands/".concat(avindex, ".png"),
                            awards: p.awardsReceivedThisGame
                        };
                        return Object.assign(p, f);
                    });

                    this.audienceplayer = {
                        name: "AUDIENCE",
                        hand: "images/hands/audience.png"
                    };
                }

                getPlayer(name) {
                    return name == "Null" ? this.audienceplayer : this.players.find((p) => p.name.toUpperCase() == name.toUpperCase());
                }
            },
            slideshow: class {
                init(data) {
                    this.musicinfo = [
                        [
                            [1], [2], [3, 4]
                        ],
                        [
                            [1], [2, 3], [4, 5]
                        ],
                        [
                            [1], [2], [3, 4]
                        ],
                        [
                            [1], [2], [3, 4]
                        ],
                        [
                            [1], [2, 3], [4]
                        ],
                        [
                            [1], [2, 3], [4]
                        ]
                    ];

                    var forcemusic = false;

                    this.data = data;
                    this.w = g.d("slides-wrapper", g.wrapper);
                    this.livetext = g.d("slides-live-text", this.w).hide();


                    g.loading(true, "Loading...");


                    var musicindex = typeof (forcemusic) == "number" ? forcemusic - 1 : Math.floor(Math.random() * this.musicinfo.length);
                    this.music = {};
                    this.stopmusic = () => Object.keys(this.music).forEach((s) => this.music[s].stop());
                    var musictoload = ["drop", { n: "segue", f: "segue", l: true }];
                    this.slidemusicrange = [];
                    this.musicinfo[musicindex].forEach((n, i) => {
                        if (g.isfreeplay) n.forEach((e) => {
                            var name = "slide".concat(i);
                            musictoload.push({
                                n: name,
                                f: "slide".concat(e),
                                l: true
                            });
                            this.slidemusicrange.push(name);
                        });
                        else musictoload.push({
                            n: "slide".concat(i),
                            f: "slide".concat(
                                n[Math.floor(Math.random() * n.length)]
                            ),
                            l: true
                        });
                    });
                    var allloaded = () => {
                        g.loading(false);
                        this.start();
                    };
                    var nloaded = 0;
                    musictoload.forEach((n) => {
                        var o = typeof (n) == "string" ? { n, f: n } : n;
                        this.music[o.n] = new Howl({
                            src: ["music/music".concat(musicindex + 1, "/", o.f, ".wav")],
                            autoplay: false,
                            volume: 0.8,
                            //volume: 0,
                            loop: !!o.l,
                            onload: () => {
                                if (++nloaded == musictoload.length) allloaded();
                            }
                        });
                    });


                    this.doplaymusic = !g.isfreeplay;


                    this.data.slideMetrics.push({
                        endslideshow: true,
                        timeSinceStartOfTalkInMs: this.data.talkDurationInMs
                    });
                }

                start() {
                    this.isactualslide = (e, r) => {
                        var p = e.text || (e.altText && e.id) || e.type;
                        if (r) return p;
                        return p || e.endslideshow;
                    };
                    this.findnextslide = (i) => this.data.slideMetrics.find((e, r) => {
                        if (r <= i) return false;
                        if (this.isactualslide(e)) return true;
                    });

                    this.findbuiltindex = (i) =>
                        this.data.slideMetrics
                            .map((e, r) => Object.assign(e, { index: r }))
                            .filter((e) => this.isactualslide(e))
                            .findIndex((e) => e.index == i);

                    this.data.slideMetrics.forEach((s, i) => {
                        setTimeout(() => {
                            var bs = g.isfreeplay ? this.data.builtTalk[this.findbuiltindex(i)] : null;
                            this.showslide(s, this.findnextslide(i), bs, i);
                        }, s.timeSinceStartOfTalkInMs);
                    });

                    this.ismeteroverflow = false;
                    this.meter = g.d("meter-wrapper", g.wrapper);
                    if (g.isfreeplay) this.meter.addClass("purple");
                    anime({
                        targets: this.meter[0],
                        translateX: "100%",
                        duration: 3000,
                        easing: "easeInQuart",
                        direction: "reverse",
                        endDelay: 2100
                    });
                    this.meteroverflowelement = g.d("meter-overflow", this.meter);
                    var meterhandswrapper = g.d("meter-hands-wrapper", this.meter);
                    this.meterhands = [];
                    this.data.reactingPlayers.forEach((e, i) => {
                        var p = g.playerutil.getPlayer(e);
                        var hw = g.d("meter-hand-wrapper", meterhandswrapper);
                        var hm = g.d("meter-hand-main", hw).css({ backgroundImage: "url(".concat(p.hand, ")") });
                        anime.set(hw[0], { translateY: "50%" });
                        setTimeout(() => {
                            anime({
                                targets: hw[0],
                                rotate: [-5, 3],
                                duration: anime.random(1500, 1700),
                                easing: "easeInOutSine",
                                direction: "alternate",
                                loop: true
                            });
                        }, anime.random(0, 2000));
                        setTimeout(() => {
                            anime({
                                targets: hm[0],
                                translateX: 15,
                                duration: anime.random(1000, 1200),
                                easing: "easeInOutSine",
                                direction: "alternate",
                                loop: true
                            });
                        }, anime.random(0, 1000));
                        g.d("meter-hand-name", hm).html(p.name);
                        this.meterhands.push({
                            el: hw,
                            stopanim: () => {
                                anime.remove([hw[0], hm[0]]);
                            },
                            name: e,
                            player: p
                        });
                        this.setmeterhand(i, 0, 0);
                    });

                    this.data.meterLevels.forEach((r, i) => {
                        r.forEach((l) => {
                            setTimeout(() => {
                                if (l.meterLevel != this.meterhands[i].level) this.setmeterhand(i, l.meterLevel);
                            }, l.timeSinceStartOfTalkInMs);
                        });
                    });

                    var lastReactions = {};
                    this.data.reactions.forEach((r) => {
                        setTimeout(() => {
                            var isUp = r.direction == "up";
                            new Howl({
                                src: ["/sound/react_".concat(r.direction, ".wav")],
                                volume: isUp ? 0.6 : 0.1,
                                //volume: 0,
                                autoplay: true
                            });
                            var lr = lastReactions[r.byPlayer];
                            if (lr && isUp && lr == r.meterLevel && r.meterLevel > 430 && r.meterLevel <= 465) {
                                var mho = this.meterhands.find((m) => m.name == r.byPlayer);
                                if (mho) {
                                    var mh = mho.el;
                                    mh.addClass("buzz");
                                    var yjitter = 1.2;
                                    var xjitter = 0.7;
                                    var ujitter = 5;
                                    var djitter = 20;
                                    var getty = (v) => "calc(50% + ".concat(v, "px)");
                                    anime({
                                        targets: mh[0],
                                        keyframes: [
                                            { translateY: getty(0 - yjitter), translateX: 0 - xjitter, duration: ujitter, delay: djitter },
                                            { translateY: getty(0 - yjitter), translateX: xjitter, duration: ujitter, delay: djitter },
                                            { translateY: getty(yjitter), translateX: 0 - xjitter, duration: ujitter, delay: djitter },
                                            { translateY: getty(yjitter), translateX: xjitter, duration: ujitter, delay: djitter }
                                        ],
                                        easing: "linear",
                                        loop: 4,
                                        complete: () => mh.removeClass("buzz")
                                    });
                                }
                            }
                            lastReactions[r.byPlayer] = r.meterLevel;
                        }, r.timeSinceStartOfTalkInMs);
                    });

                    var aeiouy = this;
                    var timelineicon = class {
                        constructor(type, timeline) {
                            this.e = g.d("timeline-icon", timeline.r).css({ width: timeline.iconwidth });
                            this.uns = g.d("timeline-icon-unselected", this.e).css({ backgroundImage: "url(images/slideicons/".concat(type, ".png)") });
                            this.sel = g.d("timeline-icon-selected", this.e).css({ backgroundImage: "url(images/slideicons/".concat(type, "Selected.png)") });
                            this.select(false);
                        }

                        select(selected) {
                            this.uns.css({ opacity: selected ? 0 : 1 });
                            this.sel.css({ opacity: selected ? 1 : 0 });
                        }
                    };
                    this.timelineclass = class {
                        constructor(icons) {
                            this.iconwidth = 33;

                            this.w = g.d("timeline-wrapper", aeiouy.w);
                            this.s = g.d("timeline-scroller", this.w);
                            this.a = g.d("timeline-arrow", this.s).css({ width: this.iconwidth });
                            anime({
                                targets: this.a[0],
                                translateY: -5,
                                easing: "easeInOutSine",
                                duration: 1000,
                                direction: "alternate",
                                loop: true
                            });
                            this.r = g.d("timeline-icon-row", this.s);
                            this.icons = icons.map((e) => new timelineicon(e, this));
                            this.currentselected = -1;
                            //this.setposition(this.currentselected);

                            anime({
                                targets: this.icons.map((i) => i.e[0]),
                                scale: [0, 1],
                                easing: "easeOutQuart",
                                duration: 300,
                                delay: anime.stagger(30)
                            });
                        }

                        setposition(index) {
                            var ic = this.icons[index];
                            if (!ic) return;
                            anime({
                                targets: this.a[0],
                                left: this.iconwidth * index,
                                easing: "easeInOutQuart",
                                duration: 400
                            });
                            setTimeout(() => {
                                var prev = this.icons[index - 1];
                                if (prev) prev.select(false);
                                ic.select(true);
                            }, 200);
                        }

                        next() {
                            this.currentselected++;
                            this.setposition(this.currentselected);
                        }

                        end() {
                            anime.remove(this.a[0]);
                        }
                    };

                    this.timeline = new this.timelineclass(g.isfreeplay ? this.data.slideMetrics.map((r) => {
                        if (this.isactualslide(r, true)) {
                            var t = "text";
                            var isImageSlide = r.altText && r.id;
                            var isPictureSlide = r.type && r.type == "jackboxgames.jackboxtalks.model::CustomPhoto";
                            var isDrawingSlide = r.type && r.type == "jackboxgames.jackboxtalks.model::CustomDrawing";
                            if (isImageSlide || isPictureSlide) t = "picture";
                            if (isDrawingSlide) t = "drawing";
                            return t;
                        }
                        return false;
                    }).filter((r) => r) : ["start", "text", "picture", "text", "picture", "text", "picture", "end"]);
                }

                setmeterhand(index, meterlevel, duration) {
                    if (!this.meterhands) return;
                    var ww = this.meterhands[index];
                    if (!ww) return;
                    ww.level = meterlevel;
                    var topvalue = 465;
                    var percentvalue = meterlevel / topvalue;
                    var displayvalue = percentvalue * 100;
                    anime({
                        targets: ww.el[0],
                        bottom: "".concat(displayvalue, "%"),
                        duration: duration == null ? 150 : duration,
                        easing: "easeOutQuart"
                    });

                    var slidemeter = (up) => {
                        if (this.meterjitter) this.meterjitter.pause();
                        anime({
                            targets: this.meter[0],
                            bottom: up ? -350 : 40,
                            duration: 600,
                            easing: "easeInOutExpo",
                            complete: () => {
                                if (up) {
                                    var yjitter = 1.2;
                                    var xjitter = 0.7;
                                    var ujitter = 10;
                                    var djitter = 30;
                                    this.meterjitter = anime({
                                        targets: this.meteroverflowelement[0],
                                        keyframes: [
                                            { translateY: 0 - yjitter, translateX: 0 - xjitter, duration: ujitter, delay: djitter },
                                            { translateY: 0 - yjitter, translateX: xjitter, duration: ujitter, delay: djitter },
                                            { translateY: yjitter, translateX: 0 - xjitter, duration: ujitter, delay: djitter },
                                            { translateY: yjitter, translateX: xjitter, duration: ujitter, delay: djitter }
                                        ],
                                        easing: "linear",
                                        loop: true
                                    });
                                }
                            }
                        });
                        if (this.slidemeterbacktimeouts) this.slidemeterbacktimeouts.forEach((t) => clearTimeout(t));
                        var ta1 = setTimeout(() => {
                            this.meteroverflowelement[up ? "addClass" : "removeClass"]("overflowshown");
                        }, up ? 200 : 400);
                        if (up) g.elements.background.overflow();
                        else g.elements.background.changecolor(g.isfreeplay ? "purple" : "yellow");
                        var ta2 = setTimeout(() => {
                            if (up) {
                                new Howl({
                                    src: ["/sound/tower_next_tier3.wav"],
                                    volume: 0.4,
                                    //volume: 0,
                                    autoplay: true
                                });
                            }
                        }, 300);
                        var ta3 = setTimeout(() => {
                            this.meter[up ? "addClass" : "removeClass"]("meterhidden");
                        }, up ? 400 : 200);
                        this.slidemeterbacktimeouts = [ta1, ta2, ta3];
                    };

                    /* if (!this.testmeterslide) {
                        this.testmeterslide = true;
                        slidemeter(true);
                    } */

                    if (meterlevel > topvalue && !this.ismeteroverflow) {
                        this.ismeteroverflow = true;
                        slidemeter(true);
                    } else if (!this.meterhands.some((h) => h.level > topvalue) && this.ismeteroverflow) {
                        if (!this.slidemeterback) this.slidemeterback = setTimeout(() => {
                            this.slidemeterback = false;
                            this.ismeteroverflow = false;
                            slidemeter(false);
                        }, 2000);
                    }
                }

                setlivetext(t) {
                    if (!t) this.livetext.hide();
                    else this.livetext.show().html(t);
                }

                drawoncanvas(c, lines, an) {
                    var prevpoint = null;
                    var s = new Sketchpad({
                        element: c,
                        width: 990,
                        height: 660,
                        readOnly: true,
                        strokes: lines.map((line) => ({
                            color: line.color,
                            size: line.thickness,
                            lines: line.points.split("|").map((p) => {
                                var ss = p.split(",");
                                var x = ss[0];
                                var y = ss[1];
                                var point = { x, y };
                                var r = { start: { ...prevpoint } || point, end: point };
                                prevpoint = point;
                                return r;
                            })
                        }))
                    });
                    if (an) s.animate(1000);
                }

                showslide(data, next, builtslide, slideindex) {
                    var isTextSlide = !!data.text;
                    var isImageSlide = data.altText && data.id;
                    var isPictureSlide = data.type && data.type == "jackboxgames.jackboxtalks.model::CustomPhoto";
                    var isDrawingSlide = data.type && data.type == "jackboxgames.jackboxtalks.model::CustomDrawing";
                    if (isTextSlide || isImageSlide || isPictureSlide || isDrawingSlide) {
                        this.timeline.next();
                        this.setlivetext();
                        if (this.doplaymusic) this.stopmusic();
                        if (this.currentslide) this.currentslide.remove();
                        var slidetypestring = "text";
                        if (isImageSlide) slidetypestring = "image";
                        if (isPictureSlide) slidetypestring = "picture";
                        if (isDrawingSlide) slidetypestring = "drawing";
                        this.currentslide = g.d("slides-slide ".concat("slides-", slidetypestring, "-slide"), this.w);
                        if (next) {
                            if (this.currentslidetimer) {
                                anime.remove(this.currentslidetimer[0]);
                                this.currentslidetimer.remove();
                            }
                            var slidetimer = g.d("slides-slide-timer", this.w);
                            this.currentslidetimer = slidetimer;
                            var slidetimertext = g.d("slides-slide-timer-text", slidetimer);
                            var slideduration = next.timeSinceStartOfTalkInMs - data.timeSinceStartOfTalkInMs;
                            anime({
                                targets: slidetimer[0],
                                width: ["0%", "100%"],
                                easing: "linear",
                                duration: slideduration,
                                complete: () => slidetimer.remove(),
                                update: (a) => {
                                    var m = a.progress / 100;
                                    var dt = slideduration * m;
                                    var f = slideduration - Math.floor(dt);
                                    var ft = g.duration(Math.floor(f) + 1000, true);
                                    slidetimertext.html(ft);
                                }
                            });
                        }

                        if (this.currentlines) this.currentlines.forEach((c) => c.remove());
                        this.currentlines = [];

                        var didplaytmus = false;
                        if (slideindex == this.data.slideMetrics.length - 2) {
                            if (this.doplaymusic) this.music.drop.play();
                            didplaytmus = true;
                        }
                        if (isTextSlide) { //text slide
                            if (didplaytmus) { } else if (!this.firstslidepassed) {
                                this.firstslidepassed = true;
                                this.secondslidenext = true;
                                if (this.doplaymusic) this.music.segue.play();
                            } else if (this.secondslidenext) {
                                this.secondslidenext = false;
                                if (this.doplaymusic) this.music.drop.play();
                            } else if (this.doplaymusic) this.music.segue.play();
                            if (this.toptext) this.toptext.remove();
                            g.d("slides-text-slide-text", this.currentslide).html(data.text);
                            this.lasttext = data.text;
                        } else if (isImageSlide) { //stock image slide
                            this.setlivetext();
                            this.currentslide.css({ opacity: 0 });
                            var i = g.n("img", "slides-image-slide-image", this.currentslide).attr({ src: "https://thedarksid3r.github.io/tpimages/images/".concat(data.id, ".jpg"), alt: data.altText });
                            i.on("load", () => {
                                this.currentslide.css({ opacity: 1 });
                            });
                            if (!g.isfreeplay && this.lasttext) this.toptext = g.d("slides-top-text", this.w).html(this.lasttext);
                        } else if (isPictureSlide) {
                            var w = g.d("slides-picture-slide-warning", this.currentslide);
                            g.d("slides-picture-slide-warning-top", w).html("[PHOTO SLIDE]");
                            g.d("slides-picture-slide-warning-bottom", w).html("This slide type does not contain data. Sorry!");
                        } else if (isDrawingSlide) {
                            var c = g.n("canvas", "slides-drawing-slide-drawing", this.currentslide);
                            this.drawoncanvas(c, builtslide.compressedLines, false);
                        }
                        if (isImageSlide || isPictureSlide || isDrawingSlide) {
                            if (this.doplaymusic && !g.isfreeplay) {
                                if (!this.numimageslidespassed) this.numimageslidespassed = 0;
                                this.music["slide".concat(this.numimageslidespassed)].play();
                                this.numimageslidespassed++;
                            } else if (this.doplaymusic) {
                                this.music[this.slidemusicrange[Math.floor(Math.random() * this.slidemusicrange.length)]].play();
                            }
                        }
                    } else if (data.liveText) { //live text updated
                        this.setlivetext(data.liveText.trim());
                    } else if (data.line) { //drawing on slide
                        var c = g.n("canvas", "slides-drawing-overlay", this.currentslide).css({ zIndex: 10 + this.currentlines.length });
                        this.currentlines.push(c);
                        var line = data.line;
                        this.drawoncanvas(c, [line], true);
                    } else if (data.endslideshow) {
                        this.endslideshow();
                    }
                }

                endslideshow() {
                    g.elements.background.changecolor(g.isfreeplay ? "purple" : "yellow");
                    var dd = 0;
                    var c = () => {
                        if (++dd == 2) {
                            this.timeline.end();
                            this.meterhands.forEach((h) => h.stopanim());
                            this.w.remove();
                            this.meter.remove();
                            g.elements.menu.w.show();
                            g.elements.selectpreslist.show();
                        }
                    };
                    anime({
                        targets: this.meter[0],
                        translateX: "100%",
                        duration: 1300,
                        easing: "easeInExpo",
                        complete: () => c()
                    });
                    anime({
                        targets: this.w[0],
                        translateX: "-100%",
                        left: 0,
                        duration: 1300,
                        easing: "easeInExpo",
                        complete: () => c()
                    });
                }
            }
        };
    }

    n(e, c, p) {
        var r = $("".concat("<", e, "/>")).addClass(c);
        if (p && $(p).length) $(p).append(r);
        return r;
    }

    d(c, p) {
        return this.n("div", c, p);
    }

    loading(isl, t) {
        var l = this.elements.loader;
        if (isl) {
            if (this.isLoading) return;
            this.elements.loaderText.html(t || "");
            anime({
                targets: l[0],
                backgroundPosition: ["center 0%", "center 100%"],
                easing: "steps(54)",
                duration: 1500,
                loop: true
            });
        } else anime.remove(l[0]);
        this.isLoading = isl;
        l.toggle(isl);
    }

    init() {
        //loader 55 steps
        var loader = this.d("loader", this.wrapper).hide();
        var loaderText = this.d("loader-text", loader);
        this.elements = {
            background: new this.scene.background().init(),
            menu: new this.scene.menu(),
            loader,
            loaderText
        };
        this.loading(true, "Loading...");
        setTimeout(() => {
            this.loaded();
        }, 100);
    }
    loaded() {
        this.loading(false);
        this.elements.menu.init();
    }
    duration(t, ds) {
        var m = Math.floor(t / 60000);
        var s = ((t % 60000) / 1000).toFixed(0);
        return (ds && (t / 1000) < 60) ? s : "".concat(m, ":", s.padStart(2, "0"));
    }
    initArtifact(data) {
        this.artifact = data.blob;
        this.isfreeplay = this.artifact.gameType == "FreePlay";
        if (this.isfreeplay) this.elements.background.changecolor("purple");
        var p = new this.scene.playerutil();
        this.playerutil = p;
        p.init(this.artifact.players);
        this.artifact.players = p.players;
        this.elements.menu.sidestageexit();
        console.log(this.artifact);
        var l = this.d("select-pres-list", this.wrapper).css({ overflow: "visible" });
        this.elements.selectpreslist = l;
        var li = [
            this.d("select-pres-list-title", l).html("Select a talk to replay")[0]
        ];
        this.artifact.players.forEach((e) => {
            var timg = { backgroundImage: "url(https://thedarksid3r.github.io/tpimages/lowimages/".concat(e.highlightedPhoto.id, ".jpg)") };
            var b = this.n("button", "select-pres-button", l).on("click", () => {
                this.initTalk(e);
            });
            if (!this.isfreeplay) {
                var msi = g.d("menu-stage-img", this.elements.menu.mainstage).css(timg).css({ opacity: 0 });
                this.d("menu-stage-img-title", msi).html(e.title)
                b.on("mouseenter", () => {
                    msi.stop().animate({ opacity: 1 }, 100);
                }).on("mouseleave", () => {
                    msi.stop().animate({ opacity: 0 }, 100);
                });
            }
            this.n("span", "select-pres-name", b).append(
                this.d("select-pres-avatar").css({ backgroundImage: "url(".concat(e.avatar, ")") }),
                this.n("span", "select-pres-name-name").html(e.name)
            );
            if (!this.isfreeplay) this.n("span", "select-pres-title", b).html(e.title);
            if (!this.isfreeplay) this.d("select-pres-image", b).css(timg);
            this.d("select-pres-duration", b).html(this.duration(e.talkDurationInMs));
            li.push(b[0]);
        });
        anime({
            targets: li,
            translateX: -700,
            direction: "reverse",
            easing: "easeInQuart",
            duration: 700,
            delay: anime.stagger(50, { from: "last" }),
            //endDelay: 500,
            complete: () => l.css({ overflow: "hidden", overflowY: "auto" })
        });
    }
    initTalk(data) {
        console.log(data);
        this.elements.menu.w.hide();
        this.elements.selectpreslist.hide();
        var s = new this.scene.slideshow();
        s.init(data);
    }
};

var g = new game(".content");
$(() => {
    var resize = () => {
        var wa = $(".aspect-wrapper");
        $(".content").css({
            transform: "".concat(
                "translate(-50%, -50%) scale(",
                Math.min(
                    wa.width() / 1280,
                    wa.height() / 720
                ),
                ")"
            )
        });
    };
    resize();
    $(window).on("resize", () => resize());
    g.init();
});