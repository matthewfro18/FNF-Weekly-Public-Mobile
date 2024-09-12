package mobile.meta.data;

import flixel.FlxG;
import flixel.system.scaleModes.BaseScaleMode;

class MobileScaleMode extends BaseScaleMode
{
    @:isVar public var width(get, set):Null<Int> = null;
    @:isVar public var height(get, set):Null<Int> = null;
    public static var allowWideScreen(default, set):Bool = true;

    override function updateGameSize(Width:Int, Height:Int):Void
	{
        if(ClientPrefs.wideScreen && allowWideScreen)
        {
            super.updateGameSize(Width, Height);
        }
        else
        {
            var ratio:Float = FlxG.width / FlxG.height;
            var realRatio:Float = Width / Height;
    
            var scaleY:Bool = realRatio < ratio;
    
            if (scaleY)
            {
                gameSize.x = Width;
                gameSize.y = Math.floor(gameSize.x / ratio);
            }
            else
            {
                gameSize.y = Height;
                gameSize.x = Math.floor(gameSize.y * ratio);
            }
        }
	    FlxG.width = width;
	    FlxG.height = height;
	}
    public function resetSize() {
		width = null;
		height = null;
    }

    override function updateGamePosition():Void
	{
        if(ClientPrefs.wideScreen && allowWideScreen)
		    FlxG.game.x = FlxG.game.y = 0;
        else
            super.updateGamePosition();
	}

    private inline function get_width():Null<Int>
	    return this.width == null ? FlxG.initialWidth : this.width;
    private inline function get_height():Null<Int>
	    return this.height == null ? FlxG.initialHeight : this.height;
    private inline function set_width(v:Null<Int>):Null<Int> {
	    this.width = v;
	    @:privateAccess
	    FlxG.game.onResize(null);
	    return v;
    }
    private inline function set_height(v:Null<Int>):Null<Int> {
	    this.height = v;
	    @:privateAccess
	    FlxG.game.onResize(null);
	    return v;
    }

    @:noCompletion
    private static function set_allowWideScreen(value:Bool):Bool
    {
        allowWideScreen = value;
        FlxG.scaleMode = new MobileScaleMode();
        return value;
    }
}
