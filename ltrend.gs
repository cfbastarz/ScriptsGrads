***************************************************************************************
*       $Id: ltrend.gs,v 1.7 2012/02/08 23:02:04 bguan Exp $
*       Copyright (C) 2006 Bin Guan.
*       Distributed under GNU/GPL.
***************************************************************************************
function ltrend(arg)
*
* Linear trend over time (least-squares fitting).
*
rc=gsfallow('on')

input=subwrd(arg,1)
output=subwrd(arg,2)
slope=subwrd(arg,3)
rmse=subwrd(arg,4)
if(input=''); usage(); return; endif
if(output=''); output=input; endif

qdims()

'set t '_ts' '_te
'ones=1'
'tttmp=tloop(sum(ones,t='_ts',t+0))+'_ts'-1'
'tttmp=maskout(tttmp,('input')-('input')+1)'
'tttmp=ave(ave(tttmp,x='_xs',x='_xe'),y='_ys',y='_ye')'
* Note: In the above line I did not use aave() since that would not work when _xs=_xe or _ys=_ye.
'set t 1'
'trndslope=tregr(tttmp,'input',t='_ts',t='_te')'
'trndintercept=ave('input',t='_ts',t='_te')-trndslope*ave(tttmp,t='_ts',t='_te')'
'set t '_ts' '_te
'define trndrecon=trndslope*tttmp+trndintercept'
'define trnddiff=trndrecon-('input')'
if(output='DISPLAY' | output='display')
'display trndrecon'
else
'define 'output'=trndrecon'
endif
'set t 1'
if(slope!='')
'define 'slope'=trndslope'
endif
if(rmse!='')
'define 'rmse'=sqrt(ave(trnddiff*trnddiff,t='_ts',t='_te'))'
endif
'set t '_ts' '_te
'undefine ones'
'undefine tttmp'
'undefine trndslope'
'undefine trndintercept'
'undefine trndrecon'
'undefine trnddiff'

return
***************************************************************************************
function usage()
*
* Print usage information.
*
say '  Linear trend over time (least-squares fitting).'
say ''
say '  Usage: ltrend <input> [<output> [<slope> [<rmse>]]]'
say '    <input>: input field.'
say '    <output>: output field, i.e., the fitted trend. Default=<input>.'
say '    <slope>: slope of the fitted trend, i.e., change of <input> per time step.'
say '    <rmse>: root mean square error.'
say ''
say '  Dependencies: qdims.gsf'
say ''
say '  Copyright (C) 2006 Bin Guan.'
say '  Distributed under GNU/GPL.'
return
