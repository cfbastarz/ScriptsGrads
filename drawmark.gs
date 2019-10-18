***************************************************************************************
*       $Id: drawmark.gs,v 1.22 2012/05/06 22:12:36 bguan Exp $
*       Copyright (C) 2012 Bin Guan.
*       Distributed under GNU/GPL.
***************************************************************************************
function drawmark(arg)
*
* Draw marks at grid points with mark size (i.e., area) proportional to the magnitude of data.
*
rc=gsfallow('on')

*
* Save gxout info.
*
'query gxinfo'
line1=sublin(result,1)
gxout=subwrd(line1,4)
if(gxout='Clear')
gxout='Contour'
endif
if(gxout='Shaded2')
gxout='Shade2'
endif

tmpdir='/tmp'
whoamifile='./.whoami.bGASL'
'!whoami>'whoamifile
whoami=sublin(read(whoamifile),2)
rc=close(whoamifile)
'!unlink 'whoamifile
mytmpdir=tmpdir'/bGASL-'whoami
'!mkdir -p 'mytmpdir

var=subwrd(arg,1)
mark=subwrd(arg,2)
color=subwrd(arg,3)
size=subwrd(arg,4)
mag=subwrd(arg,5)
append=subwrd(arg,6)
text=parsestr(arg,7)
if(size='')
  usage()
  return
endif
if(mag='')
  mag=0
endif
if(append='')
  append=0
endif
if(text='')
  text='Variable'
endif

qdims()
num_varying_dim=(_xs!=_xe)+(_ys!=_ye)+(_zs!=_ze)+(_ts!=_te)
if(num_varying_dim!=2)
  say 'DRAWMARK>ERROR: # of varying dimensions must be 2. See current setting below.'
  'query dims'
  cnt=2
  while(cnt<=6)
    say ' 'sublin(result,cnt)
    cnt=cnt+1
  endwhile
  return
endif

'query undef'
undef=subwrd(result,7)

*
* Run display to get scaling environment for gr2xy.
*
'set gxout contour'
'set clevs -1e9'
'display lat'
'query gxinfo'
line3=sublin(result,3)
line4=sublin(result,4)
line5=sublin(result,5)
xa=subwrd(line3,4)
ya=subwrd(line4,4)
xaxis=subwrd(line5,3)
yaxis=subwrd(line5,6)

*
* Draw mark.
*
xcnt=math_int(_xs)
while(xcnt<=_xe)
  ycnt=math_int(_ys)
  while(ycnt<=_ye)
    zcnt=math_int(_zs)
    while(zcnt<=_ze)
      tcnt=math_int(_ts)
      while(tcnt<=_te)
        'set x 'xcnt
        'set y 'ycnt
        'set z 'zcnt
        'set t 'tcnt
        'display 'var
        value=subwrd(result,4)
        if(value!=undef)
          if(mag!=0); sizescaled=size*math_sqrt(math_abs(value)/mag); else; sizescaled=size; endif
          if(xaxis='Lon' & yaxis='Lat')
            'query gr2xy 'xcnt' 'ycnt
          endif
          if(xaxis='Lon' & yaxis='Lev')
            'query gr2xy 'xcnt' 'zcnt
          endif
          if(xaxis='Lon' & yaxis='Time')
            'query gr2xy 'xcnt' 'tcnt
          endif
          if(xaxis='Lat' & yaxis='Lon')
            'query gr2xy 'ycnt' 'xcnt
          endif
          if(xaxis='Lat' & yaxis='Lev')
            'query gr2xy 'ycnt' 'zcnt
          endif
          if(xaxis='Lat' & yaxis='Time')
            'query gr2xy 'ycnt' 'tcnt
          endif
          if(xaxis='Lev' & yaxis='Lon')
            'query gr2xy 'zcnt' 'xcnt
          endif
          if(xaxis='Lev' & yaxis='Lat')
            'query gr2xy 'zcnt' 'ycnt
          endif
          if(xaxis='Lev' & yaxis='Time')
            'query gr2xy 'zcnt' 'tcnt
          endif
          if(xaxis='Time' & yaxis='Lon')
            'query gr2xy 'tcnt' 'xcnt
          endif
          if(xaxis='Time' & yaxis='Lat')
            'query gr2xy 'tcnt' 'ycnt
          endif
          if(xaxis='Time' & yaxis='Lev')
            'query gr2xy 'tcnt' 'zcnt
          endif
          x=subwrd(result,3)
          y=subwrd(result,6)
          'set line 'color
          'draw mark 'mark' 'x' 'y' 'sizescaled
        endif
        tcnt=tcnt+1
      endwhile
      zcnt=zcnt+1
    endwhile
    ycnt=ycnt+1
  endwhile
  xcnt=xcnt+1
