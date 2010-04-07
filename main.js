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

var $G = this, $w = window, $d = document;

$G.wWidth, $G.wHeight;

$G.controller;

$G.ship;
$G.bullets;
$G.petals;
$G.flowerGroups;
$G.grass;

$G._null = function()
{

};

$G.Unit = function()
{

};


$G.Bullets = function()
{
  this.sprites = $d.getElementById("bullets");
};

$G.Bullets.prototype._initGame = function(dif)
{
  this.sprites.innerHTML = '';
};

$G.Bullets.prototype._createBullet=function(x, y, dx, dy)
{
  var b = $d.createElement("div"), st, d;
  
  d = b.d = new Object();
  
  (st = b.style).left = (d.x = x) - 3 +'px';
  st.top = (d.y = y) - 3 + 'px';
  d.dx = dx;
  d.dy = dy;
  
  return this.sprites.appendChild(b);
};

$G.Bullets.prototype._removeBullet=function(b)
{
  b.d = null;
  this.sprites.removeChild(b);
};

$G.Bullets.prototype._render=function()
{
  var bs = this.sprites.childNodes, bsLen = bs.length, bi = bsLen, b, x, y, wWidthSub3 = $G.wWidth-3, d, st;
  
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
          this._removeBullet(b)
        else
          st.left = x - 3 + 'px';
      }  
    }
  }
  
  // collision detection
  var fgs = $G.flowerGroups.groups, fgi = fgs.length, fg, fs, fi, temp, d;
  
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
          this._removeBullet(b)
          
          break;
        }
      }
    }
  }
};

$G.Ship=function()
{
  this.sprite = $d.getElementById("ship");
  this.lifeCountEl = $d.getElementById("lifeCount").firstChild;
  this.menuEl = $d.getElementById("menu");
  this.menuTitleEl = $d.getElementById("menu-title").firstChild;
  this.sawEl = $d.getElementById("ship-saw")
  
  this.lifeCount;
  
  this.maxAModeTime;
  this.aModeElTime;

  this.maxSawTime;
  this.maxSawFlowersCount
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
  
  var self = this;
  
  this.__restoreSpriteClassThreadBind = function(){ self.__restoreSpriteClassThread(); };
};

$G.Ship.prototype.__stopRestoreClassThread = function()
{  
  if(this.restoreSpriteClassThreadId_ != null)
  {
    clearInterval(this.restoreSpriteClassThreadId_);
    this.restoreSpriteClassThreadId_ = null;
  }
};
$G.Ship.prototype.__restoreSpriteClassThread = function()
{
  this.sprite.className = this.baseSpriteClass;
  this.restoreSpriteClassThreadId_ = null;
};

$G.Ship.prototype._initGame = function(dif)
{
  var d = dif['ship'];
  
  this.maxAModeTime = d.maxAModeTime;
  this.maxSawFlowersCount = d.maxSawFlowersCount;
  this.maxSawTime = d.maxSawTime;
  
  this.lifeCountEl.data = this.lifeCount = 3;
  
  this.__aModeOff();
  this.__sawModeOff();

  this.sprite.className = this.baseSpriteClass = '';

  this.y = $G.wHeight - 20;
  this.sprite.style.left = (this.x = 0.5*$G.wWidth) - 20 + 'px';
  
  this.__pauseModeOff();
  this._enablePause();
};

$G.Ship.prototype._kill = function()
{
  this.__aModeOff();
  this.__sawModeOff();
  
  this.__stopRestoreClassThread();
  this.baseSpriteClass = '';
  this.sprite.className = this.baseSpriteClass + " explode";

  this.__passiveModeOn();
  this._render = $G._null;

  if(--this.lifeCount === -1)
  {
    this._disablePause();
    
    return $G._gameOver();
  }
  
  this.lifeCountEl.data = this.lifeCount;
  
  this.restoreSpriteClassThreadId_ = setTimeout(this.__restoreSpriteClassThreadBind, 3000);

  var self = this;
  
  setTimeout(
    function()
    {
      self.sprite.style.bottom = '-52px';
      self.__sawModeOn();
      self._render = self.__renderWakeUp;
    },
    3000
  );
};

