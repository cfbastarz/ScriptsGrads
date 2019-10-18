***************************************************************************************
*	$Id: deseason.gs,v 1.23 2012/02/19 21:23:17 bguan Exp $
*	Copyright (C) 2011 Bin Guan.
*	Distributed under GNU/GPL.
***************************************************************************************
function deseason(arg)
*
* Remove seasonal cycle (i.e., long-term mean) from a monthly/seasonal time series.
*
rc=gsfallow('on')

input=subwrd(arg,1)
output=subwrd(arg,2)
climatology=subwrd(arg,3)
clim_start=subwrd(arg,4)
clim_end=subwrd(arg,5)
if(input='')
usage()
return
endif
if(output='')
output=input
endif
if(climatology='')
climatology='climtmp'
endif

qdims()

_tims_old=_tims
_time_old=_time

if(clim_start='')
clim_start=_tims
endif
if(clim_end='')
clim_end=_time
endif

*
* Get number of t-point(s) per year (e.g., 12 for monthly data, 4 for seasonal data...).
*
'set time JAN2000 JAN2001'
'query dims'
line5=sublin(result,5)
tJAN1=subwrd(line5,11);tJAN1=math_int(tJAN1)
tJAN2=subwrd(line5,13);tJAN2=math_int(tJAN2)
NtperYR=tJAN2-tJAN1
say 'DESEASON>INFO: 'NtperYR' time grids per calendar year.'

'set time 'clim_start' 'clim_end
qdims()

'set t '_ts' '_ts+NtperYR-1
climatology'=tloop(ave('input',t+0,t='_te','NtperYR'))'
'set time '_tims_old' '_time_old
'modify 'climatology' seasonal'
if(output!='null');output'=('input')-'climatology;endif
if(climatology='climtmp')
'undefine 'climatology
endif

return
***************************************************************************************
function usage()
*
* Print usage information.
*
say '  Remove seasonal cycle (i.e., long-term mean) from a monthly/seasonal time series.'
say ''
say '  Usage: deseason <input> [<output> [<climatology> [<clim_start> [<clim_end>]]]]'
say '     <input>: input field.'
say '     <output>: output field. Default=<input>.'
say '     <climatology>: climatology.'
say '     <clim_start>: climatology is defined over the period of <clim_start> to <clim_end>. Specified in world coordinate, such as MMMYYYY.'
say '     <clim_end>: climatology is defined over the period of <clim_start> to <clim_end>. Specified in world coordinate, such as MMMYYYY.'
say ''
say '  Dependencies: qdims.gsf'
say ''
say '  Copyright (C) 2011 Bin Guan.'
say '  Distributed under GNU/GPL.'
return
