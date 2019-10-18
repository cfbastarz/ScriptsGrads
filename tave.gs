***************************************************************************************
*	$Id: tave.gs,v 1.10 2012/05/07 19:04:41 bguan Exp $
*	Copyright (C) 2012 Bin Guan.
*	Distributed under GNU/GPL.
***************************************************************************************
function tave(arg)
*
* Time averaging (create lower resolution time series from higher resolution time series; e.g., daily to monthly).
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

step=subwrd(arg,1)

*
* Parse -v option.
*
num_var=parseopt(arg,'-','v','var')
if(num_var=0)
usage()
return
endif

*
* Initialize other options.
*
cnt=1
while(cnt<=num_var)
_.name.cnt=_.var.cnt
cnt=cnt+1
endwhile
_.undef.1=dfile_undef()
_.file.1=''
_.path.1='.'

*
* Parse -n option.
*
rc=parseopt(arg,'-','n','name')

*
* Parse -u option.
*
rc=parseopt(arg,'-','u','undef')

*
* Parse -o option.
*
rc=parseopt(arg,'-','o','file')

*
* Parse -p option.
*
rc=parseopt(arg,'-','p','path')

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

_zs_old=_zs
_ze_old=_ze

_tims_old=_tims
_time_old=_time

_ts_old=_ts
_te_old=_te

'set fwrite 'mytmpdir'/tave.dat.'randnum

'q undef'
sysundef=subwrd(result,7)

'set x 1'
'set y 1'
'set z 1'
'set t '_ts' '_te+1
'tavetmp1=sum(1,t='_ts',t+0)+'_ts'-1'
'set x '_xs_old' '_xe_old
'set y '_ys_old' '_ye_old
'set z '_zs_old' '_ze_old
cnt=0
t_start=_ts_old
'set t 't_start
'tavetmp2=tavetmp1(time+'step')-1'
'set gxout contour'
'display tavetmp2'
t_end=subwrd(result,4)
if(t_end=sysundef)
say 'TAVE>Error: time span too short. Use "set time" or "set t" to set time dimension.'
return
endif
while(t_end!=sysundef & t_end<=_te_old)
'set t 't_start
'tavetmp2=tavetmp1(time+'step')-1'
'set gxout contour'
'display tavetmp2'
t_end=subwrd(result,4)
vcnt=1
while(vcnt<=num_var)
zcnt=_zs_old
while(zcnt<=_ze_old)
'set z 'zcnt
'set gxout fwrite'
'display const(ave('_.var.vcnt',t='t_start',t='t_end'),'_.undef.1',-u)'
zcnt=zcnt+1
endwhile
vcnt=vcnt+1
endwhile
cnt=cnt+1
'set t 't_start' 't_end
qdims()
say 'Ave 'cnt' ['_tims','_time']: done.'
t_start=t_end+1
'set t 't_start
'tavetmp2=tavetmp1(time+'step')-1'
'set gxout contour'
'display tavetmp2'
t_end=subwrd(result,4)
endwhile

'disable fwrite'
'set gxout 'gxout

if(_.file.1!='')
'!cp 'mytmpdir'/tave.dat.'randnum' '_.path.1'/'_.file.1'.dat'
endif

'set x '_xs_old' '_xe_old
'set y '_ys_old' '_ye_old
'set z '_zs_old' '_ze_old
'set time '_tims_old' '_time_old
qdims()

writectl(mytmpdir'/tave.ctl.'randnum,'^tave.dat.'randnum,cnt,num_var,name,step)
if(_.file.1!='')
writectl(_.path.1'/'_.file.1'.ctl','^'_.file.1'.dat',cnt,num_var,name,step)
endif

if(_.file.1='')
dfile_old=dfile()
'open 'mytmpdir'/tave.ctl.'randnum
file_num=file_number()
'set dfile 'file_num
vcnt=1
while(vcnt<=num_var)
_.name.vcnt'='_.name.vcnt'.'file_num
vcnt=vcnt+1
endwhile
'set dfile 'dfile_old
endif

return
***************************************************************************************
function writectl(ctlfile,datfile,nt,nv,var,step)
*
* Write the .ctl file for the temporary .dat file
*
lines=9
line.1='DSET 'datfile
line.2='UNDEF '_.undef.1
line.3='TITLE Intentionally left blank.'
line.4=_xdef
line.5=_ydef
line.6=_zdef
* Note: 'nt' below is an argument of function 'writectl', not the global variable '_nt'.
line.7='TDEF 'nt' LINEAR '_tims' 'step
line.8='VARS 'nv
line.9='ENDVARS'
cnt=1
while(cnt<=lines-1)
status=write(ctlfile,line.cnt)
cnt=cnt+1
endwhile
cnt=1
while(cnt<=nv)
varline=_.var.cnt' '_nz0' 99 '_.var.cnt
status=write(ctlfile,varline)
cnt=cnt+1
endwhile
status=write(ctlfile,line.lines)
status=close(ctlfile)

return
***************************************************************************************
function dfile()
*
* Get the default file number.
*
'q file'

line1=sublin(result,1)
dfile=subwrd(line1,2)

return dfile
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

return
***************************************************************************************
function usage()
*
* Print usage information.
*
say '  Time averaging (create lower resolution time series from higher resolution time series; e.g., daily to monthly).'
say ''
say '  Usage: tave <step> -v <var1> [<var2>...] [-n <name1> [<name2>...]] [-u <undef>] [-o <file>] [-p <path>]'
say '     <step>: time step for averaging. MUST be specified in world coordinate, e.g., 6hr, 5dy, 3mo, 1yr, etc.'
say '     <var>: input variable. Can be any GrADS expression.'
say '     <name>: name for output variable. Same as <var> if unset.'
say '     <undef>: undef value for .dat and .ctl. Default=the value found in ctlinfo.'
say '     <file>: common name for output .dat and .ctl pair. If set, no variable is defined, only file output.'
say '     <path>: path to output files. Do NOT include trailing "/". Default=current path.'
say ''
say '  Note: averaging starts at the first time step of the current dimension, and ends at/before the last time step of the current dimension.'
say '        E.g., if input is 6-hourly, time is set to 06Z01JAN2000-18Z31JAN2000, and <step>=1dy, then averaging starts at 06Z01JAN2000, and ends at 00Z31JAN2000.'
say ''
say '  EXAMPLE 1 (create weekly SST from daily SST and save to a new variable "sstweek"):'
say '     set time 01JAN2000 31DEC2010'
say '     tave 7dy -v sst -n sstweek'
say ''
say '  EXAMPLE 2 (create monthly SST from daily SST and save to new files "sstmon.ctl" and "sstmon.dat"):'
say '     set time 01JAN2000 31DEC2010'
say '     tave 1mo -v sst -o sstmon'
say ''
say '  Dependencies: parsestr.gsf, parseopt.gsf, qdims.gsf'
say ''
say '  Copyright (C) 2012 Bin Guan.'
say '  Distributed under GNU/GPL.'
return
