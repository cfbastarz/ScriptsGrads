***************************************************************************************
*       $Id: drawstr.gs,v 1.43 2012/04/02 21:02:52 bguan Exp $
*       Copyright (C) 2012 Bin Guan.
*       Distributed under GNU/GPL.
***************************************************************************************
function drawstr(arg)
*
* Draw string in designated position.
*
rc=gsfallow('on')

*
* Parse -T option (column title).
*
num_TXT=parseopt(arg,'-','T','TEXT')

*
* Parse -t option (text).
*
num_txt=parseopt(arg,'-','t','text')
if(num_TXT+num_txt=0 | num_TXT*num_txt>0)
  usage()
  return
endif

*
* Initialize other options.
*
if(num_TXT>0)
  cnt=1
  while(cnt<=num_TXT)
    _.color.cnt=1
    _.size.cnt=0.18
    _.thickness.cnt=5
    _.xoffset.cnt=0
    _.yoffset.cnt=0
    cnt=cnt+1
  endwhile
endif
if(num_txt>0)
  x=0
  y=0
  cnt=1
  while(cnt<=num_txt)
    _.position.cnt=cnt
    _.color.cnt=1
    _.thickness.cnt=5
    _.xoffset.cnt=0
    _.yoffset.cnt=0
    cnt=cnt+1
  endwhile
endif

*
* Parse -p option (position).
*
ps=13
p.1='tl'
p.2='tc'
p.3='tr'
p.4='bl'
p.5='br'
p.6='bc'
p.7='b25'
p.8='b75'
p.9='l'
p.10='r'
p.11='tl2'
p.12='tr2'
p.13='corr'
rc=parseopt(arg,'-','p','position')
cnt=1
while(cnt<=num_txt)
  if(valnum(_.position.cnt)=0)
    p_cnt=1
    flag=0
    while(p_cnt<=ps)
      flag=flag | (_.position.cnt=p.p_cnt)
      p_cnt=p_cnt+1
    endwhile
    if(!flag)
      say 'DRAWSTR>ERROR: invalid <position>.'
      say ''
      return
    endif
  endif
  if(valnum(_.position.cnt)=2)
    say 'DRAWSTR>ERROR: <position> must be an integer.'
    say ''
    return
  endif
  cnt=cnt+1
endwhile

*
* Parse -c option (color).
*
colorrc=parseopt(arg,'-','c','color')

*
* Parse -z option (size).
*
sizerc=parseopt(arg,'-','z','size')

*
* Parse -k option (thickness).
*
thicknessrc=parseopt(arg,'-','k','thickness')

*
* Parse -b option (background color).
*
backgroundrc=parseopt(arg,'-','b','background')

*
* Parse -xo option (x offset).
*
xoffsetrc=parseopt(arg,'-','xo','xoffset')

*
* Parse -yo option (y offset).
*
yoffsetrc=parseopt(arg,'-','yo','yoffset')

*
* Draw column title.
*
if(num_TXT>0)
  'set vpage off'
  'set parea off'
  cnt=1
  while(cnt<=num_TXT)
    while(_.TEXT.cnt='')
      cnt=cnt+1
    endwhile
    if(cnt>num_TXT)
      return
    endif
    'query defval vpagexa'_.position.cnt' 1 1'
    vpagexa=subwrd(result,3)
    'query defval vpagexb'_.position.cnt' 1 1'
    vpagexb=subwrd(result,3)
    'query defval vpageya'_.position.cnt' 1 1'
    vpageya=subwrd(result,3)
    TXT_x=vpagexa+(vpagexb-vpagexa)/2
    TXT_y=vpageya-0.44
*   Note: default spacing between column title and parea is 0.66-0.44=0.22.
    'set string '_.color.cnt' bc '_.thickness.cnt
    'set strsiz '_.size.cnt
    'draw string 'TXT_x+_.xoffset.cnt' 'TXT_y+_.yoffset.cnt' '_.TEXT.cnt
    cnt=cnt+1
  endwhile
  return
endif

*
* Get plot area
*
'query gxinfo'
line3=sublin(result,3)
line4=sublin(result,4)
x1=subwrd(line3,4)
x2=subwrd(line3,6)
y1=subwrd(line4,4)
y2=subwrd(line4,6)
x25=x1+(x2-x1)/4
x50=x1+(x2-x1)/2
x75=x1+(x2-x1)/4*3
y50=y1+(y2-y1)/2

