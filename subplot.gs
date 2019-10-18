***************************************************************************************
*       $Id: subplot.gs,v 1.55 2012/05/06 22:12:36 bguan Exp $
*       Copyright (C) 2012 Bin Guan.
*       Distributed under GNU/GPL.
***************************************************************************************
function subplot(arg)
*
* Prepare GrADS for a multi-panel plot.
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

*
* Read input/initialize.
*
ntot=subwrd(arg,1)
idx=subwrd(arg,2)
if(idx='')
  usage()
return
endif
wrd3=subwrd(arg,3)
if(valnum(wrd3))
  ncol=wrd3
else
  ncol=2
endif
nrow=ntot/ncol
if(nrow!=math_int(nrow))
  nrow=math_int(nrow)+1
endif
*_.islandscape.1=''
_.istall.1=0
_.istight.1=0
_.isxtight.1=0
_.isytight.1=0
_.scalefactor.1=1
_.xyratio.1=0
_.morespacex.1=0
_.morespacey.1=0
_.morepadx.1=0
_.morepady.1=0
_.hleft.1=0
_.yleft.1=0
*rc=parseopt(arg,'-','landscape','islandscape')
rc=parseopt(arg,'-','tall','istall')
rc=parseopt(arg,'-','tight','istight')
rc=parseopt(arg,'-','xtight','isxtight')
rc=parseopt(arg,'-','ytight','isytight')
rc=parseopt(arg,'-','scale','scalefactor')
rc=parseopt(arg,'-','xy','xyratio')
rc=parseopt(arg,'-','xs','morespacex')
rc=parseopt(arg,'-','ys','morespacey')
rc=parseopt(arg,'-','xp','morepadx')
rc=parseopt(arg,'-','yp','morepady')
rc=parseopt(arg,'-','hleft','hleft')
rc=parseopt(arg,'-','yleft','yleft')

*
* Make a .ctl file with no data.
*
ctllines=10
ctlline.1='DSET ^%y4.dat'
ctlline.2='UNDEF -9999'
ctlline.3='options template'
ctlline.4='xdef 2 levels 0 216'
ctlline.5='ydef 2 levels -90 90'
ctlline.6='zdef 1 levels 1000'
ctlline.7='tdef 1 linear 01jan0001 1dy'
ctlline.8='VARS 1'
ctlline.9='var 0 99 var'
ctlline.10='ENDVARS'
cnt=1
while(cnt<=ctllines)
  status=write(mytmpdir'/subplot.ctl~',ctlline.cnt)
  cnt=cnt+1
endwhile
status=close(mytmpdir'/subplot.ctl~')
'open 'mytmpdir'/subplot.ctl~'
* At this point, at least one file is opened.

*
* Needed because xlab/ylab could have been turned off earlier for a tight plot.
*
'set xlab on'
'set ylab on'

*
* Get aspect ratio of plot area.
*
qdims()
num_varying_dim=(_xs!=_xe)+(_ys!=_ye)+(_zs!=_ze)+(_ts!=_te)
if(num_varying_dim<1 | num_varying_dim>2)
  say 'SUBPLOT>ERROR: # of varying dimensions must be 1 or 2. See current setting below.'
  'query dims'
  cnt=2
  while(cnt<=6)
    say ' 'sublin(result,cnt)
    cnt=cnt+1
  endwhile
  return
endif
xy_ratio=1
'query gxinfo'
line6=sublin(result,6)
mproj=subwrd(line6,3)
if(num_varying_dim=1)
*
*  For line graph, do nothing (use pre-set aspect ratio).
*
else
  if(_xs!=_xe & _ys!=_ye & mproj=2)
*
*   For Lat/Lon projection, aspect ratio is calculated.
*
    multi_factor=(5/3)/(360/180)
    lonlat_ratio=(_lone-_lons)/(_late-_lats)
    xy_ratio=multi_factor*lonlat_ratio
  else
