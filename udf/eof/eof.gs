*  
* Compute Empirical Orthogonal Functions (EOFs)
*
* The current GrADS dimension environment is used for the 
* estimation of the covariance matrix.
* EOFs and PCs are written to separate grads file pairs.
* 
*
* USAGE: [run] eof [options ] <fld>
*
* with 
*    fld:            Input field (GrADS expression).
* Options: 
*   -neof <# eof>  :  Number of EOFs (default: 12) 
*   -npc <# pc>    :  Number of PCs (default: # eof)
*   -tinc <tinc>   :  Time increment (default: 1)
*   -nper <nper>   :  Minimal percent of defined data values required 
*                    for a grid point to be considered in the EOF calculation
*                    (default: 70 %)
*   -o <prefix>    :  Prefix for output files: (default: first 6 characters of <fld>)
*
* Normalization: Variance(PCs)=1
*
* NOTES: 
*        i) The data are not weighted. Use cos(lat*3.141/180) for a simple area weight.
*       ii) The program is not well tested for inputs with data gaps. 
*           Please let me know if you get wrong results with for such input. 
*      iii) Try avoiding GrADS's cyclic continuation for global data. 
*           Otherwise the cyclic points are weighted twice.
*
* (c) Matthias Munnich (munnich@atmos.ucla.edu)
*
* Example session: Compute tropical Pacific EOF of Reynolds sst 
*                  in file "sst.mnmean.nc"
*
* ga-> sdfopen sst.mnmean.nc
* ga-> set lat -30 30
* ga-> set lon 140 280
* ga-> set time jan1982 dec2000
* ga-> eof sst


function eof(arg)
*
* get options
*
rc=parsearg(arg)
if (rc = 1)
  return
endif

gxstate()
*
* Checks 
*
tdim=(_te-_ts+1)/_tinc
if(tdim<2)
  say 'Fatal error: Only one time step.'
  usage()
  return
endif
*
* write input data files
*
'set gxout fwrite'
'set fwrite eof_in.gad'

say '      Writing data to transfer file...'
tt=_ts
'set t '_ts
'd '_fld
tt=tt+_tinc
tdim=1
while (tt<=_te)
   'set t 'tt
   'd '_fld
   tt=tt+_tinc
   tdim=tdim+1
endwhile

'disable fwrite'
'set gxout contour'
* say '      Data written.'

*
* Compute EOFs and PCs
*
  'set t '_ts
  'c'
  say '      Executing eof binary ...'
  say ' '
*  say 'd eofudf('_fld','tdim','_neof','_npc', '_nper','_outb'_)'
  'd eofudf('_fld','tdim','_neof','_npc', '_nper','_outb'_)'
  if(rc != 0) 
     say '   eof.gs: First call of eofudf returned Error. STOP'
     return
  endif

*
* get time info from a UDF transfer file with varying time
*
  'set x 1'
  'set y 1'
  'set z 1'
  'set t '_ts' '_ts+_tinc
   say '      Writing time info to CTLs...'
*  suppress display output:
  'set gxout fwrite'
  'set fwrite /dev/null'
*   say '     d eofudf('_fld',-'_tinc')'
  'd eofudf('_fld',-'_tinc')'
  'disable fwrite'
  'set gxout contour'
*
* Reset environment
*
  'set lon '_lons' '_lone
  'set lat '_lats' '_late
  'set lat '_levs' '_leve
  'set t '_ts' '_te

* '!\rm -f eof_in.gad eofudf.in eofudf.out eofudfpa.out'
return
******************************************************
******************************************************
function gxstate()
*
*  Get dimension information as global var _xs,_xe,...
*
'query dim'
dinf = result
lx = sublin(dinf,2)
ly = sublin(dinf,3)
lz = sublin(dinf,4)
lt = sublin(dinf,5)
if ( subwrd(lx,7) = 'to')
  _lons = subwrd(lx,6)
  _lone = subwrd(lx,8)
  _xs = subwrd(lx,11)
  _xe = subwrd(lx,13)
