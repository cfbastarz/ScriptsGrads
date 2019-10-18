***************************************************************************************
*       $Id: vector.gs,v 1.4 2011/02/14 23:23:24 bguan Exp $
*       Copyright (C) 2010 Bin Guan.
*       Distributed under GNU/GPL.
***************************************************************************************
function vector(arg)
*
* Draw a vector graph.
*
rc=gsfallow('on')

tmpdir='/tmp'
whoamifile='./.whoami.bGASL'
'!whoami>'whoamifile
whoami=sublin(read(whoamifile),2)
rc=close(whoamifile)
'!unlink 'whoamifile
mytmpdir=tmpdir'/bGASL-'whoami
'!mkdir -p 'mytmpdir

expr1=subwrd(arg,1)
expr2=subwrd(arg,2)
length=subwrd(arg,3)
mag=subwrd(arg,4)
color=subwrd(arg,5)
thick=subwrd(arg,6)
if(mag='')
usage()
return
endif
if(color='')
color=1
endif
if(thick='')
thick=4
endif

if(length!='' & mag!='')
'set arrscl 'length' 'mag
endif
'set ccolor 'color
'set cthick 'thick
'set arrlab off'
'display 'expr1';'expr2
'set arrlab on'

line0='vector'
line1=length' 'mag' 'color' 'thick
rc=write(mytmpdir'/legend.txt~',line0)
rc=write(mytmpdir'/legend.txt~',line1)
rc=close(mytmpdir'/legend.txt~')

return
***************************************************************************************
function usage()
*
* Print usage information.
*
say '  Draw a vector graph.'
say ''
say '  Usage: vector <expression1> <expression2> <length> <magnitude> [<color> [<thickness>]]'
say '     <expression1>: expression 1.'
say '     <expression2>: expression 2.'
say '     <length>: reference length of arrow.'
say '     <magnitude>: reference magnitude of arrow.'
say '     <color>: arrow color. Default=1.'
say '     <thickness>: arrow thickness. Default=4.'
say ''
say '  See also: legend.gs'
say ''
say '  Copyright (C) 2010 Bin Guan.'
say '  Distributed under GNU/GPL.'
return
