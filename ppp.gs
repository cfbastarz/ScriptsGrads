***************************************************************************************
*	$Id: ppp.gs,v 1.31 2012/02/06 07:11:51 bguan Exp $
*	Copyright (C) 2012 Bin Guan.
*	Distributed under GNU/GPL.
***************************************************************************************
function ppp(arg)
*
* Produce image output in EPS and other formats.
*
outfile=subwrd(arg,1)
fmt1=subwrd(arg,2)
fmt2=subwrd(arg,3)
fmt3=subwrd(arg,4)
fmt4=subwrd(arg,5)
fmt5=subwrd(arg,6)
if(outfile='')
usage()
return
endif
if(fmt1='')
fmt1='eps'
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

'enable print 'mytmpdir'/pppout.gmf.'randnum
'print'
'disable print'

*
* Produce .eps file (with a timestamp).
*
if(fmt1='eps' | fmt2='eps' | fmt3='eps' | fmt4='eps' | fmt5='eps')
'!gxeps -c -i 'mytmpdir'/pppout.gmf.'randnum' -o 'mytmpdir'/pppout.eps.'randnum
'!gs -dBATCH -dNOPAUSE -q -sDEVICE=bbox 'mytmpdir'/pppout.eps.'randnum' 2>&1 |grep %%BoundingBox >'mytmpdir'/pppout.epsbb.'randnum
epsbb=sublin(read(mytmpdir'/pppout.epsbb.'randnum),2)
rc=close(mytmpdir'/pppout.epsbb.'randnum)
'!gxeps -c -s -i 'mytmpdir'/pppout.gmf.'randnum' -o 'outfile'.eps'
'!sed -i -e s/^%%BoundingBox:.\*\$/"'epsbb'"/ 'outfile'.eps'
say 'PPP>INFO: 'outfile'.eps generated.'
endif

*
* Produce .eps.clip file (with a timestamp). Now identical to .eps.
*
if(fmt1='eps.clip' | fmt2='eps.clip' | fmt3='eps.clip' | fmt4='eps.clip' | fmt5='eps.clip')
'!gxeps -c -i 'mytmpdir'/pppout.gmf.'randnum' -o 'mytmpdir'/pppout.eps.'randnum
'!gs -dBATCH -dNOPAUSE -q -sDEVICE=bbox 'mytmpdir'/pppout.eps.'randnum' 2>&1 |grep %%BoundingBox >'mytmpdir'/pppout.epsbb.'randnum
epsbb=sublin(read(mytmpdir'/pppout.epsbb.'randnum),2)
rc=close(mytmpdir'/pppout.epsbb.'randnum)
'!gxeps -c -s -i 'mytmpdir'/pppout.gmf.'randnum' -o 'outfile'.eps.clip'
'!sed -i -e s/^%%BoundingBox:.\*\$/"'epsbb'"/ 'outfile'.eps'
say 'PPP>INFO: 'outfile'.eps.clip generated.'
endif

*
* Produce .pdf file (clip).
*
if(fmt1='pdf' | fmt2='pdf' | fmt3='pdf' | fmt4='pdf' | fmt5='pdf')
'!gxeps -c -i 'mytmpdir'/pppout.gmf.'randnum' -o 'mytmpdir'/pppout.eps.clip.'randnum
'!gs -dBATCH -dNOPAUSE -q -sDEVICE=bbox 'mytmpdir'/pppout.eps.clip.'randnum' 2>&1 |grep %%BoundingBox >'mytmpdir'/pppout.epsbb.'randnum
epsbb=sublin(read(mytmpdir'/pppout.epsbb.'randnum),2)
rc=close(mytmpdir'/pppout.epsbb.'randnum)
'!sed -i -e s/^%%BoundingBox:.\*\$/"'epsbb'"/ 'mytmpdir'/pppout.eps.clip.'randnum
'!gs -dBATCH -dNOPAUSE -q -sDEVICE=pdfwrite -dEPSCrop -sOutputFile='outfile'.pdf 'mytmpdir'/pppout.eps.clip.'randnum' 2>/dev/null'
say 'PPP>INFO: 'outfile'.pdf generated.'
endif

*
* Produce .png file (clip).
*
if(fmt1='png' | fmt2='png' | fmt3='png' | fmt4='png' | fmt5='png')
'!gxeps -c -i 'mytmpdir'/pppout.gmf.'randnum' -o 'mytmpdir'/pppout.eps.clip.'randnum
'!gs -dBATCH -dNOPAUSE -q -sDEVICE=bbox 'mytmpdir'/pppout.eps.clip.'randnum' 2>&1 |grep %%BoundingBox >'mytmpdir'/pppout.epsbb.'randnum
epsbb=sublin(read(mytmpdir'/pppout.epsbb.'randnum),2)
rc=close(mytmpdir'/pppout.epsbb.'randnum)
'!sed -i -e s/^%%BoundingBox:.\*\$/"'epsbb'"/ 'mytmpdir'/pppout.eps.clip.'randnum
'!eps2png -png256 -scale 1.2 -output 'outfile'.png 'mytmpdir'/pppout.eps.clip.'randnum' 2>/dev/null'
say 'PPP>INFO: 'outfile'.png generated.'
endif
***************************************************************************************
function usage()
*
* Print usage information.
*
say '  Produce image output in EPS and other formats.'
say ''
say '  Usage: ppp <outfile> [<format1>] [<format2>]...'
say '    <outfile>: full path of output file. Do NOT include the suffix (e.g., use mypath/myfile, instead of mypath/myfile.eps).'
say '    <format>: currently eps, pdf and png are supported; defaults to eps.'
say ''
say '  Note: png format requires eps2png. See http://search.cpan.org/~jv/eps2png/ for more information.'
say ''
say '  Copyright (C) 2012 Bin Guan.'
say '  Distributed under GNU/GPL.'