*
* Define spacing.
*
small_spacing=0.05
big_spacing=0.2
'query pp2xy 0 0'
tmpxa=subwrd(result,3)
'query pp2xy 1 1'
tmpxb=subwrd(result,3)
rvratio=tmpxb-tmpxa
small_spacing=small_spacing*rvratio
big_spacing=big_spacing*rvratio

*
* Draw string.
*
cnt=1
while(cnt<=num_txt)
  while(_.text.cnt='')
    cnt=cnt+1
  endwhile
  if(cnt>num_txt)
    return
  endif
  if(_.position.cnt=1 | _.position.cnt=p.1)
    x=x1
    y=y2+small_spacing
    'set string '_.color.cnt' bl '_.thickness.cnt' 0'
  endif
  if(_.position.cnt=2 | _.position.cnt=p.2)
    x=x50
    y=y2+small_spacing
    'set string '_.color.cnt' bc '_.thickness.cnt' 0'
  endif
  if(_.position.cnt=3 | _.position.cnt=p.3)
    x=x2
    y=y2+small_spacing
    'set string '_.color.cnt' br '_.thickness.cnt' 0'
  endif
  if(_.position.cnt=4 | _.position.cnt=p.4)
    x=x1
    y=y1+small_spacing
    'set string '_.color.cnt' bl '_.thickness.cnt' 0'
  endif
  if(_.position.cnt=5 | _.position.cnt=p.5)
    x=x2
    y=y1+small_spacing
    'set string '_.color.cnt' br '_.thickness.cnt' 0'
  endif
  if(_.position.cnt=6 | _.position.cnt=p.6)
    x=x50
    y=y1-big_spacing
    'set string '_.color.cnt' tc '_.thickness.cnt' 0'
  endif
  if(_.position.cnt=7 | _.position.cnt=p.7)
    x=x25
    y=y1-big_spacing
    'set string '_.color.cnt' tc '_.thickness.cnt' 0'
  endif
  if(_.position.cnt=8 | _.position.cnt=p.8)
    x=x75
    y=y1-big_spacing
    'set string '_.color.cnt' tc '_.thickness.cnt' 0'
  endif
  if(_.position.cnt=9 | _.position.cnt=p.9)
    x=x1-2.2*big_spacing
    y=y50
    'set string '_.color.cnt' c '_.thickness.cnt' 90'
  endif
  if(_.position.cnt=10 | _.position.cnt=p.10)
    x=x2+2.2*big_spacing
    y=y50
    'set string '_.color.cnt' c '_.thickness.cnt' 270'
  endif
  if(_.position.cnt=11 | _.position.cnt=p.11)
    x=x1
    y=y2-small_spacing
    'set string '_.color.cnt' tl '_.thickness.cnt' 0'
  endif
  if(_.position.cnt=12 | _.position.cnt=p.12)
    x=x2
    y=y2-small_spacing
    'set string '_.color.cnt' tr '_.thickness.cnt' 0'
  endif
  if(_.position.cnt=13 | _.position.cnt=p.13)
    if((x2-x1)/(y2-y1)<1.5)
      x=x1+(x2-x1)*1.414/2+1.55*big_spacing
      y=y1+(y2-y1)*1.414/2+1.55*big_spacing
      'set string '_.color.cnt' bc '_.thickness.cnt' -45'
    else
      x=x50
      y=y2+2.2*big_spacing
      'set string '_.color.cnt' bc '_.thickness.cnt' 0'
    endif
  endif
  x=x+_.xoffset.cnt
  y=y+_.yoffset.cnt
  if(sizerc=num_txt)