*
*   For all other 2-D maps, aspect ratio is obtained by test-plotting (using current dimension setting).
*
    'set grid off'
    'set grads off'
    'set frame off'
    'set xlab off'
    'set ylab off'
    'set mpdraw off'
    'set gxout contour'
    'set clevs -1e9'
    'display lat'
    'q gxinfo'
    line3=sublin(result,3)
    line4=sublin(result,4)
    tmpa=subwrd(line3,4)
    tmpb=subwrd(line3,6)
    tmpc=subwrd(line4,4)
    tmpd=subwrd(line4,6)
    xy_ratio=(tmpb-tmpa)/(tmpd-tmpc)
    'set grid on'
    'set grads on'
    'set frame on'
    'set xlab on'
    'set ylab on'
    'set mpdraw on'
    'set gxout 'gxout
  endif
endif
if(_.xyratio.1)
  xy_ratio=_.xyratio.1
endif

*
* Set up margins/spacing/padding.
*
'set vpage off'
'set parea off'
'query gxinfo'
line2=sublin(result,2)
realpagewid=subwrd(line2,4)
realpagehgt=subwrd(line2,6)
scaledpagewid=realpagewid*_.scalefactor.1
scaledpagehgt=realpagehgt*_.scalefactor.1
marginleft=0.25
marginright=0.25
margintop=0.5
marginbottom=0.5
*spacex0=0
*spacey0=0
*padx0=0.33
*pady0=0.22
spacex0=-1.1
spacey0=-0.88
padx0=0.88
pady0=0.66
spacex=spacex0+_.morespacex.1
spacey=spacey0+_.morespacey.1
padx=padx0+_.morepadx.1
pady=pady0+_.morepady.1
if(_.istight.1)
  spacex=-2*padx
  spacey=-2*pady
endif
if(_.isxtight.1)
  spacex=-2*padx
endif
if(_.isytight.1)
  spacey=-2*pady
endif

'set z 1'
'set t 1'
* Above: set x/y-varying and z/t-fixed dimension because later I use "q defval 1 1" to pass values between sub-plots.
* If z/t is not fixed, "q defval 1 1" may get undefined values if sub-plots are over different z/t's.

*
* Get virtual page width and height.
*
if(_.istall.1=0)
  tmpwid=(scaledpagewid-marginleft-marginright-2*padx*ncol-spacex*(ncol-1))/ncol
  'define vpagewid='tmpwid
  'define vpagehgt=vpagewid/'xy_ratio
else
  tmphgt=(scaledpagehgt-margintop-marginbottom-2*pady*nrow-spacey*(nrow-1))/nrow
  'define vpagehgt='tmphgt
  'define vpagewid=vpagehgt*'xy_ratio
endif
'define vpagewidpadded=vpagewid+2*'padx
'define vpagehgtpadded=vpagehgt+2*'pady
if(_.hleft.1)
  idx_left=idx-nrow
  'query defval vpageya'idx_left' 1 1'
  vpage_ya_left=subwrd(result,3)
  'query defval vpageyb'idx_left' 1 1'
  vpage_yb_left=subwrd(result,3)
  'define vpagehgtpadded='vpage_ya_left'-'vpage_yb_left
  'define vpagehgt=vpagehgtpadded-2*'pady
  'define vpagewid=vpagehgt*'xy_ratio
  'define vpagewidpadded=vpagewid+2*'padx
endif

*
* Get virtual page boundaries.
*
row_coordinate=idx-math_int((idx-1)/nrow)*nrow
col_coordinate=math_int((idx-1)/nrow)+1
if(idx=1)
  'define vpagexa'idx'=0+'marginleft
  'define vpageya'idx'='realpagehgt'-'margintop
endif
if(idx>1&idx<=nrow)
  idx_above=idx-1
  'define vpagexa'idx'=vpagexa'idx_above
  'define vpageya'idx'=vpageyb'idx_above'-'spacey
endif
if(idx>nrow&row_coordinate=1)
  idx_left=idx-nrow
  'define vpagexa'idx'=vpagexb'idx_left'+'spacex
  'define vpageya'idx'=vpageya'idx_left
