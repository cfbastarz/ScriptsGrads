function main(args)
'reinit'

*'open /d1/exp/wgne/ctl/pr_gla.ctl'
*'open /d1/exp/wgne/ctl/pr_ecm.ctl'

*'open /d1/obs/oort/ua/t73.ctl'
*'open /d1/obs/nwp/ecmwf/toga_var/ec_toga_var.ctl'

'open /pcmdi/obs/mo/ta/rnl_ecm/st/ac/ta.rnl_ecm.ts.ac.7901.9402.st.ctl'
'open /pcmdi/obs/mo/ta/rnl_ncep/st/ac/ta.rnl_ncep.ts.ac.7901.9402.st.ctl'

'set x 2'
'set y 1'
'set t 1'
'set z 1 17'

'define u1=gmt'
'd u1'
'q pos'
'c'


'set dfile 2'
'define u2=gmt'
'd u2'
'q pos'
'c'

'set dfile 1'
'set gxout linefill'
'set lfcols 4 2'

'd u2-lterp(u1,u2);const(u2,0)'
return



'set gxout grfill'
'set cmin 1'

'q dims'
say result
'set dfile 2'
'q dims'
say result
'set dfile 1'
'd lterp(pr,pr.2)'

pull cmd
'c'
'set lat 0'
'define p1=pr'
'set dfile 2'
'set lat 0'
'define p2=pr'
'set dfile 1'
'd p1'
'd p2'
'd lterp(p1,p2)'