*   Need the above if to prevent possible errors since _.size.cnt has no initial value defined for "-t".
    'set strsiz '_.size.cnt
  endif
  if(backgroundrc=num_txt)
    'query string '_.text.cnt
    string_width=subwrd(result,4)
    'query string W'
    string_height=subwrd(result,4)
    if(_.position.cnt=4 | _.position.cnt=p.4)
      'set line '_.background.cnt
      'draw recf 'x1' 'y1' 'x1+string_width' 'y1+string_height+2*small_spacing
      'set line 1'
      'draw rec 'x1' 'y1' 'x1+string_width' 'y1+string_height+2*small_spacing
    endif
    if(_.position.cnt=5 | _.position.cnt=p.5)
      'set line '_.background.cnt
      'draw recf 'x2-string_width' 'y1' 'x2' 'y1+string_height+2*small_spacing
      'set line 1'
      'draw rec 'x2-string_width' 'y1' 'x2' 'y1+string_height+2*small_spacing
    endif
    if(_.position.cnt=11 | _.position.cnt=p.11)
      'set line '_.background.cnt
      'draw recf 'x1' 'y2-string_height-2*small_spacing' 'x1+string_width' 'y2
      'set line 1'
      'draw rec 'x1' 'y2-string_height-2*small_spacing' 'x1+string_width' 'y2
    endif
    if(_.position.cnt=12 | _.position.cnt=p.12)
      'set line '_.background.cnt
      'draw recf 'x2-string_width' 'y2-string_height-2*small_spacing' 'x2' 'y2
      'set line 1'
      'draw rec 'x2-string_width' 'y2-string_height-2*small_spacing' 'x2' 'y2
    endif
  endif
  'draw string 'x' 'y' '_.text.cnt
  cnt=cnt+1
endwhile
'set string 1 bl 5 0'
return

return
***************************************************************************************
function parseopt(instr,optprefix,optname,outname)
*
* Parse an option, store argument(s) in a global variable array.
*
rc=gsfallow('on')
cnt=1
cnt2=0
while(subwrd(instr,cnt)!='')
  if(subwrd(instr,cnt)=optprefix''optname)
    cnt=cnt+1
    word=subwrd(instr,cnt)
    while(word!='' & (valnum(word)!=0 | substr(word,1,1)''999!=optprefix''999))
      cnt2=cnt2+1
      _.outname.cnt2=parsestr(instr,cnt)
      if(_end_wrd_idx=-9999);return cnt2;endif
      cnt=_end_wrd_idx+1
      word=subwrd(instr,cnt)
    endwhile
  endif
  cnt=cnt+1
endwhile
return cnt2
***************************************************************************************
function usage()
*
* Print usage information.
*
say '  Label a plot.'
say ''
say '  USAGE 1: drawstr -t <text1> [<text2>...] [-p <position1> [<position2>...]] [-c <color1> [<color2>...]] [-z <size1> [<size2>...]]'
say '           [-k <thickness1> [<thickness2>...]] [-b <background1> [<background2>...]] [-xo <xoffset1> [<xoffset2>...]] [-yo <yoffset1> [<yoffset2>...]]'
say '  USAGE 2: drawstr -T <TEXT1> [<TEXT2>...] [-p <position1> [<position2>...]] [-c <color1> [<color2>...]] [-z <size1> [<size2>...]]'
say '           [-k <thickness1> [<thickness2>...]] [-xo <xoffset1> [<xoffset2>...]] [-yo <yoffset1> [<yoffset2>...]]'
say '    <text>|<TEXT>: panel labels | column titles. Text beginning with a minus sign or containing spaces must be double quoted.'
say '    <position>: position of text. For <text>, refer to schematic below. For <TEXT>, use panel index to specify the location. Default="1 2 3...".'
say '    <color>: color of text. Default=1.'
say '    <size>: size of text. Default=current setting for <text>. Default=0.18 for <TEXT>.'
say '    <thickness>: thickness of text.'
say '    <background>: background color of text. Applicable to text inside plotting area only.'
say '    <xoffset>: horizontal offset to default position. Default=0.'
say '    <yoffset>: vertical offset to default position. Default=0.'
say ''
say '                 <TEXT>'
say ''
say '    1               2               3'
say '    ---------------------------------'
say '    |11                           12|'
say '    |                               |'
say '    |                               |'
say '   9|           Plot Area           |10'
say '    |                               |'
say '    |                               |'
say '    |4                             5|'
say '    ---------------------------------'
say '            7       6       8        '
say ''
say '  NOTE: The "-T" and "-t" options cannot be used together.'
say ''
say '  EXAMPLE 1 (add axis labels):'
say '    drawstr -p 6 9 -t Longitude Latitude'
say ''
say '  EXAMPLE 2 (add column titles for a 3 rows by 2 columns plot):'
say '    subplot 6 1'
say '    ...'
say '    subplot 6 6'
say '    ...'
say '    drawstr -p 1 4 -T "Title A" "Title B"'
say ''
say '  Dependencies: parsestr.gsf'
say ''
say '  Copyright (C) 2012 Bin Guan.'
say '  Distributed under GNU/GPL.'
return