$G.Ship.prototype.__fireBullet = function()
{
  // center
  bullets._createBullet(this.x, $G.wHeight - 40 - 6, 0, -20);
  
  if(this.restoreSpriteClassThreadId_ == null)
  {
    this.sprite.className += " fire";
    this.restoreSpriteClassThreadId_ = setTimeout(this.__restoreSpriteClassThreadBind, 100);
  }
};

$G.Ship.prototype.__fireBulletA = function()
{
  // center
  $G.bullets._createBullet(this.x, $G.wHeight - 40 - 6, 0, -20);
  
  // left
  $G.bullets._createBullet(this.x - 3, $G.wHeight - 40 - 6, -8, -18);

  // right
  $G.bullets._createBullet(this.x + 3, $G.wHeight - 40 - 6, +8, -18);
  
  if(this.restoreSpriteClassThreadId_ == null)
  {
    this.sprite.className += " fire";
    this.restoreSpriteClassThreadId_ = setTimeout(this.__restoreSpriteClassThreadBind, 100);
  }
};

$G.Ship.prototype.__pauseModeOn = function()
{  
  this.isPause = true;
  this.menuTitleEl.data = $G.gameDifName + " :: Pause";
  this.menuEl.style.display = "";
  this._render = this.__renderSleep;
  this.__passiveModeOn();
};
$G.Ship.prototype.__pauseModeOff = function()
{  
  this.isPause = false;
  this.menuEl.style.display = 'none';
  this.sprite.style.bottom = '-52px';
  this._render = this.__renderWakeUp;
};
$G.Ship.prototype.__togglePause = function()
{
  if(this.isPause = !this.isPause)
    this.__pauseModeOn();
  else
    this.__pauseModeOff();
};
$G.Ship.prototype._disablePause = function()
{
  this._togglePause = $G._null;
};
$G.Ship.prototype._enablePause = function()
{
  this._togglePause = this.__togglePause;
};

$G.Ship.prototype.__passiveModeOn = function()
{
  this._moveLeft = this._moveRight = this._fireBullet = this._sawModeOn = this._aModeOn = this._addLife = $G._null;
};
$G.Ship.prototype.__passiveModeOff = function()
{
  this._render = (this.sawModeFlowersElCount > 0) ? this.__renderSaw : this.__render;
  this._fireBullet = (this.aModeElTime > 0) ? this.__fireBulletA : this.__fireBullet;
  this._addLife = this.__addLife;
  
  this._sawModeOn = this.__sawModeOn;
  this._aModeOn = this.__aModeOn;
  
  this._moveLeft = this.__moveLeft;
  this._moveRight= this.__moveRight;
};

$G.Ship.prototype.__aModeOn = function()
{
  this.aModeElTime = this.maxAModeTime;

  this._fireBullet = this.__fireBulletA;

  this.__stopRestoreClassThread();
  this.sprite.className = this.baseSpriteClass = 'a';
};
$G.Ship.prototype.__aModeOff = function()
{
  this.aModeElTime = 0;

  this._fireBullet = this.__fireBullet;

  this.__stopRestoreClassThread();
  this.sprite.className = this.baseSpriteClass = '';
};

$G.Ship.prototype.__sawModeOn = function()
{
  this.sawModeElTime = this.maxSawTime;
  this.sawModeFlowersElCount = this.maxSawFlowersCount;
  this._render = this.__renderSaw;
  
  this.sawEl.style.display = '';
};
$G.Ship.prototype.__sawModeOff = function()
{
  this.sawModeFlowersElCount = this.sawModeElTime = 0;
  this._render = this.__render;
  this.sawEl.style.display = 'none';
};

