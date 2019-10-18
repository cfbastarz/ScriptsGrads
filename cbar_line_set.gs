*  Script to plot a legend for line graphs
*
*  Written MC, LSCE, Mars 2000
*
*  Modified "cbar_line.gs" script to plot for abitrary virtual page size
*  Modified "cbar_line.gs" script to plot for control line and mark detail
*
*  Modified by Y.Kamae (09/08/30)
*
function cbarline (args)
*
****** run script to create a legend
******    cbar_line_set -x X -y Y -r regul -n thick -l line -c color -m mark -z size -sn strthick -sc strcolor -sz strsize -t "text" -p
******
******  cbar_line parameters:
******    x        x position on graph
******    y        y position on graph
******    regul    regulation of the line size by both the sides
******    thick    thickness of the line
******    line     style of the line
******    color    colors of the line and symbols
******    mark     symbols type
******    size     symbols size
******    strthick strings thickness
******    strcolor strings colors
******    strsize  strings sizes
******    text     text to be written for each line
******             must be double quoted
******    p        if set, user can click on graphic to place legend.
******
******  Use cbar_line without parameters to get a short discription.
******  Function call and switches can be uppercase and lowercase.
******
******  Defaults are no symbol, no lines, color white and no text.
******  If one keyword misses a value, 
******  cbar_line uses the default for the remaining values.
******  If you wish to include zeros (e.g. no symbol for one line),
******  zeros has to be double quoted (s. 2. example below).
******
*
***********************   STANDARDS   **************************************************
i=1
f=subwrd(args,i)
xerr=0
yerr=0
rerr=0
nerr=0
lerr=0
cerr=0
merr=0
zerr=0
snerr=0
skerr=0
szerr=0
terr=0
xx=0
yy=0
r=0
n=0
l=0
k=0
m=0
z=0
sn=0
sk=0
sz=0
t=0
placeit=0
***********************   USAGE   **************************************************
usage1="usage: cbar_line_set -x X -y Y -n thick -l line -c color -m mark -z size -sn strthick -sc strcolor -sz strsize -t "text" -p"
usage2="-x X         position on graph (Default 1)"
usage3="-y Y         position on graph (Default 1)"
usage4="-r regul     regulation of the line size by both the sides (Default 0.00=no regulation)"
usage5="-n thick     thickness of the line (Default 6)"
usage6="-l line      line type(Default 0=no line)"
usage7="-c color     colors of the line and symbols (Default 0=white)"
usage8="-m mark      symbols type (Default 0=no symbol)"
usage9="-z size      symbols size (Default 0.10)"
usage10="-sn strthick strings thick (Default 4)"
usage11="-sc strcolor strings color (Default 1=black)"
usage12="-sz strsize  strings size (Default 0.17)"
usage13="-t text     text for each line/symbol, must be double quoted"
usage14="-p          if set, user can click on graphic to set legend."
usage15=" "
usage16="If one keyword misses a value, uses default for the remaining"
usage17="To include zeros, zeros has to be double quoted"
usage18='Ex.: cbar_line_set -x 1 -y 7 -r 0.00 -n 6 -l 1 -c 1 -m 1 -z 0.10 -sn 4 -sc 1 -sz 0.17 -t "line1" -p'

if (f='')
 say usage1
 say usage2
 say usage3
 say usage4
 say usage5
 say usage6
 say usage7
 say usage8
 say usage9
 say usage10
 say usage11
 say usage12
 say usage13
 say usage14
 say usage15
 say usage16
 say usage17
 say usage18
 return
endif

