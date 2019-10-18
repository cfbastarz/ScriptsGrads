***************************************************************************************
*       $Id: plot.gs,v 1.11 2012/01/14 23:26:38 bguan Exp $
*       Copyright (C) 2012 Bin Guan.
*       Distributed under GNU/GPL.
***************************************************************************************
function plot(arg)
*
* Draw a line graph.
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

*
* Parse -v option (variable).
*
num_var=parseopt(arg,'-','v','variable')

if(num_var=0)
usage()
return
endif

*
* Parse -r option (range).
*
range_rc=parseopt(arg,'-','r','range')

*
* Initialize other options.
*
cnt=1
while(cnt<=num_var)
_.mark.cnt=cnt+1
_.marksize.cnt=0.11
_.style.cnt=-1
_.color.cnt=cnt
_.thick.cnt=-1
_.text.cnt='Variable 'cnt
cnt=cnt+1
endwhile
_.append.1=0

*
* Parse -m option (mark).
*
rc=parseopt(arg,'-','m','mark')

*
* Parse -z option (mark size).
*
rc=parseopt(arg,'-','z','marksize')

*
* Parse -s option (style).
*
rc=parseopt(arg,'-','s','style')

*
* Parse -c option (color).
*
rc=parseopt(arg,'-','c','color')

*
* Parse -k option (thick).
*
rc=parseopt(arg,'-','k','thick')

*
* Parse -t option (text).
*
rc=parseopt(arg,'-','t','text')

*
* Parse -append option.
*
rc=parseopt(arg,'-','append','append')

'query pp2xy 0 0'
tmpxa=subwrd(result,3)
'query pp2xy 1 1'
tmpxb=subwrd(result,3)
rvratio=tmpxb-tmpxa

*
* get lower/upper boundaries
*
if(range_rc<=1)
qdims()
cnt=1
while(cnt<=num_var)
say 'PLOT>INFO: getting range...'
'varmintmp'cnt'=min(min(min(min('_.variable.cnt',t='_ts',t='_te'),x='_xs',x='_xe'),y='_ys',y='_ye'),z='_zs',z='_ze')'
'varmaxtmp'cnt'=max(max(max(max('_.variable.cnt',t='_ts',t='_te'),x='_xs',x='_xe'),y='_ys',y='_ye'),z='_zs',z='_ze')'
* In the above two lines time dimension is done first since that's much quicker.
'query defval varmintmp'cnt' 1 1'
varmin.cnt=subwrd(result,3)
'query defval varmaxtmp'cnt' 1 1'
varmax.cnt=subwrd(result,3)
cnt=cnt+1
endwhile
lowerbnd=varmin.1
upperbnd=varmax.1
cnt=2
while(cnt<=num_var)
if(lowerbnd>varmin.cnt)
lowerbnd=varmin.cnt
endif
if(upperbnd<varmax.cnt)
upperbnd=varmax.cnt
endif
cnt=cnt+1
endwhile
else
lowerbnd=_.range.1
upperbnd=_.range.2
endif

'set vrange 'lowerbnd' 'upperbnd
say 'PLOT>INFO: range = 'lowerbnd' to 'upperbnd'.'

cnt=1
while(cnt<=num_var)
if(_.mark.cnt!=-1);'set cmark '_.mark.cnt;endif
if(_.style.cnt!=-1);'set cstyle '_.style.cnt;endif
if(_.color.cnt!=-1);'set ccolor '_.color.cnt;endif
if(_.thick.cnt!=-1);'set cthick '_.thick.cnt;endif
'set digsiz '_.marksize.cnt*rvratio
'display '_.variable.cnt
cnt=cnt+1
endwhile

if(_.append.1!=1)
rc=write(mytmpdir'/legend.txt~','line')
endif
cnt=1
while(cnt<=num_var)
line=_.mark.cnt' '_.marksize.cnt' '_.style.cnt' '_.color.cnt' '_.thick.cnt' '_.text.cnt
if(_.append.1!=1)
rc=write(mytmpdir'/legend.txt~',line)
else
rc=write(mytmpdir'/legend.txt~',line,append)
endif
cnt=cnt+1
endwhile
rc=close(mytmpdir'/legend.txt~')

return
***************************************************************************************
function usage()
*
* Print usage information.
*
say '  Draw a line graph.'
say ''
say '  Usage: plot -v <var1> [<var2>...] [-r <range_from> <range_to>] [-m <mark1> [<mark2>...]] [-z <size1> [<size2>...]] [-s <style1> [<style2>...]] [-c <color1> [<color2>...]] [-k <thick1> [<thick2>...]] [-t <text1> [<text2>...]] [-append 1]'
say '     <var>: variable to be plotted.'
say '     <range_from>, <range_to>: set the axis limit. Default=the minimum and maximum values.'
say '     <mark>: Default="2 3 4...", i.e., open circle, closed circle, open square, closed square, and so on.'
say '     <size>: Mark size. Default=0.11,'
say '     <style>: Default=current GrADS setting.'
say '     <color>: Default="1 2 3...", i.e., foreground color, red, green, dark blue, and so on.'
say '     <thick>: Default=current GrADS setting.'
say '     <text>: Text to be shown in the legend (use "legend.gs"). Text beginning with a minus sign or containing spaces must be double quoted.'
say '     -append 1: use if appending to an existing plot. (Run "legend.gs" only once after all data are plotted.)'
say ''
say '  Dependencies: parsestr.gsf, parseopt.gsf, qdims.gsf'
say ''
say '  See also: legend.gs'
say ''
say '  Copyright (C) 2012 Bin Guan.'
say '  Distributed under GNU/GPL.'
return