$G.Ship.prototype.__addLife = function()
{
  this.lifeCountEl.data = "" + (++this.lifeCount);
};

$G.Ship.prototype.__moveLeft = function()
{
  var x = this.x - 15;
  
  if(x <= 20)
    x = 20;
  
  if(this.x !== x)
    this.sprite.style.left = (this.x = x)- 20 + 'px';
};
$G.Ship.prototype.__moveRight = function()
{
  var x = this.x + 15;
  
  if(x >= $G.wWidth - 20)
    x = $G.wWidth - 20;
  
  if(this.x !== x)
    this.sprite.style.left = (this.x = x)- 20 + 'px';
};

$G.Ship.prototype.__renderSleep=function()
{
  var st = this.sprite.style, y = st.bottom.slice(0, -2) - 1;
  
  if(y < -51)
  {
    y = -51;
    this._render = $G._null;
  }

  st.bottom = y + 'px';
};
$G.Ship.prototype.__renderWakeUp = function()
{
  var st = this.sprite.style, y = +st.bottom.slice(0, -2) + 1;
  
  if(y > 0)
  {
    y = 0;
    this.__passiveModeOff();
  }

  st.bottom = y + 'px';
};
$G.Ship.prototype.__render = function()
{
  // collision detection
  var fgs = $G.flowerGroups.groups, fgi = fgs.length, fg, fs, fi, temp, d, x = this.x, y = this.y;
  
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

$G.Ship.prototype.__renderSaw = function()
{
  // collision detection
  var fgs = $G.flowerGroups.groups, fgi = fgs.length, fg, fs, fi, temp, d, x = this.x, y = this.y;
  
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


$G.FlowerGroup={};


$G.Bonuses = function()
{
  this.sprites = $d.getElementById("bonuses");
  
  this.bonusChanse;

};

$G.Bonuses.prototype._initGame = function(dif)
{
  this.sprites.innerHTML = '';
  this.bonusChanse = dif['bonuses'].bonusChanse;
};

$G.Bonuses.prototype._createBonus = function(x, y)
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
  
  d = b.d = new Object();
  
  (st = b.style).left = (d.x = x) - 20 + 'px';
  st.top = (d.y = y) - 20 + 'px';
  
  this.sprites.appendChild(b);
};

$G.Bonuses.prototype._removeBonus = function(b)
{
  b.d = null;
  this.sprites.removeChild(b);
};

$G.Bonuses.prototype._render = function()
{
  var bs=this.sprites.childNodes, bi=bs.length, b, wHeightSub20 = $G.wHeight + 20, d,
    x = $G.ship.x, y = $G.ship.y,
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
      switch(b.className)
      {
        case 'p':
          $G.ship._aModeOn();
          break;
        case 'new_life':
          $G.ship._addLife();
          break;
        case 'saw':
          $G.ship._sawModeOn();
          break;
      }

      this._removeBonus(b);
    }
  }
};

$G.Petals = function()
{
  this.sprites = $d.getElementById("petals");
};

$G.Petals.prototype._initGame = function(dif)
{
  this.sprites.innerHTML = '';
};

$G.Petals.prototype._removePetals = function(p)
{
  p.d = null;
  this.sprites.removeChild(p);
};
$G.Petals.prototype._addFlower = function(f)
{
  ++$G.score;
  
  $G.bonuses._createBonus(f.d.x, f.d.y);
  
  f.d.t = 33;
  this.sprites.appendChild(f);
};
$G.Petals.prototype._render = function()
{
  var ps=this.sprites.childNodes, pi=ps.length, p, wHeightSub20 = $G.wHeight + 20, d;
  
  while(pi--)
  {
    p = ps[pi];
    
    if(++(d = p.d).y > wHeightSub20 || --d.t === 0)
      this._removePetals(p);
    else  
      p.style.top = d.y - 20 +'px';
  }
};

$G.FlowerGroup.Pulse = function()
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

