***************************************************************************************
*	$Id: rmean.gs,v 1.18 2011/09/21 23:11:43 bguan Exp $
*	Copyright (C) 2007 Bin Guan.
*	Distributed under GNU/GPL.
***************************************************************************************
function rmean(arg)
*
* Running mean of a time series.
*
input=subwrd(arg,1)
arg2=subwrd(arg,2)

if(arg2 = '')
usage()
return
endif

arg3=subwrd(arg,3)
if(!valnum(arg3))
   window=arg2
   tminus=math_int(window/2)
   tplus=window-tminus-1
   output=arg3
else
   tminus=-arg2
   tplus=arg3
   output=subwrd(arg,4)
endif
if(output = '')
   output=input
endif

tt=tminus+tplus+1

say 'RMEAN>INFO: averaging from t-'tminus' to t+'tplus'.'
if(output='display'|output='DISPLAY')
   'display tloop(ave('input',t-'tminus',t+'tplus'))'
else
   'define 'output' = tloop(ave('input',t-'tminus',t+'tplus'))'
endif
return
***************************************************************************************
function usage()
*
* Print usage information.
*
say '  Running mean of a time series.'
say ''
say '  USAGE 1: rmean <input> <window> [<output>]'
say ''
say '           Calculate running mean using the given length of window and assign result to <output>.'
say ''
say '  USAGE 2: rmean <input> <start> <end> [<output>]'
say ''
say '           Calculate running mean using the window specified by <start> and <end>, and assign'
say '           result to <output>.'
say ''
say '           If not specified, <output> defaults to <input>.'
say '           If <output> = DISPLAY, the result is displayed and not defined in a variable.' 
say ''
say '  EXAMPLE 1: rmean sst 4 sst4trmn'
say '             Successively averages the field sst over 4 time steps t-2, t-1, t, t+1 and' 
say '             defines the  result as sst4trmn.'
say ''
say '  EXAMPLE 2: rmean sst -2 1 DISPLAY'
say '             Successively averages the field sst over 4 time steps t-2, t-1, t, t+1 and' 
say '             displays the  result.'
say ''
say '  Copyright (C) 2007 Bin Guan.'
say '  Distributed under GNU/GPL.'
return