endwhile

'set x '_xs' '_xe
'set y '_ys' '_ye
'set z '_zs' '_ze
'set t '_ts' '_te

'set gxout 'gxout

*
* Define spacing.
*
small_spacing=0.05
'query pp2xy 0 0'
tmpxa=subwrd(result,3)
'query pp2xy 1 1'
tmpxb=subwrd(result,3)
rvratio=tmpxb-tmpxa
small_spacing=small_spacing*rvratio

*
* Draw legend.
*
if(mag!=0)
  mag_bigger=mag*2
  mag_smaller=mag/2
  size_bigger=size*math_sqrt(mag_bigger/mag)
  size_smaller=size*math_sqrt(mag_smaller/mag)
  'set line 'color
* Bigger mark
  'draw mark 'mark' 'xa+small_spacing+size_bigger/2' 'ya+small_spacing+size_bigger/2' 'size_bigger
  'set string 1 l'
  'draw string 'xa+2*small_spacing+size_bigger' 'ya+small_spacing+size_bigger/2' 'mag_bigger
  'query string 'mag_bigger
  strwid_bigger=subwrd(result,4)
* Middle mark
  'draw mark 'mark' 'xa+3*small_spacing+size_bigger+strwid_bigger+size/2' 'ya+small_spacing+size_bigger/2' 'size
  'set string 1 l'
  'draw string 'xa+4*small_spacing+size_bigger+strwid_bigger+size' 'ya+small_spacing+size_bigger/2' 'mag
  'query string 'mag
  strwid_middle=subwrd(result,4)
* Smaller mark
  'draw mark 'mark' 'xa+5*small_spacing+size_bigger+strwid_bigger+size+strwid_middle+size_smaller/2' 'ya+small_spacing+size_bigger/2' 'size_smaller
  'set string 1 l'
  'draw string 'xa+6*small_spacing+size_bigger+strwid_bigger+size+strwid_middle+size_smaller' 'ya+small_spacing+size_bigger/2' 'mag_smaller
  'query string 'mag_smaller
  strwid_smaller=subwrd(result,4)
  'set line 1'
  'draw rec 'xa' 'ya' 'xa+7*small_spacing+size_bigger+strwid_bigger+size+strwid_middle+size_smaller+strwid_smaller' 'ya+2*small_spacing+size_bigger
endif

*
* Save mark information for use by legend.gs (in case several variables are plotted on same figure)
*
num_var=1
if(append!=1)
  rc=write(mytmpdir'/legend.txt~','mark')
endif
cnt=1
while(cnt<=num_var)
  line=mark' 'size' -1 'color' -1 'text
  if(append!=1)
    rc=write(mytmpdir'/legend.txt~',line)
  else
    rc=write(mytmpdir'/legend.txt~',line,append)
  endif
  cnt=cnt+1
endwhile
rc=close(mytmpdir'/legend.txt~')

return
***************************************************************************************
function usage()
*
* Print usage information.
*
say '  Draw marks at grid points with mark size (i.e., area) proportional to the magnitude of data.'
say ''
say '  Usage: drawmark <var> <mark> <color> <size> [<magnitude> [<append> [<text>]]]]'
say '     <var>: variable name.'
say '     <mark>: mark type.'
say '     <color>: mark color.'
say '     <size>: mark size.'
say '     <magnitude>: magnitude of <var> corresponding to <size>. If =0 then all marks will have the same size of <size>. Default=0.'
say '     <append>: 0 (default) or 1. Set to 1 if appending to an existing plot. (Run "legend.gs" only once after all data are plotted.)'
say '     <text>: Text to be shown in the legend (see "legend.gs"). Text beginning with a minus sign or containing spaces must be double quoted.'
say ''
say '  Note 2: <var> must be on a grid consistent with the default file. If not, use "set dfile" to change the default file.'
say ''
say '  Dependencies: qdims.gsf'
say ''
say '  See also: legend.gs'
say ''
say '  Copyright (C) 2012 Bin Guan.'
say '  Distributed under GNU/GPL.'
return
