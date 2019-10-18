***************************************************************************************
*       $Id: colorbar.gs,v 1.6 2012/04/15 23:18:12 bguan Exp $
*       Copyright (C) 2010 Bin Guan.
*       Distributed under GNU/GPL.
*
*---------begin original documentation from cbarn.gs---------
*  Script to plot a colorbar
*
*  The script will assume a colorbar is wanted even if there is 
*  not room -- it will plot on the side or the bottom if there is
*  room in either place, otherwise it will plot along the bottom and
*  overlay labels there if any.  This can be dealt with via 
*  the 'set parea' command.  In version 2 the default parea will
*  be changed, but we want to guarantee upward compatibility in
*  sub-releases.
*
*
*       modifications by mike fiorino 940614
*
*       - the extreme colors are plotted as triangles
*       - the colors are boxed in white
*       - input arguments in during a run execution:
* 
*       run cbarn sf vert xmid ymid
*
*       sf   - scale the whole bar 1.0 = original 0.5 half the size, etc.
*       vert - 0 FORCES a horizontal bar = 1 a vertical bar
*       xmid - the x position on the virtual page the center the bar
*       ymid - the x position on the virtual page the center the bar
*
*       if vert,xmid,ymid are not specified, they are selected
*       as in the original algorithm
*---------end original documentation from cbarn.gs---------
***************************************************************************************
function colorbar(arg)
*
* Draw a color bar.
*
posNstuff=subwrd(arg,1)
sf=subwrd(arg,2)
if(posNstuff='-h')
usage()
return
else
say 'COLORBAR>TIP: use "-h" option to get help.'
endif
if(posNstuff=''); posNstuff='bottom'; endif
if(sf=''); sf=1.0; endif

*
* extract position/offset info
*
pos=posNstuff
offset=0
cnt=1
while(substr(posNstuff,cnt,1)!='')
if(substr(posNstuff,cnt,1)''substr(posNstuff,cnt,1)='++')
* important note: GrADS thinks '+', '-' ,'0' and 'e' all equal as strings, but '++', '--' ,'00' and 'ee' not.
* you'll be surprised if you use something like if('+'='-')...
pos=substr(posNstuff,1,cnt-1)
offset=substr(posNstuff,cnt+1,strlen(posNstuff)-cnt)
endif
if(substr(posNstuff,cnt,1)''substr(posNstuff,cnt,1)='--')
pos=substr(posNstuff,1,cnt-1)
offset='-'substr(posNstuff,cnt+1,strlen(posNstuff)-cnt)
endif
cnt=cnt+1
endwhile

if(pos='left' | pos='right'); vert=1; endif
if(pos='top' | pos='bottom'); vert=0; endif

'query gxinfo'
line3=sublin(result,3)
line4=sublin(result,4)
x1=subwrd(line3,4)
x2=subwrd(line3,6)
y1=subwrd(line4,4)
y2=subwrd(line4,6)
xsiz=x2-x1
ysiz=y2-y1
xmid=(x1+x2)/2
ymid=(y1+y2)/2
spacing=0.3

stroff=0.05*sf
strxsiz=0.10*sf
strysiz=0.11*sf

*
*  Check shading information
*
'query shades'
shadinfo=result
if(subwrd(shadinfo,1)='None') 
say 'COLORBAR>Error: No shading information.'
return
endif
cnum=subwrd(shadinfo,5)

*
* Right bar
*
if(pos='right')
xwid=0.2*sf
xl=x2+spacing+offset
xr=xl+xwid
ywid=ysiz*sf/cnum
yb=ymid-ysiz*sf/2
yt=ymid+ysiz*sf/2
'set string 1 l 5'
endif

*
* Left bar
*
if(pos='left')
xwid=0.2*sf
xr=x1-spacing+offset
xl=xr-xwid
ywid=ysiz*sf/cnum
yb=ymid-ysiz*sf/2
yt=ymid+ysiz*sf/2
'set string 1 l 5'
endif

*
* Bottom bar
*
if(pos='bottom')
ywid=0.2*sf
yt=y1-spacing+offset
yb=yt-ywid
xwid=xsiz*sf/cnum
xl=xmid-xsiz*sf/2
xr=xmid+xsiz*sf/2
'set string 1 tc 5'
endif

*
* Top bar
*
if(pos='top')
ywid=0.2*sf
yb=y2+spacing+offset
yt=yb+ywid
xwid=xsiz*sf/cnum
xl=xmid-xsiz*sf/2
xr=xmid+xsiz*sf/2
'set string 1 tc 5'
endif

*
* Plot colorbar
*
*---------begin original code from cbarn.gs---------
*'set strsiz 'strxsiz' 'strysiz
  num = 0
  while (num<cnum) 
    rec = sublin(shadinfo,num+2)
    col = subwrd(rec,1)
    hi = subwrd(rec,3)
    if (vert) 
      yt = yb + ywid
    else 
      xr = xl + xwid
    endif

*   Draw the middle boxes
    'set line 'col
    'draw recf 'xl' 'yb' 'xr' 'yt
    'set line 1 1 5'
    'draw rec  'xl' 'yb' 'xr' 'yt

*   Put numbers under each segment of the color key
    if (num < cnum-1)
      if (vert) 
        xp=xr+stroff
        'draw string 'xp' 'yt' 'hi
      else
        yp=yb-stroff
       'draw string 'xr' 'yp' 'hi
      endif
    endif

*   Reset variables for next loop execution
    if (vert) 
      yb = yt
    else
      xl = xr
    endif
    num = num + 1

  endwhile

'set line 1 1 3'

return
*---------end original code from cbarn.gs---------
***************************************************************************************
function usage()
*
* Print usage information.
*
say '  Draw a color bar.'
say ''
say '  Usage: colorbar [left|right|bottom|top[<offset>] [<scalefactor>]]'
say '         <offset>: offset to default location.'
say '         <scalefactor>: scale factor. Default=1.'
say ''
say '  Example 1: colorbar right+0.2'
say '             Place the color bar to the right of the panel and shift to the right by 0.2 from the default location.'
say ''
say '  Example 2: colorbar bottom-0.3 0.9'
say '             Place the color bar below the panel, shift downward by 0.3 from the default location, and re-size by a factor of 0.9.'
say ''
say '  Copyright (C) 2010 Bin Guan.'
say '  Distributed under GNU/GPL.'
return
