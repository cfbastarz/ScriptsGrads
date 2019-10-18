***************************************************************************************
*       $Id: legend.gs,v 1.32 2012/04/27 00:42:57 bguan Exp $
*       Copyright (C) 2012 Bin Guan.
*       Distributed under GNU/GPL.
***************************************************************************************
function legend(arg)
*
* Display the legend for a line graph (must have been produced using plot.gs) or vector plot (must have been produced using vector.gs).
*
rc=gsfallow('on')

if(arg='-h')
  usage()
  return
else
  say 'LEGEND>TIP: use "-h" option to get help.'
endif

tmpdir='/tmp'
whoamifile='./.whoami.bGASL'
'!whoami>'whoamifile
whoami=sublin(read(whoamifile),2)
rc=close(whoamifile)
'!unlink 'whoamifile
mytmpdir=tmpdir'/bGASL-'whoami
'!mkdir -p 'mytmpdir

*
* Read legend header.
*
result=read(mytmpdir'/legend.txt~')
header=sublin(result,2)

***************************************************************************************
* Vector graph.
***************************************************************************************
if(header='vector')
*
* Initialization.
*
  _.xoffset.1=0
  _.yoffset.1=0
*
* Parse -xo option (x offset).
*
  rc=parseopt(arg,'-','xo','xoffset')
*
* Parse -yo option (y offset).
*
  rc=parseopt(arg,'-','yo','yoffset')
*
* Get plot area.
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
  big_spacing=0.5
  'query pp2xy 0 0'
  tmpxa=subwrd(result,3)
  'query pp2xy 1 1'
  tmpxb=subwrd(result,3)
  rvratio=tmpxb-tmpxa
  big_spacing=big_spacing*rvratio
*
* Set X/Y.
*
  x=x2
  y=y1-big_spacing
  x=x+_.xoffset.1
  y=y+_.yoffset.1
*
* Draw legend.
*
  result=read(mytmpdir'/legend.txt~')
  line=sublin(result,2)
  arr_length=subwrd(line,1)
  arr_mag=subwrd(line,2)
  arr_color=subwrd(line,3)
  arr_thick=subwrd(line,4)
  'query string 'arr_mag
  arr_mag_strlen=subwrd(result,4)
  'set line 'arr_color' 1 'arr_thick
  'draw line 'x-arr_mag_strlen-arr_length' 'y' 'x-arr_mag_strlen' 'y
  'draw line 'x-arr_mag_strlen-0.1' 'y+0.05' 'x-arr_mag_strlen' 'y
  'draw line 'x-arr_mag_strlen-0.1' 'y-0.05' 'x-arr_mag_strlen' 'y
  'set line 1 1 3'
  'set string 'arr_color' l'
  'draw string 'x-arr_mag_strlen' 'y' 'arr_mag
  
  return
endif

***************************************************************************************
* Taylor diagram.
***************************************************************************************
if(header='taylor')
*
* Read legend data.
*
  flag=1
  cnt=0
  while(flag)
    result=read(mytmpdir'/legend.txt~')
    status=sublin(result,1)
    if(status!=0)
      flag=0
    else
      cnt=cnt+1
      line.cnt=sublin(result,2)
    endif
  endwhile
  num_var=cnt
  
*
* Initialize other options.
*
  x=0
  y=0
  _.orientation.1='v'
  _.position.1='tl'
  _.xoffset.1=0
  _.yoffset.1=0
  _.scalefactor.1=1
  
*
* Parse -orient option (orientation).
*
  rc=parseopt(arg,'-','orient','orientation')
  
*
* Parse -xo option (x offset).
*
  rc=parseopt(arg,'-','xo','xoffset')
  
*
* Parse -yo option (y offset).
*
  rc=parseopt(arg,'-','yo','yoffset')
  
*
* Parse -scale option (scale factor).
*
  rc=parseopt(arg,'-','scale','scalefactor')
  
*
* Determine if all symbols are same
*
  AllSymbolSame=1
  _.mark.1=subwrd(line.1,1)
  _.marksize.1=subwrd(line.1,2)
  _.color.1=subwrd(line.1,3)
  cnt=2
  while(cnt<=num_var)
    _.mark.cnt=subwrd(line.cnt,1)
    _.marksize.cnt=subwrd(line.cnt,2)
    _.color.cnt=subwrd(line.cnt,3)
    AllSymbolSame=AllSymbolSame&(_.mark.cnt=_.mark.1)&(_.marksize.cnt=_.marksize.1)&(_.color.cnt=_.color.1)
    cnt=cnt+1
  endwhile
  
