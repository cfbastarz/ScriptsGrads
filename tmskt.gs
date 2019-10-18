***************************************************************************************
*	$Id: tmskt.gs,v 1.7 2011/10/19 04:39:36 bguan Exp $
*	Copyright (C) 2008 Bin Guan.
*	Distributed under GNU/GPL.
***************************************************************************************
function tmskt(arg)
*
* Mask out certain calendar months (or seasons/years, depending on the time resolution) of a time series.
*
rc=gsfallow('on')

input=subwrd(arg,1)
tcals=subwrd(arg,2)
tcale=subwrd(arg,3)
output=subwrd(arg,4)
if(tcale='')
usage()
return
endif
if(output='')
output=input
endif

if(valnum(tcals)!=1 | tcals<1)
say 'TMSKT ERROR: <start> must be an integer >=1.'
say ''
return
endif
if(valnum(tcale)!=1 | tcale<1)
say 'TMSKT ERROR: <end> must be an integer >=1.'
say ''
return
endif

qdims()

'set t '_ts' '_te

*
* get number of t-point(s) per year (e.g., 12 for monthly data, 4 for seasonal data...).
*
'set time JAN2000 JAN2001'
'query dims'
line5=sublin(result,5)
tJAN1=subwrd(line5,11);tJAN1=math_int(tJAN1)
tJAN2=subwrd(line5,13);tJAN2=math_int(tJAN2)
NtperYR=tJAN2-tJAN1
say 'TMSKT>INFO: 'NtperYR' time grids per calendar year.'

if(NtperYR=1)
tcals=tcals-(_yrs-1)
tcale=tcale-(_yrs-1)
endif

tcalsminus1=tcals-1
if(NtperYR>1)
'set time Jan Dec'
* In the above, must use calendar time and start from 1st calendar month/season since <start> and <end> are specified relative to 1st calendar month/season.
else
'set t '_ts' '_te
endif
'mmskII=1'
'mmskII1=const(mmskII(t-'tcalsminus1'),0,-u)'
'mmskII2=const(mmskII(t-'tcale'),0,-u)'
'mmskII=mmskII1-mmskII2'
if(tcals<=tcale)
'mmskII=maskout(mmskII,mmskII-0.5)'
else
'mmskII=maskout(mmskII+1,mmskII+0.5)'
endif

if(NtperYR>1)
'modify mmskII seasonal'
endif
'set t '_ts' '_te
if(output='display'|output='DISPLAY')
'display ('input')*mmskII'
else
output'=('input')*mmskII'
endif
'undefine mmskII'
'undefine mmskII1'
'undefine mmskII2'

return
***************************************************************************************
function usage()
*
* Print usage information.
*
say '  Mask out certain calendar months (or seasons/years, depending on the time resolution) of a time series.'
say ''
say '  Usage 1 (for monthly time series): tmskt <input> <start> <end> [<output>]'
say '     <input>: input monthly time series.'
say '     <start>: the first calendar month not to mask out, e.g., 12 for December.'
say '     <end>: the last calendar month not to mask out, e.g., 2 for Feburary.'
say '     <output>: output monthly time series. Default=<input>.'
say '	            If <output> = DISPLAY, only a graph will be displayed.'
say ''
say '  Example: tmskt sst 12 2'
say '           This would set all months but December, January and February to missing values for the variable sst.'
say ''
say '  Usage 2 (for seasonal time series): tmskt <input> <start> <end> [<output>]'
say '     <input>: input seasonal time series.'
say '     <start>: the first calendar season not to mask out, e.g., 1 for winter.'
say '     <end>: the last calendar season not to mask out, e.g., 4 for fall.'
say '     <output>: output seasonal time series. Default=<input>.'
say '	            If <output> = DISPLAY, only a graph will be displayed.'
say ''
say '  Example: tmskt sst 1 1 sstwin'
say '             This would set all seasons but winter to missing values for the variable sst, and store the new time series in sstwin.'
say ''
say '  Usage 3 (for yearly time series): tmskt <input> <start> <end> [<output>]'
say '     <input>: input yearly time series.'
say '     <start>: the first calendar year not to mask out, e.g., 1901.'
say '     <end>: the last calendar year not to mask out, e.g., 2000.'
say '     <output>: output yearly time series. Default=<input>.'
say '	            If <output> = DISPLAY, only a graph will be displayed.'
say ''
say '  Example: tmskt sst 1901 2000 sst20c'
say '             This would set all years but 1901-2000 to missing values for the variable sst, and store the new time series in sst20c.'
say ''
say '  Dependencies: qdims.gsf'
say ''
say '  Copyright (C) 2008 Bin Guan.'
say '  Distributed under GNU/GPL.'
return
