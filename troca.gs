function bola(string)
string=string"\"
say string
i=1
while(substr(string,i,1)!="\")
 a.i=substr(string,i,1)
 if(a.i="ã")
  a.i="}"
 endif
 i=i+1
 endwhile
 imax=i-1
 j=1
 saida=""
 while(j<=imax)
  saida=saida""a.j
  j=j+1
 endwhile
 return(saida)
'quit'