*
* Determine if no symbols are same
*
  NoSymbolSame=1
  cnt2=1
  while(cnt2<=num_var-1)
    _.mark.cnt2=subwrd(line.cnt2,1)
    _.marksize.cnt2=subwrd(line.cnt2,2)
    _.color.cnt2=subwrd(line.cnt2,3)
    cnt=cnt2+1
    while(cnt<=num_var)
      _.mark.cnt=subwrd(line.cnt,1)
      _.marksize.cnt=subwrd(line.cnt,2)
      _.color.cnt=subwrd(line.cnt,3)
      NoSymbolSame=NoSymbolSame&((_.mark.cnt!=_.mark.cnt2)|(_.marksize.cnt!=_.marksize.cnt2)|(_.color.cnt!=_.color.cnt2))
      cnt=cnt+1
    endwhile
    cnt2=cnt2+1
  endwhile
  
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
  
*
* Define sizes and spacing.
*
  line_length=0
  small_spacing=0.022
  big_spacing=0.25
  'query pp2xy 0 0'
  tmpxa=subwrd(result,3)
  'query pp2xy 1 1'
  tmpxb=subwrd(result,3)
  rvratio=tmpxb-tmpxa
  line_length=line_length*math_sqrt(_.scalefactor.1)
  small_spacing=small_spacing*rvratio*_.scalefactor.1
  big_spacing=big_spacing*rvratio
  
*
* Draw legend.
*
  cnt=1
  while(cnt<=num_var)
    mark_size=subwrd(line.cnt,2)
    mark_size=mark_size*rvratio
    if(cnt=1)
      if(_.position.1='tl')
        xx=x1+(0.5*mark_size+small_spacing)
        yy=y2-(0.5*mark_size+small_spacing)
      endif
      if((x2-x1)/(y2-y1)<1.5)
        xx=xx+_.xoffset.1
        yy=yy+_.yoffset.1-big_spacing
      else
        xx=xx+_.xoffset.1-3.0*big_spacing
        yy=yy+_.yoffset.1+2.5*big_spacing
      endif
      x=xx
      y=yy
    endif
    mark=subwrd(line.cnt,1)
    color=subwrd(line.cnt,3)
    wrdcnt=5
    text=subwrd(line.cnt,wrdcnt)
    if(text!='|')
      while(subwrd(line.cnt,wrdcnt+1)!='|')
        wrdcnt=wrdcnt+1
        text=text' 'subwrd(line.cnt,wrdcnt)
      endwhile
      'query string 'text
      text_width=subwrd(result,4)
      wrdcnt=wrdcnt+2
    else
      text=''
      text_width=0
      wrdcnt=6
    endif
    TEXT=subwrd(line.cnt,wrdcnt)
    while(subwrd(line.cnt,wrdcnt+1)!='')
      wrdcnt=wrdcnt+1
      TEXT=TEXT' 'subwrd(line.cnt,wrdcnt)
    endwhile
    'query string 'TEXT
    TEXT_width=subwrd(result,4)
    if(_.orientation.1='h'&x+line_length+small_spacing+text_width+TEXT_width>x2)
      x=xx
      y=y-(mark_size+small_spacing)
    endif
    if(!AllSymbolSame)
      'set line 'color
      'draw mark 'mark' 'x' 'y' 'mark_size
    endif
    'set string 1 l'
    if(!NoSymbolSame)
      'draw string 'x+mark_size/2+small_spacing' 'y' 'text': 'TEXT
    else
      'draw string 'x+mark_size/2+small_spacing' 'y' 'TEXT
    endif
    'query string M'
    text_height=subwrd(result,4)
    if(text_height>mark_size)
      text_mark_height=text_height
    else
      text_mark_height=mark_size
    endif
    if(_.orientation.1='v')
      y=y-(text_mark_height+small_spacing)
    endif
    if(_.orientation.1='h'&(!NoSymbolSame))
      x=x+(mark_size+line_length+small_spacing+text_width+TEXT_width+3*small_spacing)
    endif
    if(_.orientation.1='h'&NoSymbolSame)
      x=x+(mark_size+line_length+small_spacing+TEXT_width+2*small_spacing)
    endif
    cnt=cnt+1
  endwhile
  'set line 1'
  'set string 1 bl'
* say 'LEGEND>INFO: line spacing = 'mark_size+small_spacing'.'
  
  return
endif

***************************************************************************************
* Line graph or mark graph.
***************************************************************************************
if(header='line' | header='mark')
*
* Read legend data.
*
  flag=1
  cnt=0
  while(flag)
    result=read(mytmpdir'/legend.txt~')
    status=sublin(result,1)
    if(status!=0)
      flag=0
    else
      cnt=cnt+1
      line.cnt=sublin(result,2)
    endif
  endwhile
  num_var=cnt
  
*
* Initialize other options.
*
  x=0
  y=0
  _.orientation.1='v'
  _.position.1='tl'
  _.xoffset.1=0
  _.yoffset.1=0
  _.scalefactor.1=1
  
*
* Parse -orient option (orientation).
*
  rc=parseopt(arg,'-','orient','orientation')
  
*
* Parse -xo option (x offset).
*
  rc=parseopt(arg,'-','xo','xoffset')
  
