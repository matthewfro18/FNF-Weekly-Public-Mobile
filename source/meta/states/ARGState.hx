package meta.states;

class ARGState extends MusicBeatState
{

    var argText:FlxText;

    override function create()
    {
        argText = new FlxText(872, 130, "", 25);
        argText.alignment = CENTER;
		argText.font = "VCR OSD Mono";
		argText.color = 0xffffffff;
		argText.antialiasing = ClientPrefs.globalAntialiasing;
        argText.screenCenter();
        argText.text = "No way to win, no way to speak" + "\nPerhaps... a website..?" + "\n-Norbert"; //look leth it was like 4 am
		add(argText);
    }

    override public function update(elapsed:Float)
    {
	var justTouched:Bool = false;

		#if mobile
                for (touch in FlxG.touches.list)
	                if (touch.justPressed)
		                justTouched = true;
		#end
        if (controls.BACK || justTouched)
        {
            FlxG.sound.play(Paths.sound('cancelMenu'));
            MusicBeatState.switchState(new WeeklyMainMenuState());
        }
    }
}