$G.FlowerGroup.Pulse.prototype._initGame = function(dif)
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

$G.FlowerGroup.Pulse.prototype._killFlower = function(f)
{
  if(this.minCreateInterval > this.mMinCreateInterval)
    this.minCreateInterval += this.dMinCreateInterval;
    
  if(this.maxCreateInterval > this.mMaxCreateInterval)
    this.maxCreateInterval += this.dMaxCreateInterval;

  f.className = "pulse";
  $G.petals._addFlower(f);
};
$G.FlowerGroup.Pulse.prototype._removeFlower = function(f)
{
  f.d = null;
  this.sprites.removeChild(f);
};
$G.FlowerGroup.Pulse.prototype._createFlower = function()
{
  var f = $d.createElement('div'), d, st;
  
  d = f.d = new Object();
  
  (st = f.style).left = (d.x = d.x0 = Math.random()*($G.wWidth - 40) + 20) + 'px';
  st.top = (d.y = -100) + 'px';
  d.r = 0.15*Math.random()*$G.wWidth + 0.1*$G.wWidth;
  d.t = 0;
  d.dt = 0.10*Math.random() + 0.05;
  d.dy = 2*Math.random() + 2;
  
  this.sprites.appendChild(f);
};

$G.FlowerGroup.Pulse.prototype._render = function()
{
  var ss = this.sprites.childNodes, i = ss.length, f, wHeightSub20 = $G.wHeight + 20, d, st, _sin = Math.sin;
  
  while(i--)
  {
    d = (f = ss[i]).d;
    (st = f.style).left = (d.x = d.r*_sin(d.t += d.dt) + d.x0) - 20 + 'px';
    
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

$G.FlowerGroup.Swing = function()
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

$G.FlowerGroup.Swing.prototype._initGame = function(dif)
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

$G.FlowerGroup.Swing.prototype._killFlower = function(f)
{
  if(this.minCreateInterval > this.mMinCreateInterval)
    this.minCreateInterval += this.dMinCreateInterval;
    
  if(this.maxCreateInterval > this.mMaxCreateInterval)
    this.maxCreateInterval += this.dMaxCreateInterval;

  f.className = "swing";
  $G.petals._addFlower(f);
};
$G.FlowerGroup.Swing.prototype._removeFlower = function(f)
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
    dt = Math.PI/50;
    
  
  $G.FlowerGroup.Swing.prototype._createFlower = function()
  {
    var f = $d.createElement('div'), d, st;
    
    d = f.d = new Object();
    
    d.phase = 0;
    d.r = 0.25*Math.random()*$G.wWidth + 0.2*$G.wWidth;
    d.t = 0;
    
    d.x0 = Math.random()*($G.wWidth - 40) + 20;
    d.y0 = -100 - cosA0*d.r;
    
    d.x1 = dx*d.r + d.x0;
    d.y1 = d.y0 + dy*d.r
    
    d.dt = 10/d.r;
    
    this.sprites.appendChild(f);
  };

  $G.FlowerGroup.Swing.prototype._render = function()
  {
    var ss = this.sprites.childNodes, i = ss.length, f, 
      wHeightSub20 = $G.wHeight + 20, halfPi = Math.PI, 
      d, st,
      _sin = Math.sin, _cos = Math.cos,
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
      
      
      (st = f.style).left = d.x - 20 + 'px';
      
      if(d.y > wHeightSub20)
        this._removeFlower(f);
      else  
        st.top = d.y - 20 + 'px';
    }
    
    if(--this.elCreateInterval > 0)
      return;
      
    this._createFlower();
    this.elCreateInterval = Math.random() * (this.maxCreateInterval - this.minCreateInterval) + this.minCreateInterval;  
  };
})();


$G.FlowerGroup.Fall = function()
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

$G.FlowerGroup.Fall.prototype._initGame = function(dif)
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