endif
if(idx>nrow&row_coordinate!=1&_.yleft.1=0)
  idx_above=idx-1
  idx_left=idx-nrow
  'define vpagexa'idx'=vpagexb'idx_left'+'spacex
  'define vpageya'idx'=vpageyb'idx_above'-'spacey
endif
if(idx>nrow&row_coordinate!=1&_.yleft.1=1)
  idx_left=idx-nrow
  'define vpagexa'idx'=vpagexb'idx_left'+'spacex
  'define vpageya'idx'=vpageya'idx_left
endif
'define vpagexb'idx'=vpagexa'idx'+vpagewidpadded'
'define vpageyb'idx'=vpageya'idx'-vpagehgtpadded'

*
* Set virtual page boundaries.
*
'query defval vpagexa'idx' 1 1'
vpage_xa=subwrd(result,3)
'query defval vpagexb'idx' 1 1'
vpage_xb=subwrd(result,3)
'query defval vpageya'idx' 1 1'
vpage_ya=subwrd(result,3)
'query defval vpageyb'idx' 1 1'
vpage_yb=subwrd(result,3)
if(vpage_yb<0)
  say 'SUBPLOT>ERROR: plot too tall. Use "-tall 1" option to fit height.'
  return
endif
if(vpage_xb>realpagewid)
  say 'SUBPLOT>ERROR: plot too wide. Remove "-tall 1" option to fit width.'
  return
endif
'set vpage 'vpage_xa' 'vpage_xb' 'vpage_yb' 'vpage_ya

*
* Set plotting area.
*
'query gxinfo'
line2=sublin(result,2)
psudopagewid=subwrd(line2,4)
psudopagehgt=subwrd(line2,6)
'query defval vpagewidpadded 1 1'
vpagewidpadded=subwrd(result,3)
'query defval vpagehgtpadded 1 1'
vpagehgtpadded=subwrd(result,3)
'query defval vpagewid 1 1'
vpagewid=subwrd(result,3)
'query defval vpagehgt 1 1'
vpagehgt=subwrd(result,3)
if(psudopagewid=realpagewid)
  rvratio=realpagewid/vpagewidpadded
else
  rvratio=realpagehgt/vpagehgtpadded
endif
parea_wid=vpagewid*rvratio
parea_hgt=vpagehgt*rvratio
parea_xa=(psudopagewid-parea_wid)/2
parea_xb=psudopagewid-(psudopagewid-parea_wid)/2
parea_ya=psudopagehgt-(psudopagehgt-parea_hgt)/2
parea_yb=(psudopagehgt-parea_hgt)/2
if(parea_xa<0);parea_xa=0;endif
if(parea_xb>=psudopagewid);parea_xb=math_format('%8.6f',psudopagewid-1e-6);endif
if(parea_ya>=psudopagehgt);parea_ya=math_format('%8.6f',psudopagehgt-1e-6);endif
if(parea_yb<0);parea_yb=0;endif
'set parea 'parea_xa' 'parea_xb' 'parea_yb' 'parea_ya

*
* Set label sizes (optional).
*
'set clopts -1 -1 '0.07*rvratio
'set xlopts 1 4 '0.09*rvratio
'set ylopts 1 4 '0.09*rvratio
'set strsiz '0.11*rvratio
say 'SUBPLOT>INFO: following setting applied.'
say ' aspect ratio = 'math_format('%.3f',xy_ratio)'.'
say ' set clopts -1 -1 'math_format('%.3f',0.07*rvratio)
say ' set xlopts 1 4 'math_format('%.3f',0.09*rvratio)
say ' set ylopts 1 4 'math_format('%.3f',0.09*rvratio)
say ' set strsiz 'math_format('%.3f',0.11*rvratio)

*
* Set xlab, ylab (optional).
*
if(_.istight.1=1 | _.isxtight.1=1)
  if(col_coordinate=1)
    'set ylab on'
  else
    'set ylab off'
  endif