*
* Parse -yo option (y offset).
*
  rc=parseopt(arg,'-','yo','yoffset')
  
*
* Parse -scale option (scale factor).
*
  rc=parseopt(arg,'-','scale','scalefactor')
  
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
  
*
* Define sizes and spacing.
*
  line_length=0.55
  small_spacing=0.022
  'query pp2xy 0 0'
  tmpxa=subwrd(result,3)
  'query pp2xy 1 1'
  tmpxb=subwrd(result,3)
  rvratio=tmpxb-tmpxa
  line_length=line_length*math_sqrt(_.scalefactor.1)
  small_spacing=small_spacing*rvratio*_.scalefactor.1
  
*
* Draw legend.
*
  cnt=1
  while(cnt<=num_var)
    mark_size=subwrd(line.cnt,2)
    mark_size=mark_size*rvratio
    if(cnt=1)
      if(_.position.1='tl')
        xx=x1+(0.5*mark_size+small_spacing)
        yy=y2-(0.5*mark_size+small_spacing)
      endif
      xx=xx+_.xoffset.1
      yy=yy+_.yoffset.1
      x=xx
      y=yy
    endif
    mark=subwrd(line.cnt,1)
    style=subwrd(line.cnt,3)
    color=subwrd(line.cnt,4)
    thick=subwrd(line.cnt,5)
    wrdcnt=6
    text=subwrd(line.cnt,wrdcnt)
    while(subwrd(line.cnt,wrdcnt)!='')
      wrdcnt=wrdcnt+1
      text=text' 'subwrd(line.cnt,wrdcnt)
    endwhile
    'query string 'text
    string_width=subwrd(result,4)
    if(_.orientation.1='h'&x+line_length+small_spacing+string_width>x2)
      x=xx
      y=y-(mark_size+small_spacing)
    endif
    'set line 'color' 'style' 'thick
    'draw mark 'mark' 'x' 'y' 'mark_size
    if(header='line')
      if(style=0)
        'draw mark 'mark' 'x+0.5*line_length' 'y' 'mark_size
*       Note: above: if no line then draw a third mark in the middle
      else
        if(mark=2|mark=4|mark=10|mark=11)
          'draw line 'x+0.5*mark_size' 'y' 'x+line_length-0.5*mark_size' 'y
        endif
        if(mark=7)
          'draw line 'x+0.34*mark_size' 'y' 'x+line_length-0.34*mark_size' 'y
        endif
        if(mark=8)
          'draw line 'x+0.27*mark_size' 'y' 'x+line_length-0.27*mark_size' 'y
        endif
        if(mark!=2&mark!=4&mark!=10&mark!=11&mark!=7&mark!=8)
          'draw line 'x' 'y' 'x+line_length' 'y
        endif
      endif
      'draw mark 'mark' 'x+line_length' 'y' 'mark_size
      'set string 1 l'
      'draw string 'x+mark_size/2+line_length+small_spacing' 'y' 'text
      'query string M'
      text_height=subwrd(result,4)
      if(text_height>mark_size)
        text_mark_height=text_height
      else
        text_mark_height=mark_size
      endif
      if(_.orientation.1='v')
        y=y-(text_mark_height+small_spacing)
      endif
      if(_.orientation.1='h')
        x=x+(mark_size+line_length+small_spacing+string_width+2*small_spacing)
      endif
    endif
    if(header='mark')
      'set string 1 l'
      'draw string 'x+mark_size/2+small_spacing' 'y' 'text
      'query string M'
      text_height=subwrd(result,4)
      if(text_height>mark_size)
        text_mark_height=text_height
      else
        text_mark_height=mark_size
      endif
      if(_.orientation.1='v')
        y=y-(text_mark_height+small_spacing)
      endif
      if(_.orientation.1='h')
        x=x+(mark_size+small_spacing+string_width+2*small_spacing)
      endif
    endif
    cnt=cnt+1
  endwhile
  'set line 1 1 3'
  'set string 1 bl'
* say 'LEGEND>INFO: line spacing = 'text_mark_height+small_spacing'.'
  
  return
endif
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
say '  Draw a legend.'
say ''
say '  Usage: legend [-orient v|h] [-xo <xoffset>] [-yo <yoffset>] [-scale <scalefactor>]'
say '     -orient h: use for horizontal oriention. Default is vertical.'
say '     <xoffset>: Horizontal offset to default position (i.e., top-left). Default=0.'
say '     <yoffset>: Vertical offset to default position (i.e., top-left). Default=0.'
say '     <scalefactor>: scale factor for line length and space. Default=1.'
say ''
say '  Dependencies: parsestr.gsf'
say ''
say '  See also: drawmark.gs, plot.gs, taylor.gs, vector.gs'
say ''
say '  Copyright (C) 2012 Bin Guan.'
say '  Distributed under GNU/GPL.'
return