$G.FlowerGroup.Fall.prototype._killFlower = function(f)
{
  if(this.minCreateInterval > this.mMinCreateInterval)
    this.minCreateInterval += this.dMinCreateInterval;
    
  if(this.maxCreateInterval > this.mMaxCreateInterval)
    this.maxCreateInterval += this.dMaxCreateInterval;

  f.className = "fall";
  $G.petals._addFlower(f);
};
$G.FlowerGroup.Fall.prototype._removeFlower = function(f)
{
  f.d = null;
  this.sprites.removeChild(f);
};
$G.FlowerGroup.Fall.prototype._createFlower = function()
{
  var f = $d.createElement('div'), st, d;
  
  d = f.d = new Object();
  
  (st = f.style).left = (d.x = Math.random()*($G.wWidth - 40) + 20) + 'px';
  st.top = (d.y = -100) + 'px';
  d.dy = 0, d.dx = ($G.ship.x > d.x) ? 0.5 : -0.5;
  
  this.sprites.appendChild(f);
};

$G.FlowerGroup.Fall.prototype._render = function()
{
  var ss = this.sprites.childNodes, i = ss.length, f, wHeightSub20 = $G.wHeight + 20,
    sx = $G.ship.x , sy = $G.ship.y,
    dx, dy, invLen,
    _sqrt = Math.sqrt,
    st, d;
  
  while(i--)
  {
    d = (f = ss[i]).d;
    dx = sx - d.x, dy = sy - d.y;
    invLen = 0.1/_sqrt(dx*dx + dy*dy);
    d.dx += invLen*dx, d.dy += invLen*dy; + 0.2;
    
    (st = f.style).left = (d.x += d.dx) - 20 + 'px';
    
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

$G.FlowerGroup.Meteorite = function()
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

$G.FlowerGroup.Meteorite.prototype._initGame = function(dif)
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

$G.FlowerGroup.Meteorite.prototype._killFlower = function(f)
{
  if(this.minCreateInterval > this.mMinCreateInterval)
    this.minCreateInterval += this.dMinCreateInterval;
    
  if(this.maxCreateInterval > this.mMaxCreateInterval)
    this.maxCreateInterval += this.dMaxCreateInterval;

  f.className = "meteorite";
  $G.petals._addFlower(f);
};
$G.FlowerGroup.Meteorite.prototype._removeFlower = function(f)
{
  f.d = null;
  this.sprites.removeChild(f);
};
$G.FlowerGroup.Meteorite.prototype._createFlower = function()
{
  var f = $d.createElement('div'), st, d;
  
  d = f.d = new Object();
  
  (st = f.style).left = (d.x = Math.random()*($G.wWidth - 40) + 20) + 'px';
  st.top = (d.y = -100) + 'px';
  d.dy = Math.random()*30 + 15, d.dx = ($G.ship.x > d.x) ? Math.random()*8 - 4 : -Math.random()*8 - 4;
  
  this.sprites.appendChild(f);
};

$G.FlowerGroup.Meteorite.prototype._render = function()
{
  var ss = this.sprites.childNodes, i = ss.length, f, wHeightSub20 = $G.wHeight + 20,
    st, d;
  
  while(i--)
  {
    d = (f = ss[i]).d;
    
    (st = f.style).left = (d.x += d.dx) - 20 + 'px';
    
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

$G.FlowerGroup.Queue = function()
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

$G.FlowerGroup.Queue.prototype._initGame = function(dif)
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

$G.FlowerGroup.Queue.prototype._detachFlower = function(f)
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
$G.FlowerGroup.Queue.prototype._killFlower = function(f)
{
  this._detachFlower(f);
  f.className = "queue";
  $G.petals._addFlower(f);
};
$G.FlowerGroup.Queue.prototype._removeFlower = function(f)
{
  this._detachFlower(f);
  this.sprites.removeChild(f);
};
$G.FlowerGroup.Queue.prototype._createQueue = function()
{
  var len = (Math.random()*(this.maxQueueLen - this.minQueueLen) + this.minQueueLen)|0, i = len,
    x0 = Math.random()*(0.5*$G.wWidth -  40) + 20, x1 = x0 + (0.4*Math.random() + 0.1)*$G.wWidth,
    a0 = Math.random()*Math.PI, a1 = Math.random()*Math.PI,
    dx0 = Math.cos(a0), dy0 = Math.sin(a0), 
    dx1 = Math.cos(a1), dy1 = Math.sin(a1), 
    f, sprites = this.sprites, d;
    
  var xStep = (x1 - x0)/(len - 1), x = x0;
  
  while(i--)
  {
    f = $d.createElement('div');
    
    d = f.d = new Object();
    
    f.style.left = (d.x = d.ox = (x += xStep)) - 20 + 'px';
    f.style.top = (d.y = d.oy = -100) - 20 + 'px';
    d.dx = d.dy = 0;
    
    sprites.appendChild(f);
  }

  var ss = sprites.childNodes, firstF = ss[ss.length - len], lastF = ss[ss.length - 1];
  
  (d = firstF.d).dx = dx0, d.dy = dy0, d.lastF = lastF; 
  (d = lastF.d).dx = dx1, d.dy = dy1, d.firstF = firstF; 
};

$G.FlowerGroup.Queue.prototype._render = function()
{
  var sprites = this.sprites,
    firstF = sprites.firstChild, lastF, f, 
    wHeightSub20 = $G.wHeight + 20,
    m, n,
    x, y,
    d , st;
  
  while(firstF)
  {
    lastF = firstF.d.lastF;

    (st = firstF.style).left = (x = (d = firstF.d).x += d.dx) - 20 + 'px'; 
    st.top = (y = d.y += (d.dy += 0.1)) - 20 + 'px'; 
    
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
    
    (st = lastF.style).left = ((d = lastF.d).x += d.dx) - 20 + 'px'; 
    st.top = (d.y += (d.dy += 0.1)) - 20 + 'px'; 
    
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
      (st = f.style).left = ((d = f.d).ox = d.x, x = d.x = 0.5*(x + nF.d.x)) - 20 + 'px';
      d.dx = d.x - d.ox;
      
      st.top = (d.oy = d.y, y = d.y = 0.5*(y + nF.d.y)) - 20 + 'px';
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

$G.Grass = function()
{
  this.tY = this.bY = -100;
  
  this.tlSprite = $d.getElementById("grass-tl");
  this.trSprite = $d.getElementById("grass-tr");
  this.blSprite = $d.getElementById("grass-bl");
  this.brSprite = $d.getElementById("grass-br");
};

$G.Grass.prototype._render = function()
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

$G.FlowerGroups = function()
{
  this.groups =
  [
    new FlowerGroup.Pulse(),
    new FlowerGroup.Fall(),
    new FlowerGroup.Queue(),
    new FlowerGroup.Swing(),
    new FlowerGroup.Meteorite()
  ];
};

$G.FlowerGroups.prototype._initGame = function(dif)
{
  var gs = this.groups, i = gs.length;
  
  while(i--)
    gs[i]._initGame(dif);
};

$G.FlowerGroups.prototype._render=function()
{
  var gs = this.groups, i = gs.length;
  
  while(i--)
    gs[i]._render();
};

$G.Controller = {};

$G.Controller.Kbd = function()
{
  this.isLeftKey;
  this.isRightKey;
  
  var self = this;
  
  this._onKeyDownBind = function(e) { self._onKeyDown(e); };
  this._onKeyUpBind = function(e) { self._onKeyUp(e); };
};

$G.Controller.Kbd.prototype._activete = function()
{
  this.isLeftKey = this.isRightKey = false;
  $d.onkeydown = this._onKeyDownBind;
  $d.onkeyup = this._onKeyUpBind;
};
$G.Controller.Kbd.prototype._deactivete = function()
{
  $d.onkeyup = $d.onkeydown = null;
};

$G.Controller.Kbd.prototype._process = function()
{
  if(!(this.isLeftKey + this.isRightKey)&1)
    return;

  if(this.isLeftKey)
    $G.ship._moveLeft();
  else if(this.isRightKey)
    $G.ship._moveRight();
};

$G.Controller.Kbd.prototype._onKeyDown = function(e)
{
  if(e == null)
    e = event;
  
  switch(e.keyCode)
  {
    case 37: // left
      this.isLeftKey = true;
      return false;
    case 39: // right
      this.isRightKey = true;
      return false;
  }
};
$G.Controller.Kbd.prototype._onKeyUp = function(e)
{
  if(e == null)
    e = event;
  
  switch(e.keyCode)
  {
    case 37: // left
      this.isLeftKey = false;
      return false;
    case 39: // right
      this.isRightKey = false;
      return false;
    case 32: // space fire
    case 16: // shift fire too
      $G.ship._fireBullet();
      return false;
    case 27: // esc - pause
      $G.ship._togglePause();
      return false;
  }
};

$G.Controller.Mouse = function()
{
  this.mouseX;
  
  var self = this;
  
  this._onMouseMoveBind = function(e) { self._onMouseMove(e); };
  this._onMouseUpBind = function(e) { self._onMouseUp(e); };
};

$G.Controller.Mouse.prototype._activete = function()
{
  this.mouseX = null;
  $d.onmouseup = this._onMouseUpBind;
  $d.onmousemove = this._onMouseMoveBind;
};
$G.Controller.Mouse.prototype._deactivete = function()
{
  $d.onmouseup = $d.onmousemove = null;
};

$G.Controller.Mouse.prototype._process = function()
{
  var diff = this.mouseX - $G.ship.x;
  
  if(diff >= 15)
    $G.ship._moveRight();
  else if(diff <= -15)
    $G.ship._moveLeft();
};

$G.Controller.Mouse.prototype._onMouseMove = function(e)
{
  if(e == null)
    e = event;
  
  this.mouseX = e.clientX;
};

if($d.recalc)
{
  $G.Controller.Mouse.prototype._onMouseUp = function(e)
  {
    if(e == null)
      e = event;
    
    if(e.button&1)
      $G.ship._fireBullet();
    else if(e.button&2)
      $G.ship._togglePause();

    return false;
  };
}
else
{
  $G.Controller.Mouse.prototype._onMouseUp = function(e)
  {
    if(e == null)
      e = event;
    
    if(e.button === 0)
      $G.ship._fireBullet();
    else if(e.button === 2)
      $G.ship._togglePause();
    
    return false;
  };
}  

$G.Controller.Touch = function()
{
  this.touchStartY;
  this.lastTouchX;
  
  var self = this;
  
  this._onTouchStartBind = function(e) { self._onTouchStart(e); };
  this._onTouchEndBind = function(e) { self._onTouchEnd(e); };
};

$G.Controller.Touch.prototype._activete = function()
{
  this.touchStartY = this.lastTouchX = null;
  $d.ontouchstart = this._onTouchStartBind;
  $d.ontouchend = this._onTouchEndBind;
};
$G.Controller.Touch.prototype._deactivete = function()
{
  $d.ontouchstart = $d.ontouchend = null;
};

$G.Controller.Touch.prototype._process = function()
{
  var diff = this.lastTouchX - $G.ship.x;
  
  if(diff >= 15)
    $G.ship._moveRight();
  else if(diff <= -15)
    $G.ship._moveLeft();
};

$G.Controller.Touch.prototype._onTouchStart = function(e)
{
  if(e == null)
    e = event;
  
  this.touchStartY = e.changedTouches[0].clientY;
};

$G.Controller.Touch.prototype._onTouchEnd = function(e)
{
  if(e == null)
    e = event;
  
  this.lastTouchX = e.changedTouches[0].clientX;
  
  // click
  if(Math.abs(this.touchStartY - e.changedTouches[0].clientY) < 10)
    $G.ship._fireBullet();
  // gesture finger up/down
  else
    $G.ship._togglePause();

  return false;
};

if("textContent" in document.documentElement)
{
  $G._setNodeText = function(v, text)
  {
    var f;
    
    if((f = v.firstChild) && f.nodeType === 1 && !f.nextSibling)
      f.data = "" + text;
    else  
      v.textContent = "" + text;
  };
}
else if("innerText" in document.documentElement)
{
  $G._setNodeText = function(v, text)
  {
    var f;
    
    if((f = v.firstChild) && f.nodeType === 1 && !f.nextSibling)
      f.data = "" + text;
    else  
      v.innerText = "" + text;
  };
}
else
{
  $G._setNodeText = function(v, text)
  {
    var f;
    
    if((f = v.firstChild) && f.nodeType === 1 && !f.nextSibling)
    {  
      f.data = "" + text;
    }
    else
    {
      v.innerHTML = "";
      v.appendChild(document.createTextNode(text));
    }  
  };
}  

$G.fpsDelay = 30, $G.fpsLastTime = 0;
$G.score = 0;

$G._gameThread=function()
{
  var t0 = +new Date();
  
  $G.controller._process();
  $G.ship._render();
  $G.bullets._render();
  $G.petals._render();
  $G.flowerGroups._render();
  $G.grass._render();
  $G.bonuses._render();
  
  var t = +new Date(), epTime = $G.fpsDelay - (t - t0);
  
  $d.getElementById("fps").firstChild.data = (1000/(t - t0)).toFixed(2);
  $d.getElementById("score").firstChild.data = "" + score;
  //$G.fpsLastTime = t;
  
  if(epTime < 0)
    epTime = 0;
  
  setTimeout(_gameThread, epTime);
};

$G._setController = function()
{
  var li = this.parentNode, name = li.getAttribute('controller');
  
  if($G.controller.name === name)
    return false;
    
  var ul = li.parentNode, lis = ul.childNodes, lii = lis.length;

  while(lii-- &&  (""+lis[lii].className).indexOf('active') === -1)
    ;
    
  lis[lii].className = lis[lii].className.replace(/active/g, '');
  li.className += " active";
  
  $G.controller._deactivete();
  $G.controller = new (eval(name));
  $G.controller._activete();
  $G.controller.name = name;
  
  return false;
};

$G._newGame = function(name)
{
  var dif = difMap[name];
  
  $G.score = 0;
  $G.gameDifName = name;
  $G.ship._initGame(dif);
  $G.bullets._initGame(dif);
  $G.petals._initGame(dif);
  $G.flowerGroups._initGame(dif);
  $G.bonuses._initGame(dif);
};

$G._gameOver = function()
{
  $d.getElementById('menu-title').firstChild.data = $G.gameDifName + ' :: game over';
  $d.getElementById('menu').style.display = '';
};

$G._onWindowResize = function(e)
{
  $G.wWidth = $w.innerWidth || $d.documentElement.clientWidth || $d.body.clientWidth;
  $G.wHeight = $w.innerHeight || $d.documentElement.clientHeight || $d.body.clientHeight;
  $G.ship.y = $G.wHeight - 20;
};

$G._main=function()
{
  ($w.onresize = $G._onWindowResize)();
  
  $G.controller = new $G.Controller.Kbd();
  $G.controller._activete();
  $G.controller.name = '$G.Controller.Kbd';
  
  $G.ship = new $G.Ship();
  $G.flowerGroups = new $G.FlowerGroups();
  $G.bonuses = new $G.Bonuses();
  
  $G.bullets = new $G.Bullets();
  $G.petals = new $G.Petals();
  $G.grass = new $G.Grass();

  $G._newGame('easy');
  $G.ship._togglePause();
  
  _gameThread();
}  

$w.onload=$G._main;
