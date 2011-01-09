/**
  @file
  @author  Fyodorov "bga" Alexander <bga.email@gmail.com>
 
  @section LICENSE
 
  Copyright (c) 2009-2010, Fyodorov "Bga" Alexander <bga.email@gmail.com>
  All rights reserved.

  Redistribution and use in source and binary forms, with or without
  modification, are permitted provided that the following conditions are met:
      * Redistributions of source code must retain the above copyright
        notice, this list of conditions and the following disclaimer.
      * Redistributions in binary form must reproduce the above copyright
        notice, this list of conditions and the following disclaimer in the
        documentation and/or other materials provided with the distribution.
      * The name of the developer may not be used to endorse or promote
        products derived from this software without specific prior
        written permission.

  THIS SOFTWARE IS PROVIDED BY FYODOROV "BGA" ALEXANDER "AS IS" AND ANY EXPRESS OR
  IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
  IN NO EVENT SHALL FYODOROV "BGA" ALEXANDER BE LIABLE FOR ANY DIRECT, INDIRECT,
  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT
  NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
  DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
  THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
  (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
  OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

/*
$jb.Loader._scope().
_require("$jb/$G.Function.js").
_require("_3rdParty/jquery-1.3.2.min.js", true).
//_require("http://ajax.googleapis.com/ajax/libs/jquery/1.3.2/jquery.min.js", true).
//_require("_3rdParty/jquery-ui-1.7.2.custom.min.js", true).
//_require("css/jquery-ui-1.7.2.custom.css", true).
//_require("$jb/$jb.Preprocessor.js").
//_require("/p/jbasis/test/_js/base.js").
_completed*/
(function($G, $jb, $A){

Function.prototype._fBind = function(that, args)
{
  var _fn = this, _ret;
  
  if(that != null)
  {
    _ret = (args != null) 
      ? function(){ return _fn.apply(that, args); }
      : function(){ return (arguments.length > 0) ? _fn.apply(that, arguments) : _fn.call(that); };
  }
  else
  {
    _ret = (args != null) 
      ? function(){ return _fn.apply(this, args); }
      : function(){ return (arguments.length > 0) ? _fn.apply(this, arguments) : _fn.call(this); };
  }

  _ret.prototype = _fn.prototype;
  
  return _ret;
};


jQuery.noConflict();

var 
  $w = $G.window, 
  $d = $G.document, 
  _dom = $jb._dom = jQuery
  ;

//$A.serverUrl = 'server/hiscore.php'
$A.serverUrl = 'http://nomorerats.byethost8.com/p/flowers-game.js/server/hiscore.php';

$A.__playSound = function(id)
{
  var audio = $d.getElementById(id);
  
  //if(audio.currentTime > 0)
  {
    //audio.pause();
    audio.currentTime = 1e-7; 
  }
  
  audio.play();
};

$A._playSound = $jb._null;
//$A._playSound = $A.__playSound;

$A._setSoundVolume = function(vol)
{
  if(vol === 0)
    return $A._playSound = $jb._null;
  
  $A._playSound = $A.__playSound;
  
  var as = $d.getElementsByTagName('audio'), i = as.length;
  
  vol *= 0.01;
  
  while(i--)
    as[i].volume = vol;
};

$A.Unit = function()
{

};

$A.Bullets = function()
{
  this.sprites = $d.getElementById("bullets");
};

$A.Bullets.prototype._initGame = function(dif)
{
  this.sprites.innerHTML = '';
};

$A.Bullets.prototype._createBullet=function(x, y, dx, dy)
{
  var b = $d.createElement("div"), st, d;
  
  d = b.d = {};
  
  (st = b.style).left = (d.x = x) - 3 +'px';
  st.top = (d.y = y) - 3 + 'px';
  d.dx = dx;
  d.dy = dy;
  
  return this.sprites.appendChild(b);
};

$A.Bullets.prototype._removeBullet=function(b)
{
  b.d = null;
  this.sprites.removeChild(b);
};

$A.Bullets.prototype._render=function()
{
  var bs = this.sprites.childNodes, bsLen = bs.length, bi = bsLen, b, x, y, wWidthSub3 = $A.wWidth - 3, d, st;
  
  while(bi--)
  {
    d = (b = bs[bi]).d;
    y = (d.y += d.dy);
    
    if(y <= 3)
    {
      this._removeBullet(b)
    }
    else
    {
      (st = b.style).top = y + 'px';

      if(d.dx !== 0)
      {
        x = (d.x += d.dx);
        
        if(x <= 3 || x >= wWidthSub3)
          this._removeBullet(b);
        else
          st.left = x - 3 + 'px';
      }  
    }
  }
  
  // collision detection
  var fgs = $A.flowerGroups.groups, fgi = fgs.length, fg, fs, fi, temp, d;
  
  while(fgi--)
  {
    fs = (fg = fgs[fgi]).sprites.childNodes;
    
    bi =  bs.length;
    
    while(bi--)
    {
      x = (b = bs[bi]).d.x, y = b.d.y;
      fi = fs.length;
      
      while(fi--)
      {
        if((temp = (d = fs[fi].d).x - x)*temp + (temp = d.y - y)*temp < 400)
        {
          fg._killFlower(fs[fi]);
          this._removeBullet(b);
          
          break;
        }
      }
    }
  }
};

$A.Ship = function()
{
  this.sprite = $d.getElementById("ship");
  this.lifeCountEl = $d.getElementById("lifeCount").firstChild;
  this.menuEl = $d.getElementById("menu");
  this.menuTitleEl = $d.getElementById("menu-title").firstChild;
  this.sawEl = $d.getElementById("ship-saw");
  
  this.lifeCount;
  
  this.maxAModeTime;
  this.aModeElTime;

  this.maxSawTime;
  this.maxSawFlowersCount;
  this.sawModeElTime;
  this.sawModeFlowersElCount;

  this.baseSpriteClass;
  
  this.x;
  this.y;
  
  this.isPause;
  
  this._fireBullet;
  this._render;
  
  this._aModeOn;
  this._sawModeOn;
  
  this._moveLeft;
  this._moveRight;
  

  this.restoreSpriteClassThreadId_ = null;
  this.__restoreSpriteClassThread = this.__restoreSpriteClassThread._fBind(this);
};

$A.Ship.prototype.__stopRestoreClassThread = function()
{  
  if(this.restoreSpriteClassThreadId_ != null)
  {
    clearInterval(this.restoreSpriteClassThreadId_);
    this.restoreSpriteClassThreadId_ = null;
  }
};
$A.Ship.prototype.__restoreSpriteClassThread = function()
{
  this.sprite.className = this.baseSpriteClass;
  this.restoreSpriteClassThreadId_ = null;
};

$A.Ship.prototype._initGame = function(dif)
{
  var d = dif['ship'];
  
  this.maxAModeTime = d.maxAModeTime;
  this.maxSawFlowersCount = d.maxSawFlowersCount;
  this.maxSawTime = d.maxSawTime;
  
  this.lifeCountEl.data = this.lifeCount = 3;
  
  this.__aModeOff();
  this.__sawModeOff();

  this.sprite.className = this.baseSpriteClass = '';

  this.y = $A.wHeight - 20;
  this.sprite.style.left = (this.x = 0.5*$A.wWidth) - 20 + 'px';
  
  this.__pauseModeOff();
  this._enablePause();

  this.__passiveModeOn();
};

$A.Ship.prototype._kill = function()
{
  $A._playSound('audio-explode');
  
  this.__aModeOff();
  this.__sawModeOff();
  
  this.__stopRestoreClassThread();
  this.baseSpriteClass = '';
  this.sprite.className = this.baseSpriteClass + " explode";

  this.__passiveModeOn();
  this._render = $jb._null;

  if(--this.lifeCount === -1)
  {
    this._disablePause();
    
    return $A._gameOver();
  }
  
  this.lifeCountEl.data = this.lifeCount;
  
  this.restoreSpriteClassThreadId_ = setTimeout(this.__restoreSpriteClassThread, 3000);

  var self = this;
  
  setTimeout(
    function()
    {
      self.sprite.style.bottom = '-52px';
      self.__sawModeOn();
      
      if(!self.isPause)
        self._render = self.__renderWakeUp;
      else
        self._render = $jb._null;
    },
    3000
  );
};

$A.Ship.prototype.__fireBullet = function()
{
  $A._playSound('audio-fire');
  
  // center
  $A.bullets._createBullet(this.x, $A.wHeight - 40 - 6, 0, -20);
  
  if(this.restoreSpriteClassThreadId_ == null)
  {
    this.sprite.className += " fire";
    this.restoreSpriteClassThreadId_ = setTimeout(this.__restoreSpriteClassThread, 100);
  }
};

$A.Ship.prototype.__fireBulletA = function()
{
  $A._playSound('audio-fire');
  // center
  $A.bullets._createBullet(this.x, $A.wHeight - 40 - 6, 0, -20);
  
  // left
  $A.bullets._createBullet(this.x - 3, $A.wHeight - 40 - 6, -8, -18);

  // right
  $A.bullets._createBullet(this.x + 3, $A.wHeight - 40 - 6, +8, -18);
  
  if(this.restoreSpriteClassThreadId_ == null)
  {
    this.sprite.className += " fire";
    this.restoreSpriteClassThreadId_ = setTimeout(this.__restoreSpriteClassThread, 100);
  }
};

$A.Ship.prototype.__pauseModeOn = function()
{  
  this.isPause = true;
  this.menuTitleEl.data = $A.gameDifName + " :: Pause";
  this.menuEl.style.display = "";
  this._render = this.__renderSleep;
  this.__passiveModeOn();
  
  this.startPauseTime = +new Date();
};
$A.Ship.prototype.__pauseModeOff = function()
{  
  this.isPause = false;
  this.menuEl.style.display = 'none';
  this.sprite.style.bottom = '-52px';
  _dom('#soundLvl a').blur();
  this._render = this.__renderWakeUp;
  
  $A.gameStartTime += new Date() - this.startPauseTime;
};
$A.Ship.prototype.__togglePause = function()
{
  if(this.isPause = !this.isPause)
    this.__pauseModeOn();
  else
    this.__pauseModeOff();
};
$A.Ship.prototype._disablePause = function()
{
  this._togglePause = $jb._null;
};
$A.Ship.prototype._enablePause = function()
{
  this._togglePause = this.__togglePause;
};

$A.Ship.prototype.__passiveModeOn = function()
{
  this._moveLeft = this._moveRight = this._fireBullet = this._sawModeOn = this._aModeOn = this._addLife = $jb._null;
};
$A.Ship.prototype.__passiveModeOff = function()
{
  this._render = (this.sawModeFlowersElCount > 0) ? this.__renderSaw : this.__render;
  this._fireBullet = (this.aModeElTime > 0) ? this.__fireBulletA : this.__fireBullet;
  this._addLife = this.__addLife;
  
  this._sawModeOn = this.__sawModeOn;
  this._aModeOn = this.__aModeOn;
  
  this._moveLeft = this.__moveLeft;
  this._moveRight= this.__moveRight;
};

$A.Ship.prototype.__aModeOn = function()
{
  this.aModeElTime = this.maxAModeTime;

  this._fireBullet = this.__fireBulletA;

  this.__stopRestoreClassThread();
  this.sprite.className = this.baseSpriteClass = 'a';
};
$A.Ship.prototype.__aModeOff = function()
{
  this.aModeElTime = 0;

  this._fireBullet = this.__fireBullet;

  this.__stopRestoreClassThread();
  this.sprite.className = this.baseSpriteClass = '';
};

$A.Ship.prototype.__sawModeOn = function()
{
  this.sawModeElTime = this.maxSawTime;
  this.sawModeFlowersElCount = this.maxSawFlowersCount;
  this._render = this.__renderSaw;
  
  this.sawEl.style.display = '';
};
$A.Ship.prototype.__sawModeOff = function()
{
  this.sawModeFlowersElCount = this.sawModeElTime = 0;
  this._render = this.__render;
  this.sawEl.style.display = 'none';
};

$A.Ship.prototype.__addLife = function()
{
  this.lifeCountEl.data = "" + (++this.lifeCount);
};

$A.Ship.prototype.__moveLeft = function()
{
  var x = this.x - 15;
  
  if(x <= 20)
    x = 20;
  
  if(this.x !== x)
    this.sprite.style.left = (this.x = x)- 20 + 'px';
};
$A.Ship.prototype.__moveRight = function()
{
  var x = this.x + 15;
  
  if(x >= $A.wWidth - 20)
    x = $A.wWidth - 20;
  
  if(this.x !== x)
    this.sprite.style.left = (this.x = x)- 20 + 'px';
};

$A.Ship.prototype.__renderSleep=function()
{
  var st = this.sprite.style, y = st.bottom.slice(0, -2) - 1;
  
  if(y < -51)
  {
    y = -51;
    this._render = $jb._null;
  }

  st.bottom = y + 'px';
};
$A.Ship.prototype.__renderWakeUp = function()
{
  var st = this.sprite.style, y = +st.bottom.slice(0, -2) + 1;
  
  if(y > 0)
  {
    y = 0;
    this.__passiveModeOff();
  }

  st.bottom = y + 'px';
};
$A.Ship.prototype.__render = function()
{
  // collision detection
  var fgs = $A.flowerGroups.groups, fgi = fgs.length, fg, fs, fi, temp, d, x = this.x, y = this.y;
  
  ship_cd: while(fgi--)
  {
    fi = (fs = (fg = fgs[fgi]).sprites.childNodes).length;
    
    while(fi--)
    {
      if((temp = (d = fs[fi].d).x - x)*temp + (temp = d.y - y)*temp < 1600)
      {
        fg._killFlower(fs[fi]);
        this._kill();
        
        break ship_cd;
      }
    }
  }
  
  if(--this.aModeElTime === 0)
    this.__aModeOff();
};

$A.Ship.prototype.__renderSaw = function()
{
  // collision detection
  var fgs = $A.flowerGroups.groups, fgi = fgs.length, fg, fs, fi, temp, d, x = this.x, y = this.y;
  
  ship_cd: while(fgi--)
  {
    fi = (fs = (fg = fgs[fgi]).sprites.childNodes).length;
    
    while(fi--)
    {
      if((temp = (d = fs[fi].d).x - x)*temp + (temp = d.y - y)*temp < 2601) // (20 + 20 + 11)**2
      {
        fg._killFlower(fs[fi]);
        
        if(--this.sawModeFlowersElCount === 0)
          this.__sawModeOff();
          
        break ship_cd;
      }
    }
  }

  if(--this.sawModeElTime === 0)
    this.__sawModeOff();
  
  if(--this.aModeElTime === 0)
    this.__aModeOff();
};


$A.FlowerGroup={};


$A.Bonuses = function()
{
  this.sprites = $d.getElementById("bonuses");
  
  this.bonusChanse;

};

$A.Bonuses.prototype._initGame = function(dif)
{
  this.sprites.innerHTML = '';
  this.bonusChanse = dif['bonuses'].bonusChanse;
};

$A.Bonuses.prototype._createBonus = function(x, y)
{
  if(Math.random() > this.bonusChanse)
    return;
    
  var b = $d.createElement('div'), st, d;
  var r = Math.random();
  
  if(r < 0.33)
    b.className = 'p';
  else if(r < 0.66)
    b.className = 'new_life';
  else
    b.className = 'saw';
  
  d = b.d = {};
  
  (st = b.style).left = (d.x = x|0) - 20 + 'px';
  st.top = (d.y = y|0) - 20 + 'px';
  
  this.sprites.appendChild(b);
};

$A.Bonuses.prototype._removeBonus = function(b)
{
  b.d = null;
  this.sprites.removeChild(b);
};

$A.Bonuses.prototype._render = function()
{
  var bs=this.sprites.childNodes, bi=bs.length, b, wHeightSub20 = $A.wHeight + 20, d,
    x = $A.ship.x, y = $A.ship.y,
    temp;
  
  while(bi--)
  {
    b = bs[bi];
    
    if(++(d = b.d).y > wHeightSub20)
      this._removeBonus(b);
    else  
      b.style.top = d.y - 20 +'px';

    if((temp = d.x - x)*temp + (temp = d.y - y)*temp < 1600)
    {
      $A._playSound('audio-item');
      
      switch(b.className)
      {
        case 'p':
          $A.ship._aModeOn();
          break;
        case 'new_life':
          $A.ship._addLife();
          break;
        case 'saw':
          $A.ship._sawModeOn();
          break;
      }

      this._removeBonus(b);
    }
  }
};

$A.Petals = function()
{
  this.sprites = $d.getElementById("petals");
};

$A.Petals.prototype._initGame = function(dif)
{
  this.sprites.innerHTML = '';
};

$A.Petals.prototype._removePetals = function(p)
{
  p.d = null;
  this.sprites.removeChild(p);
};
$A.Petals.prototype._addFlower = function(f)
{
  $A._playSound('audio-hit');
  
  ++$A.score;
  
  $A.bonuses._createBonus(f.d.x, f.d.y);
  
  var d = f.d;
  
  d.t = 33;
  d.x |= 0;
  d.y |= 0;
  
  this.sprites.appendChild(f);
};
$A.Petals.prototype._render = function()
{
  var ps=this.sprites.childNodes, pi=ps.length, p, wHeightSub20 = $A.wHeight + 20, d;
  
  while(pi--)
  {
    p = ps[pi];
    
    if(++(d = p.d).y > wHeightSub20 || --d.t === 0)
      this._removePetals(p);
    else  
      p.style.top = d.y - 20 +'px';
  }
};

$A.FlowerGroup.Pulse = function()
{
  this.sprites = $d.getElementById("flowers-pulse");
  
  this.minCreateInterval;
  this.dMinCreateInterval;
  this.mMinCreateInterval;
  
  this.maxCreateInterval;
  this.dMaxCreateInterval;
  this.mMaxCreateInterval;
  
  this.elCreateInterval = 0;
};

$A.FlowerGroup.Pulse.prototype._initGame = function(dif)
{
  this.sprites.innerHTML = ''; 
  
  var d = dif['flowers-pulse'];
  
  this.minCreateInterval = d.minCreateInterval;
  this.dMinCreateInterval = d.dMinCreateInterval;
  this.mMinCreateInterval = d.mMinCreateInterval;
  
  this.maxCreateInterval = d.maxCreateInterval;
  this.dMaxCreateInterval = d.dMaxCreateInterval;
  this.mMaxCreateInterval = d.mMaxCreateInterval;
};

$A.FlowerGroup.Pulse.prototype._killFlower = function(f)
{
  if(this.minCreateInterval > this.mMinCreateInterval)
    this.minCreateInterval += this.dMinCreateInterval;
    
  if(this.maxCreateInterval > this.mMaxCreateInterval)
    this.maxCreateInterval += this.dMaxCreateInterval;

  f.className = "pulse";
  $A.petals._addFlower(f);
};
$A.FlowerGroup.Pulse.prototype._removeFlower = function(f)
{
  f.d = null;
  this.sprites.removeChild(f);
};
$A.FlowerGroup.Pulse.prototype._createFlower = function()
{
  var f = $d.createElement('div'), d, st;
  
  d = f.d = {};
  
  (st = f.style).left = ((d.x = d.x0 = Math.random()*($A.wWidth - 40) + 20)|0) + 'px';
  st.top = ((d.y = -100)|0) + 'px';
  d.r = 0.15*Math.random()*$A.wWidth + 0.1*$A.wWidth;
  d.t = 0;
  d.dt = 0.10*Math.random() + 0.05;
  d.dy = 2*Math.random() + 2;
  
  this.sprites.appendChild(f);
};

$A.FlowerGroup.Pulse.prototype._render = function()
{
  var ss = this.sprites.childNodes, i = ss.length, f, wHeightSub20 = $A.wHeight + 20, d, st, _sin = Math.sin;
  
  while(i--)
  {
    d = (f = ss[i]).d;
    (st = f.style).left = ((d.x = d.r*_sin(d.t += d.dt) + d.x0)|0) - 20 + 'px';
    
    if((d.y += d.dy) > wHeightSub20)
      this._removeFlower(f);
    else  
      st.top = d.y - 20 + 'px';
  }
  
  if(--this.elCreateInterval > 0)
    return;
    
  this._createFlower();
  this.elCreateInterval = Math.random() * (this.maxCreateInterval - this.minCreateInterval) + this.minCreateInterval;  
};

$A.FlowerGroup.Swing = function()
{
  this.sprites = $d.getElementById("flowers-swing");
  
  this.minCreateInterval;
  this.dMinCreateInterval;
  this.mMinCreateInterval;
  
  this.maxCreateInterval;
  this.dMaxCreateInterval;
  this.mMaxCreateInterval;

  this.elCreateInterval = 0;
};

$A.FlowerGroup.Swing.prototype._initGame = function(dif)
{
  this.sprites.innerHTML = ''; 
  
  var d = dif['flowers-swing'];
  
  this.minCreateInterval = d.minCreateInterval;
  this.dMinCreateInterval = d.dMinCreateInterval;
  this.mMinCreateInterval = d.mMinCreateInterval;
  
  this.maxCreateInterval = d.maxCreateInterval;
  this.dMaxCreateInterval = d.dMaxCreateInterval;
  this.mMaxCreateInterval = d.mMaxCreateInterval;
};

$A.FlowerGroup.Swing.prototype._killFlower = function(f)
{
  if(this.minCreateInterval > this.mMinCreateInterval)
    this.minCreateInterval += this.dMinCreateInterval;
    
  if(this.maxCreateInterval > this.mMaxCreateInterval)
    this.maxCreateInterval += this.dMaxCreateInterval;

  f.className = "swing";
  $A.petals._addFlower(f);
};
$A.FlowerGroup.Swing.prototype._removeFlower = function(f)
{
  f.d = null;
  this.sprites.removeChild(f);
};
(function()
{
  var a0 = Math.PI/4, a1 = Math.PI*5/8, da = a1 - a0,
    cosA0 = Math.cos(a0), cosA1 = Math.cos(a1), sinA1 = Math.sin(a1),
    dy = Math.sin(a1) - Math.sin(a0), dyMul2 = dy*2,
    dx = Math.cos(a1) + Math.cos(a0),
    dt = Math.PI/50,
    _sinL = Math.sin, _cosL = Math.cos,
    piL = Math.PI;
    
  
  $A.FlowerGroup.Swing.prototype._createFlower = function()
  {
    var f = $d.createElement('div'), d, st;
    
    d = f.d = {};
    
    d.phase = 0;
    d.r = 0.25*Math.random()*$A.wWidth + 0.2*$A.wWidth;
    d.t = 0;
    
    d.x0 = Math.random()*($A.wWidth - 40) + 20;
    d.y0 = -100 - cosA0*d.r;
    
    d.x1 = dx*d.r + d.x0;
    d.y1 = d.y0 + dy*d.r;
    
    d.dt = 10/d.r;
    
    this.sprites.appendChild(f);
  };

  $A.FlowerGroup.Swing.prototype._render = function()
  {
    var ss = this.sprites.childNodes, i = ss.length, f, 
      wHeightSub20 = $A.wHeight + 20, halfPi = piL, 
      d, st,
      _sin = _sinL, _cos = _cosL,
      negHalfDa = -0.5*da, a0PlusHalfDa = a0 + 0.5*da,
      a;
    
    while(i--)
    {
      d = (f = ss[i]).d;
      
      if(d.phase === 0)
      {
        if((d.t += d.dt) >= halfPi)
        {
          d.phase = 1;
          d.x = d.x0 + d.r*cosA1;
          d.y = d.y0 + d.r*sinA1;
          d.t = 0;
          d.y0 += d.r*dyMul2;
        }
        else
        {
          d.x = d.x0 + d.r*_cos(a = negHalfDa*_cos(d.t) + a0PlusHalfDa);
          d.y = d.y0 + d.r*_sin(a);
        }
      }
      else
      {
        if((d.t += d.dt) >= halfPi)
        {
          d.phase = 0;
          d.x = d.x1 - d.r*cosA1;
          d.y = d.y1 + d.r*sinA1;
          d.t = 0;
          d.y1 += d.r*dyMul2;
        }
        else
        {
          d.x = d.x1 - d.r*_cos(a = negHalfDa*_cos(d.t) + a0PlusHalfDa);
          d.y = d.y1 + d.r*_sin(a);
        }
      }
      
      
      (st = f.style).left = (d.x|0) - 20 + 'px';
      
      if(d.y > wHeightSub20)
        this._removeFlower(f);
      else  
        st.top = (d.y|0) - 20 + 'px';
    }
    
    if(--this.elCreateInterval > 0)
      return;
      
    this._createFlower();
    this.elCreateInterval = Math.random() * (this.maxCreateInterval - this.minCreateInterval) + this.minCreateInterval;  
  };
})();


$A.FlowerGroup.Fall = function()
{
  this.sprites = $d.getElementById("flowers-fall");
  
  this.minCreateInterval;
  this.dMinCreateInterval;
  this.mMinCreateInterval;
  
  this.maxCreateInterval;
  this.dMaxCreateInterval;
  this.mMaxCreateInterval;

  this.elCreateInterval = 0;
};

$A.FlowerGroup.Fall.prototype._initGame = function(dif)
{
  this.sprites.innerHTML = ''; 
  
  var d = dif['flowers-fall'];
  
  this.minCreateInterval = d.minCreateInterval;
  this.dMinCreateInterval = d.dMinCreateInterval;
  this.mMinCreateInterval = d.mMinCreateInterval;
  
  this.maxCreateInterval = d.maxCreateInterval;
  this.dMaxCreateInterval = d.dMaxCreateInterval;
  this.mMaxCreateInterval = d.mMaxCreateInterval;
};

$A.FlowerGroup.Fall.prototype._killFlower = function(f)
{
  if(this.minCreateInterval > this.mMinCreateInterval)
    this.minCreateInterval += this.dMinCreateInterval;
    
  if(this.maxCreateInterval > this.mMaxCreateInterval)
    this.maxCreateInterval += this.dMaxCreateInterval;

  f.className = "fall";
  $A.petals._addFlower(f);
};
$A.FlowerGroup.Fall.prototype._removeFlower = function(f)
{
  f.d = null;
  this.sprites.removeChild(f);
};
$A.FlowerGroup.Fall.prototype._createFlower = function()
{
  var f = $d.createElement('div'), st, d;
  
  d = f.d = {};
  
  (st = f.style).left = (d.x = Math.random()*($A.wWidth - 40) + 20) + 'px';
  st.top = (d.y = -100) + 'px';
  d.dy = 0, d.dx = ($A.ship.x > d.x) ? 0.5 : -0.5;
  
  this.sprites.appendChild(f);
};

$A.FlowerGroup.Fall.prototype._render = function()
{
  var ss = this.sprites.childNodes, i = ss.length, f, wHeightSub20 = $A.wHeight + 20,
    sx = $A.ship.x , sy = $A.ship.y,
    dx, dy, invLen,
    _sqrt = Math.sqrt,
    st, d;
  
  while(i--)
  {
    d = (f = ss[i]).d;
    dx = sx - d.x, dy = sy - d.y;
    invLen = 0.1/_sqrt(dx*dx + dy*dy);
    d.dx += invLen*dx, d.dy += invLen*dy; + 0.2;
    
    (st = f.style).left = ((d.x += d.dx)|0) - 20 + 'px';
    
    if((d.y += d.dy) > wHeightSub20)
      this._removeFlower(f);
    else  
      st.top = (d.y|0) - 20 + 'px';
  }
  
  if(--this.elCreateInterval > 0)
    return;
    
  this._createFlower();
  this.elCreateInterval = Math.random() * (this.maxCreateInterval - this.minCreateInterval) + this.minCreateInterval;  
};

$A.FlowerGroup.Meteorite = function()
{
  this.sprites = $d.getElementById("flowers-meteorite");
  
  this.minCreateInterval;
  this.dMinCreateInterval;
  this.mMinCreateInterval;
  
  this.maxCreateInterval;
  this.dMaxCreateInterval;
  this.mMaxCreateInterval;

  this.elCreateInterval = 0;
};

$A.FlowerGroup.Meteorite.prototype._initGame = function(dif)
{
  this.sprites.innerHTML = ''; 
  
  var d = dif['flowers-meteorite'];
  
  this.minCreateInterval = d.minCreateInterval;
  this.dMinCreateInterval = d.dMinCreateInterval;
  this.mMinCreateInterval = d.mMinCreateInterval;
  
  this.maxCreateInterval = d.maxCreateInterval;
  this.dMaxCreateInterval = d.dMaxCreateInterval;
  this.mMaxCreateInterval = d.mMaxCreateInterval;
};

$A.FlowerGroup.Meteorite.prototype._killFlower = function(f)
{
  if(this.minCreateInterval > this.mMinCreateInterval)
    this.minCreateInterval += this.dMinCreateInterval;
    
  if(this.maxCreateInterval > this.mMaxCreateInterval)
    this.maxCreateInterval += this.dMaxCreateInterval;

  f.className = "meteorite";
  $A.petals._addFlower(f);
};
$A.FlowerGroup.Meteorite.prototype._removeFlower = function(f)
{
  f.d = null;
  this.sprites.removeChild(f);
};
$A.FlowerGroup.Meteorite.prototype._createFlower = function()
{
  var f = $d.createElement('div'), st, d;
  
  d = f.d = {};
  
  (st = f.style).left = (d.x = Math.random()*($A.wWidth - 40) + 20) + 'px';
  st.top = (d.y = -100) + 'px';
  d.dy = Math.random()*30 + 15, d.dx = ($A.ship.x > d.x) ? Math.random()*8 - 4 : -Math.random()*8 - 4;
  
  this.sprites.appendChild(f);
};

$A.FlowerGroup.Meteorite.prototype._render = function()
{
  var ss = this.sprites.childNodes, i = ss.length, f, wHeightSub20 = $A.wHeight + 20,
    st, d;
  
  while(i--)
  {
    d = (f = ss[i]).d;
    
    (st = f.style).left = ((d.x += d.dx)|0) - 20 + 'px';
    
    if((d.y += d.dy) > wHeightSub20)
      this._removeFlower(f);
    else  
      st.top = (d.y|0) - 20 + 'px';
  }
  
  if(--this.elCreateInterval > 0)
    return;
    
  this._createFlower();
  this.elCreateInterval = Math.random() * (this.maxCreateInterval - this.minCreateInterval) + this.minCreateInterval;  
};

$A.FlowerGroup.Queue = function()
{
  this.sprites = $d.getElementById("flowers-queue");
  
  this.minQueueLen;
  this.dMinQueueLen;
  this.mMinQueueLen;

  this.maxQueueLen;
  this.dMaxQueueLen;
  this.mMaxQueueLen;

  this.minCreateInterval;
  this.dMinCreateInterval;
  this.mMinCreateInterval;
  
  this.maxCreateInterval;
  this.dMaxCreateInterval;
  this.mMaxCreateInterval;

  this.elCreateInterval = 0;
};

$A.FlowerGroup.Queue.prototype._initGame = function(dif)
{
  this.sprites.innerHTML = ''; 
  
  var d = dif['flowers-queue'];

  this.minQueueLen = d.minQueueLen;
  this.dMinQueueLen = d.dMinQueueLen;
  this.mMinQueueLen = d.mMinQueueLen;
  
  this.maxQueueLen = d.maxQueueLen;
  this.dMaxQueueLen = d.dMaxQueueLen;
  this.mMaxQueueLen = d.mMaxQueueLen;

  this.minCreateInterval = d.minCreateInterval;
  this.dMinCreateInterval = d.dMinCreateInterval;
  this.mMinCreateInterval = d.mMinCreateInterval;
  
  this.maxCreateInterval = d.maxCreateInterval;
  this.dMaxCreateInterval = d.dMaxCreateInterval;
  this.mMaxCreateInterval = d.mMaxCreateInterval;
};

$A.FlowerGroup.Queue.prototype._detachFlower = function(f)
{
  var d = f.d;
  
  if(d.lastF && d.firstF)
  {
    d.firstF = d.lastF;
  }
  else if(d.lastF && f.nextSibling)
  {
    f.nextSibling.d.lastF = d.lastF;
    d.lastF.d.firstF = f.nextSibling;
  }
  else if(d.firstF && f.previousSibling)
  {
    f.previousSibling.d.firstF = d.firstF;
    d.firstF.d.lastF = f.previousSibling;
  }  
};
$A.FlowerGroup.Queue.prototype._killFlower = function(f)
{
  this._detachFlower(f);
  f.className = "queue";
  $A.petals._addFlower(f);
};
$A.FlowerGroup.Queue.prototype._removeFlower = function(f)
{
  this._detachFlower(f);
  this.sprites.removeChild(f);
};
$A.FlowerGroup.Queue.prototype._createQueue = function()
{
  var len = (Math.random()*(this.maxQueueLen - this.minQueueLen) + this.minQueueLen)|0, i = len,
    x0 = Math.random()*(0.5*$A.wWidth -  40) + 20, x1 = x0 + (0.4*Math.random() + 0.1)*$A.wWidth,
    a0 = Math.random()*Math.PI, a1 = Math.random()*Math.PI,
    dx0 = Math.cos(a0), dy0 = Math.sin(a0), 
    dx1 = Math.cos(a1), dy1 = Math.sin(a1), 
    f, sprites = this.sprites, d;
    
  var xStep = (x1 - x0)/(len - 1), x = x0;
  
  while(i--)
  {
    f = $d.createElement('div');
    
    d = f.d = {};
    
    f.style.left = (d.x = d.ox = (x += xStep)) - 20 + 'px';
    f.style.top = (d.y = d.oy = -100) - 20 + 'px';
    d.dx = d.dy = 0;
    
    sprites.appendChild(f);
  }

  var ss = sprites.childNodes, firstF = ss[ss.length - len], lastF = ss[ss.length - 1];
  
  (d = firstF.d).dx = dx0, d.dy = dy0, d.lastF = lastF; 
  (d = lastF.d).dx = dx1, d.dy = dy1, d.firstF = firstF; 
};

$A.FlowerGroup.Queue.prototype._render = function()
{
  var sprites = this.sprites,
    firstF = sprites.firstChild, lastF, f, 
    wHeightSub20 = $A.wHeight + 20,
    m, n,
    x, y,
    d , st;
  
  while(firstF)
  {
    lastF = firstF.d.lastF;

    (st = firstF.style).left = ((x = (d = firstF.d).x += d.dx)|0) - 20 + 'px'; 
    st.top = ((y = d.y += (d.dy += 0.1))|0) - 20 + 'px'; 
    
    if(firstF === lastF)
    {
      if(firstF.y > wHeightSub20)
      {
        f = firstF, firstF = firstF.nextSibling;
        sprites.removeChild(f);
      }
      else
      {
        firstF = firstF.nextSibling;
      }
      
      continue;
    }
    
    (st = lastF.style).left = (((d = lastF.d).x += d.dx)|0) - 20 + 'px'; 
    st.top = ((d.y += (d.dy += 0.1))|0) - 20 + 'px'; 
    
    f = firstF.nextSibling, nF = f.nextSibling;  
      
    if(f.firstF)
    {
      if(firstF.d.y > wHeightSub20 && lastF.d.y > wHeightSub20)
      {
        sprites.removeChild(firstF);
        sprites.removeChild(lastF);
      }

      firstF = nF;
      
      continue;
    }
    
    m = n = 0;
    
    while(f !== lastF)
    {
      (st = f.style).left = (((d = f.d).ox = d.x, x = d.x = 0.5*(x + nF.d.x))|0) - 20 + 'px';
      d.dx = d.x - d.ox;
      
      st.top = ((d.oy = d.y, y = d.y = 0.5*(y + nF.d.y))|0) - 20 + 'px';
      d.dy = d.y - d.oy;
      
      ++n;
      
      if(y > wHeightSub20)
        ++m;
        
      f = nF, nF = f.nextSibling;
    }
    
    // all flowers out of screen
    if(n > 0 && n === m)
    {
      f = firstF, firstF = nF;
      
      while(f !== firstF)
      {
        nF = f.nextSibling;
        sprites.removeChild(f);
        f = nF;
      }
    }
    else
    {
      firstF = nF;
    }  
  }
  
  if(--this.elCreateInterval > 0)
    return;
    
  this._createQueue();
  this.elCreateInterval = Math.random() * (this.maxCreateInterval - this.minCreateInterval) + this.minCreateInterval;  
};

$A.Grass = function()
{
  this.tY = this.bY = -100;
  
  this.tlSprite = $d.getElementById("grass-tl");
  this.trSprite = $d.getElementById("grass-tr");
  this.blSprite = $d.getElementById("grass-bl");
  this.brSprite = $d.getElementById("grass-br");
};

$A.Grass.prototype._render = function()
{
  if((this.tY += 4) < 0)
    this.tY -= 100;
  
  this.tlSprite.style.backgroundPosition = 
  this.trSprite.style.backgroundPosition = 
    "0px " + this.tY + 'px';
  
  if((this.bY += 2) < 0)
    this.bY -= 100;
    
  this.blSprite.style.backgroundPosition = 
  this.brSprite.style.backgroundPosition = 
    "0px " + this.bY + 'px';
};

$A.FlowerGroups = function()
{
  this.groups =
  [
    new $A.FlowerGroup.Pulse(),
    new $A.FlowerGroup.Fall(),
    new $A.FlowerGroup.Queue(),
    new $A.FlowerGroup.Swing(),
    new $A.FlowerGroup.Meteorite()
  ];
};

$A.FlowerGroups.prototype._initGame = function(dif)
{
  var gs = this.groups, i = gs.length;
  
  while(i--)
    gs[i]._initGame(dif);
};

$A.FlowerGroups.prototype._render=function()
{
  var gs = this.groups, i = gs.length;
  
  while(i--)
    gs[i]._render();
};

$A.Controller = {};

$A.Controller.Kbd = function()
{
  this.isLeftKey;
  this.isRightKey;
  
  this._onKeyDown = this._onKeyDown._fBind(this);
  this._onKeyUp = this._onKeyUp._fBind(this);
};

$A.Controller.Kbd.prototype._activete = function()
{
  this.isLeftKey = this.isRightKey = false;

  _dom($d).bind('keydown', this._onKeyDown);
  _dom($d).bind('keyup', this._onKeyUp);
};
$A.Controller.Kbd.prototype._deactivete = function()
{
  _dom($d).unbind('keydown', this._onKeyDown);
  _dom($d).unbind('keyup', this._onKeyUp);
};

$A.Controller.Kbd.prototype._process = function()
{
  if(!(this.isLeftKey + this.isRightKey)&1)
    return;

  if(this.isLeftKey)
    $A.ship._moveLeft();
  else if(this.isRightKey)
    $A.ship._moveRight();
};

$A.Controller.Kbd.prototype._onKeyDown = function(e)
{
  switch(e.keyCode)
  {
    case 37: // left
      this.isLeftKey = true;
      return $A.ship.isPause;
    case 39: // right
      this.isRightKey = true;
      return $A.ship.isPause;
  }
};
$A.Controller.Kbd.prototype._onKeyUp = function(e)
{
  switch(e.keyCode)
  {
    case 37: // left
      this.isLeftKey = false;
      return $A.ship.isPause;
    case 39: // right
      this.isRightKey = false;
      return $A.ship.isPause;
    case 32: // space fire
    case 16: // shift fire too
    case 13: // enter fire again
      $A.ship._fireBullet();
      return $A.ship.isPause;
    case 27: // esc - pause
    case 40: // down - pause
      $A.ship._togglePause();
      return $A.ship.isPause;
  }
};

$A.Controller.Mouse = function()
{
  this.mouseX;
  
  this._onMouseMove = this._onMouseMove._fBind(this);
  this._onMouseUp = this._onMouseUp._fBind(this);
};

$A.Controller.Mouse.prototype._activete = function()
{
  this.mouseX = null;
  
  _dom($d).bind('mouseup', this._onMouseUp);
  _dom($d).bind('mousemove', this._onMouseMove);
};
$A.Controller.Mouse.prototype._deactivete = function()
{
  _dom($d).unbind('mouseup', this._onMouseUp);
  _dom($d).unbind('mousemove', this._onMouseMove);
};

$A.Controller.Mouse.prototype._process = function()
{
  var diff = this.mouseX - $A.ship.x;
  
  if(diff >= 15)
    $A.ship._moveRight();
  else if(diff <= -15)
    $A.ship._moveLeft();
};

$A.Controller.Mouse.prototype._onMouseMove = function(e)
{
  this.mouseX = e.clientX;
};

if($d.recalc)
{
  $A.Controller.Mouse.prototype._onMouseUp = function(e)
  {
    if(e.button&1)
      $A.ship._fireBullet();
    else if(e.button&2)
      $A.ship._togglePause();

    return false;
  };
}
else
{
  $A.Controller.Mouse.prototype._onMouseUp = function(e)
  {
    if(e.button === 0)
      $A.ship._fireBullet();
    else if(e.button === 2)
      $A.ship._togglePause();
    
    return false;
  };
}  

$A.Controller.Touch = function()
{
  this.touchStartY;
  this.lastTouchX;
  
  this._onTouchStart = this._onTouchStart._fBind(this);
  this._onTouchEnd = this._onTouchEnd._fBind(this);
};

$A.Controller.Touch.prototype._activete = function()
{
  this.touchStartY = this.lastTouchX = null;
  
  _dom($d).bind('touchstart', this._onTouchStart);
  _dom($d).bind('touchend', this._onTouchEnd);
};
$A.Controller.Touch.prototype._deactivete = function()
{
  _dom($d).unbind('touchstart', this._onTouchStart);
  _dom($d).unbind('touchend', this._onTouchEnd);
};

$A.Controller.Touch.prototype._process = function()
{
  var diff = this.lastTouchX - $A.ship.x;
  
  if(diff >= 15)
    $A.ship._moveRight();
  else if(diff <= -15)
    $A.ship._moveLeft();
};

$A.Controller.Touch.prototype._onTouchStart = function(e)
{
  this.touchStartY = e.changedTouches[0].clientY;

  return false;
};

$A.Controller.Touch.prototype._onTouchEnd = function(e)
{
  this.lastTouchX = e.changedTouches[0].clientX;
  
  // click
  if(Math.abs(this.touchStartY - e.changedTouches[0].clientY) < 10)
    $A.ship._fireBullet();
  // gesture finger up/down
  else
    $A.ship._togglePause();

  return false;
};


$A.fpsDelay = 30, $A.fpsLastTime = 0;
$A.score = 0;

$A._gameThread = function()
{
  var t0 = +new Date();
  
  $A.controller._process();
  $A.ship._render();
  $A.bullets._render();
  $A.petals._render();
  $A.flowerGroups._render();
  $A.grass._render();
  $A.bonuses._render();
  
  var t = +new Date(), epTime = $A.fpsDelay - (t - t0);
  
  $d.getElementById("fps").firstChild.data = (1000/(t - t0)).toFixed(2);
  $d.getElementById("score").firstChild.data = "" + $A.score;
  //$A.fpsLastTime = t;
  
  if(epTime < 0)
    epTime = 0;
  
  setTimeout($A._gameThread, epTime);
};

$A._setController = function()
{
  var li = this.parentNode, name = li.getAttribute('controller');
  
  if($A.controller.name === name)
    return false;
    
  var ul = li.parentNode, lis = ul.childNodes, lii = lis.length;

  while(lii-- &&  (""+lis[lii].className).indexOf('active') === -1)
    ;
    
  lis[lii].className = lis[lii].className.replace(/active/g, '');
  li.className += " active";
  
  $A.controller._deactivete();
  $A.controller = new (eval(name));
  $A.controller._activete();
  $A.controller.name = name;
  
  return false;
};

$A._newGame = function(name)
{
  var dif = difMap[name];
  
  $A.score = 0;
  $A.gameDifName = name;
  $A.ship._initGame(dif);
  $A.bullets._initGame(dif);
  $A.petals._initGame(dif);
  $A.flowerGroups._initGame(dif);
  $A.bonuses._initGame(dif);
  
  $A.gameStartTime = +new Date();
};

$A._gameOver = function()
{
  $d.getElementById('menu-title').firstChild.data = $A.gameDifName + ' :: game over';
  $A._show('scoreSubmitDialog');
};

$A._show = function(id)
{
  $d.getElementById(id).style.display = '';
};
$A._hide = function(id)
{
  $d.getElementById(id).style.display = 'none';
};

$A._submitScore = function()
{
  var iframe = $d.getElementById('iframeMenu-iframe');
  
  iframe.src = $A.serverUrl + 
    '?nick=' + encodeURIComponent(($d.getElementById('scores-submit-nick').value)) +
    '&score=' + $A.score +
    '&dif=' + $A.gameDifName +
    '&time=' + ((0.001*((new Date()) - $A.gameStartTime))|0) +
    '&rnd=' + (0.1*Math.random()).toFixed(6).slice(2)
    ;
  
  $A._hide('scoreSubmitDialog');
  $A._show('iframeMenu');
};

$A._showHiScores = function()
{
  var iframe = $d.getElementById('iframeMenu-iframe');
  
  iframe.src = $A.serverUrl + '?' +
    '&rnd=' + (0.1*Math.random()).toFixed(6).slice(2)
    ;
  
  $A._hide('menu');
  $A._show('iframeMenu');
};

$A._onWindowResize = function(e)
{
  $A.wWidth = $w.innerWidth || $d.documentElement.clientWidth || $d.body.clientWidth;
  $A.wHeight = $w.innerHeight || $d.documentElement.clientHeight || $d.body.clientHeight;
  $A.ship.y = $A.wHeight - 20;
  //console.log($A.wWidth, $A.wHeight);
};

_dom($d).ready(function(){  
  /*
  $jb.Loader._scope().
  _require("_3rdParty/jquery-ui-1.7.2.custom.min.js", true).
  //_require("http://ajax.googleapis.com/ajax/libs/jqueryui/1.7.2/jquery-ui.min.js", true).
  //_require("http://nomorerats.byethost8.com/p/flowers-game.js/_3rdParty/jquery-ui-1.7.2.custom.min.js", true).
  _completed*/(function(){

  if(!$d.getElementsByTagName('audio')[0].play)
  {
    _dom('.sound').hide();
    $A._playSound = $jb._null;
  }
  else
  {
    setTimeout(function()
    {
      $A._setSoundVolume(50);
    }, 100);
    _dom('#soundLvl').slider(
      {
        min: 0.0,
        max: 100.0,
        value: 50.0,
        slide: function(e, ui)
        {
          _dom(this).find('.ui-slider-handle').text((ui.value === 0) ? 'off' : ui.value + '%');
        },
        change: function(e, ui)
        {
          $A._setSoundVolume(ui.value);
        }
      }
    );
    _dom('#soundLvl').find('.ui-slider-handle').text('50%');
    $A._playSound = $A.__playSound;
  }

  })();
});
$A._main = function()
{
  try
  {
    $d.execCommand("BackgroundImageCache", false, true);
  }
  catch(err)
  {
  
  }
  $A._playSound = $jb._null;
  
  $A.controller = new $A.Controller.Kbd();
  $A.controller._activete();
  $A.controller.name = '$A.Controller.Kbd';
  
  $A.ship = new $A.Ship();

  _dom($w).bind('resize', $A._onWindowResize);
  $A._onWindowResize();

  $A.flowerGroups = new $A.FlowerGroups();
  $A.bonuses = new $A.Bonuses();
  
  $A.bullets = new $A.Bullets();
  $A.petals = new $A.Petals();
  $A.grass = new $A.Grass();

  $A._newGame('easy');
  $A.ship._togglePause();
  
  $A._gameThread();
};  

//_dom($w).bind("load", $A._main);
if($d.body)
  $A._main();
else  
  _dom($d).ready($A._main);

})(this, this.$jb = {_null: function(){}}, this.$A = {});

/*
var Class = function(a, b){ this.a = a; this.b = b; };
var _create = function(){ var a = arguments; return new (function(){ Class.apply(this, a); }); };
_create(1, 2);
jQuery.chapterFlipper = function(){ var a = arguments; return new (function(){ chapterFlipper.apply(this, a); }); };
*/
