***************************************************************************************
*	$Id: norm.gs,v 1.11 2012/04/28 01:43:21 bguan Exp $
*	Copyright (C) 2008 Bin Guan.
*	Distributed under GNU/GPL.
***************************************************************************************
function norm(arg)
*
* Normalization of a time series.
*
rc=gsfallow('on')

input=subwrd(arg,1)
output=subwrd(arg,2)
mean=subwrd(arg,3)
std=subwrd(arg,4)
base_period_tims=subwrd(arg,5)
base_period_time=subwrd(arg,6)
if(input='')
usage()
return
endif
if(output='')
output=input
endif

qdims()

if(base_period_tims='')
base_period_tims=_tims
endif
if(base_period_time='')
base_period_time=_time
endif

'set t 1'
'define nrmtmpmean=ave('input',time='base_period_tims',time='base_period_time')'

'set time 'base_period_tims' 'base_period_time
'define nrmtmpsqr=pow(('input')-nrmtmpmean,2)'

'set t 1'
'define nrmtmpstd=sqrt(ave(nrmtmpsqr,time='base_period_tims',time='base_period_time'))'
'q defval nrmtmpstd 1 1'
stdval=subwrd(result,3)

if(output!='null')
'set t '_ts' '_te
if(stdval!=0)
'define 'output'=(('input')-nrmtmpmean)/nrmtmpstd'
else
'define 'output'='input
say 'NORM>Warning: Zero standard deviation detected. No normalization was performed.'
endif
endif

'set t 1'
if(mean!='')
'define 'mean'=nrmtmpmean'
endif
if(std!='')
'define 'std'=nrmtmpstd'
endif

'set t '_ts' '_te

'undefine nrmtmpmean'
'undefine nrmtmpsqr'
'undefine nrmtmpstd'
return
***************************************************************************************
function usage()
*
* Print usage information.
*
say '  Normalization of a time series.'
say ''
say '  Usage: norm <input> [<output> [<mean> [<std> [<base_period_start> [<base_period_end>]]]]]'
say '     <input>: input time series.'
say '     <output>: output time series. Defalts to <input>.'
say '     <mean>: sample mean.'
say '     <std>: sample standard deviation.'
say '     <base_period_start>: Normalization is over the period of <base_period_start> to <base_period_end>. Specified in world coordinate, e.g., Jan1960.'
say '     <base_period_end>: Normalization is over the period of <base_period_start> to <base_period_end>. Specified in world coordinate, e.g., Dec1990.'
say ''
say '  Dependencies: qdims.gsf'
say ''
say '  Copyright (C) 2008 Bin Guan.'
say '  Distributed under GNU/GPL.'
return
