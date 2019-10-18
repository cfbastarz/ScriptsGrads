***************************************************************************************
*	$Id: rms.gs,v 1.11 2011/10/19 00:20:27 bguan Exp $
*	Copyright (C) 2011 Bin Guan.
*	Distributed under GNU/GPL.
***************************************************************************************
function rms(arg)
*
* Root mean squares.
*
rc=gsfallow('on')

input=subwrd(arg,1)
rms=subwrd(arg,2)
dimension=subwrd(arg,3)
if(rms='')
usage()
return
endif
if(dimension='')
dimension='t'
endif

qdims()

'set t '_ts' '_te
'define rmstmpsqr=pow('input',2)'

if(dimension='t')
if(_ts=_te)
say 'RMS>Error: t-dimension not varying.'
return
endif
'set t 1'
'define 'rms'=sqrt(ave(rmstmpsqr,t='_ts',t='_te'))'
endif

if(dimension='xy')
if(_xs=_xe & _ys=_ye)
say 'RMS>Error: x- and/or y-dimension not varying.'
return
endif
'set x 1'
'set y 1'
'define 'rms'=sqrt(aave(rmstmpsqr,x='_xs',x='_xe',y='_ys',y='_ye'))'
endif

'set x '_xs' '_xe
'set y '_ys' '_ye
'set t '_ts' '_te

'undefine rmstmpsqr'
return
***************************************************************************************
function usage()
*
* Print usage information.
*
say '  Root mean squares.'
say ''
say '  Usage: rms <input> <rms> [t|xy]'
say '     <input>: input field.'
say '     <rms>: root mean squares.'
say '     t: Calculations done over t-dimension (default).'
say '     xy: Calculations done over x- and/or y-dimension.'
say ''
say '  Dependencies: qdims.gsf'
say ''
say '  Copyright (C) 2011 Bin Guan.'
say '  Distributed under GNU/GPL.'
return