endif
if(_.istight.1=1 | _.isytight.1=1)
  if(row_coordinate=nrow)
    'set xlab on'
  else
    'set xlab off'
  endif
endif

'set z '_zs' '_ze
'set t '_ts' '_te
'close 'file_number()

return
***************************************************************************************
function file_number()
*
* Get the number of files opened.
*
'q files'
line1=sublin(result,1)
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
function parseopt(instr,optprefix,optname,outname)
*
* Parse an option, store argument(s) in a global variable array.
*
rc=gsfallow('on')
cnt=1
cnt2=0
while(subwrd(instr,cnt)!='')
  if(subwrd(instr,cnt)=optprefix''optname)
    cnt=cnt+1
    word=subwrd(instr,cnt)
    while(word!='' & (valnum(word)!=0 | substr(word,1,1)''999!=optprefix''999))
      cnt2=cnt2+1
      _.outname.cnt2=parsestr(instr,cnt)
      if(_end_wrd_idx=-9999);return cnt2;endif
      cnt=_end_wrd_idx+1
      word=subwrd(instr,cnt)
    endwhile
  endif
  cnt=cnt+1
endwhile
return cnt2
***************************************************************************************
function usage()
*
* Print usage information.
*
say '  Prepare for a multi-panel plot.'
say ''
say '  USAGE: subplot <ntot> <idx> [<ncol>] [-tall 0|1] [-tight 0|1] [-xtight 0|1] [-ytight 0|1] [-scale <scalefactor>] [-xy <xyratio>]'
say '         [-xs <xspacing>] [-ys <yspacing>] [-xp <xpadding>] [-yp <ypadding>] [-hleft 0|1] [-yleft 0|1]'
say '    <ntot>: total number of panels to be plotted; no preset limit. Do NOT have to be # of rows times # of columns; will be rounded up to that value.'
say '    <idx>: index of panel, numbered from top to bottom, then left to right. In each column/row, panels with smaller <idx> MUST be plotted earlier.'
say '    <ncol>: number of columns; no preset limit. Default=2 (even if <ntot>=1).'
say '    -tall 1: fit page height.'
say '    -tight 1: leave no spaces between panels.'
say '    -xtight 1: leave no horizontal spaces between panels.'
say '    -ytight 1: leave no vertical spaces between panels.'
say '    <scalefactor>: scale factor. Default=1.'
say '    <xyratio>: aspect ratio of the plotting area. Default=1. An optimal value will be calculated for map projections.'
say '    <xspacing>: horizontal spacing in addition to default value.'
say '    <yspacing>: vertical spacing in addition to default value.'
say '    <xpadding>: horizontal padding in addition to default value.'
say '    <ypadding>: vertical padding in addition to default value.'
say '    -hleft 1: set panel height the same as the immediate left panel.'
say '    -yleft 1: align panel top to the immediate left panel.'
say ''
say '  NOTE: 1. Spacing refers to blank space between virtual pages; can be any value.'
say '        2. Padding refers to space between virtual page boundaries and plotting area; cannot be negative values.'
say '        3. For best result, set desired dimensions before running this script.'
say ''
say '  EXAMPLE 1 (2 rows by 2 columns):'
say '    set lon 120 300'
say '    set lat -25 25'
say '    set t 1'
say '    subplot 4 1'
say '    display sst'
say '    ...'
say '    set t 4'
say '    subplot 4 4'
say '    display sst'
say ''
say '  EXAMPLE 2 (3 rows by 1 column and no vertical spaces between panels):'
say '    set lon 120 300'
say '    set lat -25 25'
say '    set t 1'
say '    subplot 3 1 1 -ytight 1'
say '    display sst'
say '    ...'
say '    set t 3'
say '    subplot 3 3 1 -ytight 1'
say '    display sst'
say ''
say '  Dependencies: parsestr.gsf, qdims.gsf'
say ''
say '  Copyright (C) 2012 Bin Guan.'
say '  Distributed under GNU/GPL.'
return