while (f!='')
  opt = substr(f,2,2)

  if (opt='x' | opt='y' | opt='X' | opt='Y')
   i=i+1
   arg = subwrd(args,i)
   ttt=substr(arg,1,1)
   if (ttt='-' | ttt='')
    i=i-1
    if (opt='x' | opt='X')
     xerr=1
     say '-x error: X position missing!'
     say '          x=1 will be used.'
    endif
    if (opt='y' | opt='Y')
     yerr=1
     say '-y error: Y position missing!'
     say '          y=1 will be used.'
    endif
   endif
   if ((opt='x' | opt='X') & xerr=0); xx=stripstr(arg); endif;
   if ((opt='y' | opt='Y') & yerr=0); yy=stripstr(arg); endif;
  endif

  if (opt='p'); placeit=1; endif;

  if (opt='r' | opt='R')
   i=i+1
   arg = subwrd(args,i)
   ttt=substr(arg,1,4)
   if (ttt='-' | ttt='')
    rerr=1
    say '-r error: regulation missing!'
    say '          take 0= no regulation'
   endif
   if (rerr!=1)
    rerr=2
    while (ttt!='' & ttt!='-')
     r=r+1
     i=i+1
     regul.r=stripstr(arg)
     arg = subwrd(args,i)
     ttt=substr(arg,1,1)
    endwhile
    i=i-1
   endif
  endif

  if (opt='n' | opt='N')
   i=i+1
   arg = subwrd(args,i)
   ttt=substr(arg,1,1)
   if (ttt='-' | ttt='')
    nerr=1
    say '-n error: thick missing!'
    say '          take 6= thickness 6'
   endif
   if (nerr!=1)
    nerr=2
    while (ttt!='' & ttt!='-')
     n=n+1
     i=i+1
     thick.n=stripstr(arg)
     arg = subwrd(args,i)
     ttt=substr(arg,1,1)
    endwhile
    i=i-1
   endif
  endif

  if (opt='l' | opt='L')
   i=i+1
   arg = subwrd(args,i)
   ttt=substr(arg,1,1)
   if (ttt='-' | ttt='')
    lerr=1
    say '-l error: line missing!'
    say '          take 0= no line'
   endif
   if (lerr!=1)
    lerr=2
    while (ttt!='' & ttt!='-')
     l=l+1
     i=i+1
     lines.l=stripstr(arg)
     arg = subwrd(args,i)
     ttt=substr(arg,1,1)
    endwhile
    i=i-1
   endif
  endif

  if (opt='c' | opt='C')
   i=i+1
   arg = subwrd(args,i)
   ttt=substr(arg,1,1)
   if (ttt='-' | ttt='')
    cerr=1
    say '-c error: color missing!'
    say '          take 1=white for all'
   endif
   if (cerr!=1)
    cerr=2
    while (ttt!='' & ttt!='-')
     k=k+1
     i=i+1
     cols.k=stripstr(arg)
     arg = subwrd(args,i)
     ttt=substr(arg,1,1)
    endwhile
    i=i-1
   endif
  endif

  if (opt='m' | opt='M')
   i=i+1
   arg = subwrd(args,i)
   ttt=substr(arg,1,1)
   if (ttt='-' | ttt='')
    merr=1
    say '-m error: mark missing!'
    say '          take 0= no mark'
   endif
   if (merr!=1)
    merr=2
    while (ttt!='' & ttt!='-')
     m=m+1
     i=i+1
     marks.m=stripstr(arg)
     arg = subwrd(args,i)
     ttt=substr(arg,1,1)
    endwhile
    i=i-1
   endif
  endif

  if (opt='z' | opt='Z')
   i=i+1
   arg = subwrd(args,i)
   ttt=substr(arg,1,4)
   if (ttt='-' | ttt='')
    zerr=1
    say '-z error: size missing!'
    say '          take 0.10'
   endif
   if (zerr!=1)
    zerr=2
    while (ttt!='' & ttt!='-')
     z=z+1
     i=i+1
     size.z=stripstr(arg)
     arg = subwrd(args,i)
     ttt=substr(arg,1,1)
    endwhile
    i=i-1
   endif
  endif

  if (opt='sn' | opt='SN')
   i=i+1
   arg = subwrd(args,i)
   ttt=substr(arg,1,1)
   if (ttt='-' | ttt='')
    snerr=1
    say '-sn error: strthick missing!'
    say '          take 4'
   endif
   if (snerr!=1)
    snerr=2
    while (ttt!='' & ttt!='-')
     sn=sn+1
     i=i+1
     strthick.sn=stripstr(arg)
     arg = subwrd(args,i)
     ttt=substr(arg,1,1)
    endwhile
    i=i-1
   endif
  endif

  if (opt='sc' | opt='SC')
   i=i+1
   arg = subwrd(args,i)
   ttt=substr(arg,1,1)
   if (ttt='-' | ttt='')
    skerr=1
    say '-sc error: strcolor missing!'
    say '          take 1'
   endif
   if (scerr!=1)
    skerr=2
    while (ttt!='' & ttt!='-')
     sk=sk+1
     i=i+1
     strcolor.sk=stripstr(arg)
     arg = subwrd(args,i)
     ttt=substr(arg,1,1)
    endwhile
    i=i-1
   endif
  endif

  if (opt='sz' | opt='SZ')
   i=i+1
   arg = subwrd(args,i)
   ttt=substr(arg,1,4)
   if (ttt='-' | ttt='')
    szerr=1
    say '-sz error: strsize missing!'
    say '          take 0.17'
   endif
   if (szerr!=1)
    szerr=2
    while (ttt!='' & ttt!='-')
     sz=sz+1
     i=i+1
     strsize.sz=stripstr(arg)
     arg = subwrd(args,i)
     ttt=substr(arg,1,1)
    endwhile
    i=i-1
   endif
  endif

  if (opt='t' | opt='T')
   i=i+1
   arg = subwrd(args,i)
   ttt=substr(arg,1,1)
   ta=substr(arg,1,1)
   if (ttt != '')
     te=substr(arg,wrdlen(arg),1)
   endif
   if (ttt='-' | ttt='')
    terr=1
    say '-t error: text missing!'
    say 'ABORT ! ! !'
    return
   endif
   if (terr!=1)
    terr=2
    if (ta!='"')
      say '-t error: text must be double quoted!'
      say 'ABORT ! ! !'
      return
    endif
    while (ttt!='' & ttt!='-')
     t=t+1
     i=i+1
     texts.t=stripstr(arg)
     while (te!='"')
      arg = subwrd(args,i)
      ttt=substr(arg,1,1)
      ta=substr(arg,1,1)
      if (ttt != '')
       te=substr(arg,wrdlen(arg),1)
      endif
      if (ttt='-' | ttt='')
        say '-t error: text must be quoted!'
        say 'ABORT ! ! !'
        return
      endif
      if (te='"') 
        arg=stripstr(arg)
      endif
      texts.t=texts.t%' '%arg
      i=i+1
     endwhile
     arg = subwrd(args,i)
     ttt=substr(arg,1,1)
     ta=substr(arg,1,1)
     if (ttt != '')
      te=substr(arg,wrdlen(arg),1)
     endif
    endwhile
    i=i-1
   endif
  endif
  i=i+1
  f=subwrd(args,i)
