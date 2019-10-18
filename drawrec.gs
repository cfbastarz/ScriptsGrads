*
* drawrec.gs
* 
* This function draws a rectangle over a map using World Coordinates,
* i.e., longitude and latitude.
*
* Usage: drawrec lon_min lon_max lat_min lat_max &#60;fill&#62; &#60;warn on|off&#62;
*        &#60;fill&#62; can be 0 or 1
*        &#60;warn on|off&#62; can be on or off
*
* Written by Henrique Barbosa July 2004
* Last update September 05
*
function drawrec(args)

* Get arguments
    Rxa = subwrd(args,1)
    Rxb = subwrd(args,2)
    Rya = subwrd(args,3)
    Ryb = subwrd(args,4)
    fil = subwrd(arqs,5)
    opt = subwrd(args,6)

* Test for parameters
  if (Rxa='' | Rxb='' | Rya='' | Ryb='') 
    say 'usage: drawrec lon_min lon_max lat_min lat_max <fill> <warn on|off>
    return 
  endif

* Find allowed dimensions
  'q dims'
  lonlin =sublin(result,2)
  Bxa = subwrd(lonlin,6)
  Bxb = subwrd(lonlin,8)
  latlin =sublin(result,3)
  Bya = subwrd(latlin,6)
  Byb = subwrd(latlin,8)

* Test if user input within allowed dimensions
  if (opt!='off')
    if (Rya<Bya | Rya>Byb); say 'warn: lat_min='Rya' is outside range ['Bya','Byb']'; endif
    if (Ryb<Bya | Ryb>Byb); say 'warn: lat_max='Ryb' is outside range ['Bya','Byb']'; endif

    if (Rxa<Bxa | Rxa>Bxb); say 'warn: lon_min='Rxa' is outside range ['Bxa','Bxb']'; endif
    if (Rxb<Bxa | Rxb>Bxb); say 'warn: lon_max='Rxb' is outside range ['Bxa','Bxb']'; endif
  endif 

* Transform world coordinates to xy
  'q w2xy 'Rxa' 'Rya
  x1=subwrd(result,3)
  y1=subwrd(result,6)

  'q w2xy 'Rxb' 'Ryb
  x2=subwrd(result,3)
  y2=subwrd(result,6)

* Draw a Filled/Empty rectangle
  if (fil=1)
    'draw recf 'x1' 'y1' 'x2' 'y2
  else
    'draw rec 'x1' 'y1' 'x2' 'y2''
  endif
return
