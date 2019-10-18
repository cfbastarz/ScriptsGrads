***************************************************************************************
*	$Id: one2one.gs,v 1.10 2008/07/02 21:36:28 bguan Exp $
*	Copyright (C) 2007 Bin Guan.
*	Distributed under GNU/GPL.
***************************************************************************************
function one2one(arg)
*
* Apply one-two-one smoothing upon a time series.
*
rc=gsfallow('on')

input=subwrd(arg,1)
output=subwrd(arg,2)
iterations=subwrd(arg,3)
option=subwrd(arg,4)

if(input='')
usage()
return
endif

if(output='')
output=input
endif

if(iterations='')
iterations=1
endif

if(option='')
option='continuous'
endif

if(option='interannual')
*
* get number of t-point(s) per year (e.g., 12 for monthly data, 4 for seasonal data...).
*
qdims()
'set time JAN2000 JAN2001'
'query dims'
line5=sublin(result,5)
tJAN1=subwrd(line5,11);tJAN1=math_int(tJAN1)
tJAN2=subwrd(line5,13);tJAN2=math_int(tJAN2)
NtperYR=tJAN2-tJAN1
say 'ONE2ONE>INFO: 'NtperYR' time grids per calendar year.'
dt=NtperYR
'set t '_ts' '_te
else
dt=1
endif

'on2ontmp='input
if(iterations<=0)
'define 'output'=on2ontmp'
else
'define 'output'=tloop((on2ontmp(t-'dt')+2*on2ontmp+on2ontmp(t+'dt'))/4.0)'
endif

iterations=iterations-1
cnt=1
while(cnt<=iterations)
'define 'output'=tloop(('output'(t-'dt')+2*'output'+'output'(t+'dt'))/4.0)'
cnt=cnt+1
endwhile

if(output='display'|output='DISPLAY')
'display 'output
'undefine 'output
endif
'undefine on2ontmp'

return
***************************************************************************************
function usage()
*
* Print usage information.
*
say '  One-two-one smoothing of a time series.'
say ''
say '  USAGE: one2one <input> [<output> [<iterations> [<option>]]]'
say '     <input>: input field.'
say '     <output>: output field. Default=<input>.'
say '               If <output> = DISPLAY, only a graph will be displayed.'
say '     <iterations>: number of iterations. Default=1.'
say '                   If <iterations> <=0, no smoothing will be performed.'
say '     <option>: set to "interannual" to smooth over the same calendar months/seasons."'
say ''
say '  Dependencies: qdims.gsf'
say ''
say '  Copyright (C) 2007 Bin Guan.'
say '  Distributed under GNU/GPL.'
return