else
  _lons = subwrd(lx,6)
  _lone = subwrd(lx,6)
  _xs = subwrd(lx,9)
  _xe = subwrd(lx,9)
endif
if ( subwrd(ly,7) = 'to')
  _lats = subwrd(ly,6)
  _late = subwrd(ly,8)
  _ys = subwrd(ly,11)
  _ye = subwrd(ly,13)
else
  _lats = subwrd(ly,6)
  _late = subwrd(ly,6)
  _ys = subwrd(ly,9)
  _ye = subwrd(ly,9)
endif
if ( subwrd(lz,7) = 'to')
  _levs = subwrd(lz,6)
  _leve = subwrd(lz,8)
  _zs = subwrd(lz,11)
  _ze = subwrd(lz,13)
else
  _levs = subwrd(lz,6)
  _leve = subwrd(lz,6)
  _zs = subwrd(lz,9)
  _ze = subwrd(lz,9)
endif
if ( subwrd(lt,7) = 'to')
  _tims = subwrd(lt,6)
  _time = subwrd(lt,8)
  _ts = subwrd(lt,11)
  _te = subwrd(lt,13)
else
  _tims = subwrd(lt,6)
  _time = subwrd(lt,6)
  _ts = subwrd(lt,9)
  _te = subwrd(lt,9)
endif
return
*****************************************************
function parsearg(arg)
* Defaults
_neof=12
_nper=70
_npc=-1
_verb=0
_tinc=1
_outb=''

i=1
word=subwrd(arg,i)
if(word = '')
  usage()
  return 1
endif

while (substr(word,1,1) = '-') 
  if (word = '-neof')
     i=i+1
     _neof=subwrd(arg,i)
  else
    if (word = '-npc') 
       i=i+1
       _npc=subwrd(arg,i)
    else
      if (word = '-nper')
        i=i+1
        _nper=subwrd(arg,i)
      else
        if (word = '-o' | word = '-outname')
          i=i+1
          _outb=subwrd(arg,i)
        else
          if(word = '-v' | word = '-verbos')
            _verb = 1
          else
            if(word = '-tinc')
              i=i+1
              _tinc=subwrd(arg,i)
            else
              say ' Unknown option: "'word'"'
              usage()
              return 1
            endif
          endif              
        endif
      endif
    endif
  endif
  i=i+1
  word=subwrd(arg,i)
endwhile

_fld=subwrd(arg,i)
if(_outb= '') 
   _outb=substr(_fld,1,6)
endif
if(_fld = '')
  say ' Fatal: Missing field expression'
  usage()
  return 1
endif
if(_verb>0)
  printopt()
endif
return 0

*****************************************************
function printopt()
say '      Number of EOFs:' _neof
say '      Number of PCs:' _npc
say '      Time increment:' _tinc
say '      Required % of good data:' _nper
say '      Output files basename:' _outb
say '      Field undef:' _undef
say '      Field file is XDF:' _xdf
say '      EOF of :' _fld
* say '      Verbose:' _verb
return
*****************************************************
function usage()
say ' EOF: Compute Empirical Orthogonal Functions (EOFs)'
say '                eof.gs Version 0.14'
say ' '
say ' USAGE: eof [options] fld'
say ' '
say ' with '
say '    fld:            Input field (GrADS expression).'
say ' '
say ' OPTIONS: '
say '   -neof <# eof> :  Number of EOFs (default: 12)'
say '   -npc <# pc>   :  Number of PCs (default: # eof)'
say '   -tinc <tinc>  :  Time increment (default: 1)'
say '   -nper <nper>  :  Minimal percent of defined data values required '
say '                    for a grid point to be considered in the EOF calculation'
say '                    (default: 70 %)'
say '   -o <prefix>   :  Prefix for files: (default: first 6 characters of <fld>)'
say ' NOTES: '
say '        i) The data are not weighted. Use cos(lat*3.141/180) for a simple area weight.'
say '       ii) The program is not well tested for inputs with data gaps.'
say '           Please let me know if you get wrong results with for such input.'
say ' (c) Matthias Munnich (munnich@atmos.ucla.edu)'
return
*****************************************************
*****************************************************
