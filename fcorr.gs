***************************************************************************************
*       $Id: fcorr.gs,v 1.12 2012/05/07 19:04:41 bguan Exp $
*       Copyright (C) 2007 Bin Guan.
*       Distributed under GNU/GPL.
***************************************************************************************
function fcorr(arg)
*
* Point-by-point temporal correlations between two fields.
*
rc=gsfallow('on')

*
* Save gxout info.
*
'query gxinfo'
line1=sublin(result,1)
gxout=subwrd(line1,4)
if(gxout='Clear')
gxout='Contour'
endif
if(gxout='Shaded2')
gxout='Shade2'
endif

tmpdir='/tmp'
whoamifile='./.whoami.bGASL'
'!whoami>'whoamifile
whoami=sublin(read(whoamifile),2)
rc=close(whoamifile)
'!unlink 'whoamifile
mytmpdir=tmpdir'/bGASL-'whoami
'!mkdir -p 'mytmpdir

randnumfile='./.randnum.bGASL'
'!RANDOM=$$;echo $RANDOM>'randnumfile
randnum=sublin(read(randnumfile),2)
rc=close(randnumfile)
'!unlink 'randnumfile

input1=subwrd(arg,1)
input2=subwrd(arg,2)
if(input2='')
usage()
return
endif
output=subwrd(arg,3)
if(output='')
output='fcorrout'
endif

*
* Ensure x-coordinates are integers and there are no redundant grid points.
*
qdims()
_xs_old=_xs
_xe_old=_xe
if(math_int(_xs)!=_xs | math_int(_xe)!=_xe)
xs_new=math_nint(_xs)
xe_new=math_nint(_xe)
'set x 'xs_new' 'xe_new
qdims()
endif
if(_lone-_lons>=360)
rddnt_points=(_lone-_lons-360)/_dlon+1
'set x '_xs' '_xe-rddnt_points
qdims()
endif

*
* Ensure y-coordinates are integers.
*
qdims()
_ys_old=_ys
_ye_old=_ye
if(math_int(_ys)!=_ys | math_int(_ye)!=_ye)
ys_new=math_nint(_ys)
ye_new=math_nint(_ye)
'set y 'ys_new' 'ye_new
qdims()
endif

*
* Calculate correlations and write .dat file.
*
'set fwrite 'mytmpdir'/fcorr.dat.'randnum
'set t '_ts
zcnt=_zs
while(zcnt<=_ze)
'set z 'zcnt
ycnt=_ys
while(ycnt<=_ye)
'set y 'ycnt
xcnt=_xs
while(xcnt<=_xe)
'set x 'xcnt
'set gxout fwrite'
'display const(tcorr('input1','input2',t='_ts',t='_te'),'dfile_undef()',-u)'
xcnt=xcnt+1
endwhile
ycnt=ycnt+1
endwhile
zcnt=zcnt+1
endwhile
'disable fwrite'
'set gxout 'gxout

*
* Write .ctl file.
*
lines=9
line.1='DSET ^fcorr.dat.'randnum
line.2='UNDEF 'dfile_undef()
line.3=_xdef
line.4=_ydef
line.5=_zdef
line.6=_tdef
line.7='VARS 1'
line.8=output' '_nz0' 99 Add description here.'
line.9='ENDVARS'
cnt=1
while(cnt<=lines)
status=write(mytmpdir'/fcorr.ctl.'randnum,line.cnt)
cnt=cnt+1
endwhile
status=close(mytmpdir'/fcorr.ctl.'randnum,line.cnt)

*
* Open .ctl file and fetch values.
*
'open 'mytmpdir'/fcorr.ctl.'randnum
file_num=file_number()
'set x '_xs_old' '_xe_old
* The above line is needed to ensure that there will not be a gap near the prime meridian in global maps if unintended.
'set y '_ys_old' '_ye_old
'set z '_zs' '_ze
output'='output'.'file_num
'close 'file_num

*
* Restore original dimension environment.
*
*'set x '_xs_old' '_xe_old
*'set y '_ys_old' '_ye_old
*'set z '_zs' '_ze
*These were already set above.
'set t '_ts' '_te

return
***************************************************************************************
function file_number()
*
* Get the number of files opened.
*
'q files'
line1=sublin(result,1)
if(line1='No files open')
return 0
endif

lines=1
while(sublin(result,lines+1)!='')
lines=lines+1
endwhile

return lines/3
***************************************************************************************
function dfile_undef()
*
* Get undef value from the default .ctl file. (Not 'q undef', which is for output.)
*
'q ctlinfo'
if(result='No Files Open')
return 'unknown'
endif

lines=1
while(1)
lin=sublin(result,lines)
if(subwrd(lin,1)='undef'|subwrd(lin,1)='UNDEF')
return subwrd(lin,2)
endif
lines=lines+1
endwhile
***************************************************************************************
function usage()
*
* Print usage information.
*
say '  Point-by-point temporal correlations between two fields.'
say ''
say '  Usage: fcorr <input1> <input2> [<output>]'
say '     <input1>: Input field 1.'
say '     <input2>: Input field 2.'
say '     <output>: Output field. Default="fcorrout".'
say ''
say '  Dependencies: qdims.gsf'
say ''
say '  Copyright (C) 2007 Bin Guan.'
say '  Distributed under GNU/GPL.'
return
