***************************************************************************************
*       $Id: drawline.gs,v 1.8 2009/07/08 22:43:26 bguan Exp $
*       Copyright (C) 2005 Bin Guan.
*       Distributed under GNU/GPL.
***************************************************************************************
function drawline(arg)
*
* Draw lines in specified locations.
*
if(subwrd(arg,2)='')
usage()
return
endif

'query gxinfo'
line3=sublin(result,3)
line4=sublin(result,4)
x1=subwrd(line3,4)
x2=subwrd(line3,6)
y1=subwrd(line4,4)
y2=subwrd(line4,6)
line5=sublin(result,5)
xaxis=subwrd(line5,3)
yaxis=subwrd(line5,6)

cnt=1
word=subwrd(arg,cnt)
while(word!='')
axis=word
cnt=cnt+1
word=subwrd(arg,cnt)
while(word!='' & word!='Lon' & word!='Lat' & word!='Lev' & word!='Val' & word!='Xdim' & word!='Time')
wcoor=word
if(xaxis=axis)
  if(yaxis='Time')
  'query w2xy 'wcoor' 0000z1Jan0000'
  else
  'query w2xy 'wcoor' 0'
  endif
xcoor=subwrd(result,3)
'draw line 'xcoor' 'y1' 'xcoor' 'y2
endif
if(yaxis=axis)
  if(xaxis='Time')
  'query w2xy 0000z1Jan0000 'wcoor
  else
  'query w2xy 0 'wcoor
  endif
ycoor=subwrd(result,6)
'draw line 'x1' 'ycoor' 'x2' 'ycoor
endif
cnt=cnt+1
word=subwrd(arg,cnt)
endwhile
endwhile
return
***************************************************************************************
function usage()
*
* Print usage information.
*
say '  Draw lines in specified locations.'
say ''
say '  Usage: drawline Lon|Lat|Lev|Val|Time <coordinate> [<coordinate>...] [Lon|Lat|Lev|Val|Time <coordinate> [<coordinate>...]] ...'
say '    <coordinate>: world coordinate conforming to GrADS convention. E.g., time should be specified as HH:MMZDDMMMYYYY, MMMYYYY, etc.'
say ''
say '  Example 1: drawline Lon 180 Lat 0'
say '             Draw international date line and equator.'
say ''
say '  Example 2: drawline Val -1 0 1'
say '             Draw lines with value -1, 0 and 1.'
say ''
say '  Note: Proper capitalization MUST be used for key words Lon, Lat, Lev, Val and Time.'
say ''
say '  Copyright (C) 2005 Bin Guan.'
say '  Distributed under GNU/GPL.'
return