endwhile

*if (n!=l | n!=k | n!=m | n!=z | n!=sn | n!=sk | n!=sz | n!=t | l!=k | l!=m | l!=z | l!=sn | l!=sk | l!=sz | l!=t | k!=m | k!=z | k!=sn | k!=sk | k!=sz | k!=t | m!=z | m!=sn | m!=sk | m!=sz | m!=t | z!=sn | z!=sk | z!=sz | z!=t | sn!=sk | sn!=sz | sn!=t | sk!=sz | sk!=t | sz!=t )
*   say '# of thick, line, color, mark, size, strthick, strcolor, strsize and/or text not equal.'
*   say '# thick  'n
*   say '# line  'l
*   say '# color 'k
*   say '# mark  'm
*   say '# size  'z
*   say '# strthick  'sn
*   say '# strcolor  'sk
*   say '# strsize  'sz
*   say '# text  't
*endif

tmp1=max(n,l)
tmp2=max(k,m)
tmp3=max(z,sn)
tmp4=max(sk,sz)
tmp5=max(t,tmp1)
tmp6=max(tmp2,tmp3)
tmp7=max(tmp4,tmp5)
tmp8=max(tmp6,tmp7)
maximum=max(tmp8,r)

p=0 
while (p<maximum)
  p=p+1
  if (p>r); regul.p=0.00; endif
  if (p>n); thick.p=6; endif
  if (p>l); lines.p=1; endif
  if (p>k); cols.p=1; endif
  if (p>m); marks.p=0; endif
  if (p>z); size.p=0.10; endif
  if (p>sn); strthick.p=4; endif
  if (p>sk); strcolor.p=1; endif
  if (p>sz); strsize.p=0.17; endif
  if (p>t); texts.p=''; endif
