Subject: grb2bin.gs
**************************************************************
*                                                            *
*   Rotina para converter um arquivo grib para uma binario   *
*                                                            *
*                         Versao 2.0 a                       *
*                                                            *
*  Usage:> gradsc -blc "run grb2bin.gs /path/ namefile.ctl n"*
*                                                            *
*    exemplo de open no FORTRAN do arquivo gerado:           *
*              Open(10,FILE=INFILE(1:IND), Status='Old',     *
*   &           FORM='UNFORMATTED',recordtype='stream')      *
*                                                            *
*                    Luiz Fernado Sapucci                    *
*         Grupo de assimilacao de dados CPTEC-INPE-MCT       *
*                                                            *
**************************************************************
*                                                            *
**************************************************************
*                 Procedimento iniciais:                     *
**************************************************************
*
function grb2bin(arg)
'reinit'
pathin=subwrd(arg,1)
filein=subwrd(arg,2)
tempGR=subwrd(arg,3)
fileout=substr(filein,1,29)
*
'open 'pathin''filein''
*
say 'Arquivo ctl de entrada: 'pathin''filein''
*
'set t 'tempGR''
* Gerando um gif do iwv para verificacao
'set gxout contour'
'd 'agpl''
'printim 'fileout'.iwv.gif gif'
*
'set gxout fwrite'
'set fwrite 'fileout'.bin' 
say 'Gerando arquivo saida:  'fileout'.bin' 
say 'tempo: 'tempGR''
*
**************************************************************
*     Gerando o novo arquivo ctl para o arquivo binario      *
**************************************************************
*
ret=read(''pathin''filein'')
texto=sublin(ret,2)
nome=substr(texto,1,39)
ret=write(''fileout'.bin.ctl','dset ^'fileout'.bin')
*
arma=0
rc=0
while(rc=0)
  ret=read(''pathin''filein'')
  rc=sublin(ret,1)
  if(rc=0)
    texto=sublin(ret,2)
    item=subwrd(texto,1)
    if (''item''!='dtype')
      if(''item''!='index');ret=write(''fileout'.bin.ctl',''texto'');endif 
    endif 
    if (''item''='zdef');nlevel=subwrd(texto,2);endif    
    if (''item''='endv');arma=0;endif  
    if (arma=1)
      nlvar=subwrd(texto,2)
*                                                           
**************************************************************
*       Grava no arquivo as variaveis de superficie          *
**************************************************************
* 
      if (nlvar=0)
        'd 'item''
      endif
*
**************************************************************
*          Grava no arquivo as variaveis de altitude         *
**************************************************************
*
      if (nlvar=nlevel)      
        k=1
        while(k<=nlevel)
          'set z 'k
          'd 'item''
          k = k + 1
        endwhile 
      endif     
* 
    endif 
    if (''item''='vars');arma=1;endif
  endif  
endwhile 
*
**************************************************************
*                Procedimento finais                         *
**************************************************************
*
'disable fwrite' 
'quit'