endwhile


'query gxinfo'
****** example: rec2 =>   Page Size = 11 by 8.5
rec2 = sublin(result,2)
******          rec3 =>   X Limits = 1.3 to 10.2
rec3 = sublin(result,3)
******          rec4 =>   Y Limits = 1.58 to 6.92
rec4 = sublin(result,4)

xsiz = subwrd(rec2,4)
ysiz = subwrd(rec2,6)
yhi = subwrd(rec4,6)
ylo = subwrd(rec4,4)
xhi = subwrd(rec3,6)
xlo = subwrd(rec3,4)
xd = xsiz - xhi
yd = ysiz - ylo

if (xx=0); xx=xlo; endif;
if (yy=0); yy=yhi; endif;
if (placeit=1)
  say ''
  say 'Click where you want the left upper corner of the legend'
  'query bpos'
  xbpos = subwrd(result,3)
  ybpos = subwrd(result,4)
  'query pp2xy 'xbpos' 'ybpos
  x = subwrd(result,3)
  y = subwrd(result,6)
  say 'Print legend at X Y: 'x' 'y
  xx=x
  yy=y
endif

xl=xx
xwid = xsiz/20
xr=xl+xwid
y=yy
ywid=yd/20
y=y+ywid


o=0
while (o<maximum)
  o=o+1
  y=y-ywid
  'set line 'cols.o' 'lines.o' 'thick.o
  'draw line 'xl+regul.o' 'y' 'xr-regul.o' 'y
  'draw mark 'marks.o' 'xl' 'y' 'size.o
  'draw mark 'marks.o' 'xr' 'y' 'size.o
*  'set string 1 l 5'
  'set string 'strcolor.o' l 'strthick.o
  'set strsiz 'strsize.o
  'draw string '%(xr+0.1)%' 'y' 'texts.o

  say '-- set cbar_line --'
  say 'color='cols.o' style='lines.o' thick='thick.o
  say 'line X='xl'+'regul.o'~'xr'-'regul.o', Y='y
  say 'mark='marks.o' size='size.o
  say 'strcolor='strcolor.o' strthick='strthick.o' strsize='strsize.o
  say ' '
endwhile


exit







*************************   MAXIMUM NUMBER   *************************************************
function max(wert1, wert2)
* liefert die groessere von zwei Zahlen
if (wert1 <= wert2)
 return (wert2)
else
 return (wert1)
endif
return

*************************   LENGTH OF WORD   *************************************************
function wrdlen (arg)
i=1
s=subwrd(arg,1)
if (s='') 
 return 0
else
 t=substr(s,i,i)
 while (t!='')
  i=i+1
  t=substr(s,i,i)
 endwhile 
endif

return (i-1)


*************************   STRIP STRING OF DOUBLE QUOTES  *************************************************
function stripstr (arg)

i=1
len=0
s=subwrd(arg,i)
if (s='') 
 return 0
else
 a=substr(s,1,1)
 if (a='"')
  s=substr(s,2,wrdlen(s))
 endif
 e=substr(s,wrdlen(s),1)
 if (e='"')
  s=substr(s,1,wrdlen(s)-1)
 endif
endif

return s
