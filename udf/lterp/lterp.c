#include <stdio.h>
#include <math.h>
#include <malloc.h>
#include <string.h>
#include "grads.h"

int getgrd (float **, float **, float **, float **);
int getchr (char **) ;

/* Routine to perform bi-linear interpolation between two arbitrary grids.
   Implemented as an external function to the GrADS package. */

FILE *ifile,*ofile;
char *lopt1=NULL;

main () {
struct dt dtim;
float *x1,*y1,*r1,*x2,*y2,*r2,*v1,*v2,*xt1,*xt2,*yt1,*yt2;
int isiz1,isiz2,jsiz1,jsiz2,idim1,idim2,jdim1,jdim2;
int siz,jdir2,idir2,nargs;
int fcosx=0,fcosy=0,flnx=0,flny=0;
int i,j,ij,ij2,rc,i1,i2,j1,j2,ilinr,jlinr;
float u1,u2,tstrt1,tstrt2,tscl,rd,xd,yd,t1,t2;
float vv[20];
float d2r=3.141592654/180.0,r2d=180/3.141592654;

  /* Open files */

  ifile = fopen("lterp.in","rb");
  if (ifile==NULL) {
    printf ("Error from lterp:  Could not open lterp.in\n");
    return(1);
  }

  ofile = fopen("lterp.out","wb");
  if (ofile==NULL) {
    printf ("Error from lterp:  Could not open terp.out\n");
    return(1);
  }

  /* Read header */

  rc = fread (vv,sizeof(float),20,ifile);
  if (rc<20) {
    printf ("Error from lterp:  Read error on lterp.in\n");
    goto err;
  }

  nargs = (int)vv[0];

  /* Read grids */

  rc = getgrd (&v1,&r1,&x1,&y1);
  if (rc) goto err;
  rc = getgrd (&v2,&r2,&x2,&y2);
  if (rc) goto err;



  /* read char param */

  i=2;
  while( i<nargs )  { 

    rc = getchr (&lopt1);
    if (rc) goto err;


    if(!strncmp(lopt1,"cosx",4)) fcosx=1;
    if(!strncmp(lopt1,"cosy",4)) fcosy=1;
    if(!strncmp(lopt1,"cosxy",5)) { fcosx=1; fcosy=1; }

    if(!strncmp(lopt1,"lnx",3)) flnx=1;
    if(!strncmp(lopt1,"lny",3)) flny=1;
    if(!strncmp(lopt1,"lnxy",4)) { flnx=1; flny=1; }

    i++;

  }

  /* Get needed info from the grid headers */

  u1 = v1[0];
  idim1 = floor(v1[1]+0.5);
  jdim1 = floor(v1[2]+0.5);
  isiz1 = floor(v1[3]+0.5);
  jsiz1 = floor(v1[4]+0.5);
  u2 = v2[0];
  idim2 = floor(v2[1]+0.5);
  jdim2 = floor(v2[2]+0.5);
  isiz2 = floor(v2[3]+0.5);
  jsiz2 = floor(v2[4]+0.5);
  ilinr = floor(v2[5]+0.5);
  jlinr = floor(v2[6]+0.5);


/*printf("jjjj %d %d %d %d %d %d\n",idim1,jdim1,idim2,jdim2,ilinr,jlinr);*/

/*

for(i=0;i<20;i++) printf("t1 %d %g\n",i,v1[i]);
for(i=0;i<20;i++) printf("t2 %d %g\n",i,v2[i]);

if(ilinr == 0) {
  for(i=0;i<isiz1;i++) printf("x1 %d %g\n",i,*(x1+i));
  for(i=0;i<isiz2;i++) printf("x2 %d %g\n",i,*(x2+i));
}

if(jlinr == 0) {
  for(i=0;i<jsiz1;i++) printf("y1 %d %g\n",i,*(y1+i));
  for(i=0;i<jsiz2;i++) printf("y2 %d %g\n",i,*(y2+i));
}

*/

  /* Verify that the data is valid -- the varying dimension must be
     equivalent, and if the time dimension varies, the time increment
     must be equivalent (we won't interpolate from months to minutes) */

  if (idim1!=idim2 || jdim1!=jdim2 || idim1==-1 ) {
    printf ("Error from lterp:  Grids have non-matching dimensions\n");
    goto err;
  }

  if (idim1==3 || jdim1==3) {
    if (  (v1[16]<0.5 && v2[16]>0.8) || (v1[16]>0.8 && v2[16]<0.5) ) {
      printf ("Error from lterp:  Invalid time increments\n");
      goto err;
    }
  }

  /* Normalize the time coordinates.  We want the grid time values to
     be the same coordinate system for each grid.  */

  if (idim1==3 || jdim1==3) {
/*
  abort because it doesn't work....
*/
    printf("\nlterp does not work with time varying grids as yet");

    goto err;

    dtim.yr = v1[11]+0.5;
    dtim.mo = v1[12]+0.5;
    dtim.dy = v1[13]+0.5;
    dtim.hr = v1[14]+0.5;
    dtim.mn = v1[15]+0.5;

    tstrt1 = t2gr(&v1[11],&dtim);

    dtim.yr = v2[11]+0.5;
    dtim.mo = v2[12]+0.5;
    dtim.dy = v2[13]+0.5;
    dtim.hr = v2[14]+0.5;
    dtim.mn = v2[15]+0.5;
    tstrt2 = t2gr(&v2[11],&dtim);

    if (v1[17]>0.8) tscl = v2[17]/v1[17];
    else tscl = v2[16]/v1[16];
    if (idim2==3) {
      for (i=0; i<isiz2; i++) *(x2+i) = tstrt2+tscl*(float)i;
    } else {
      for (i=0; i<jsiz2; i++) *(y2+i) = tstrt2+tscl*(float)i;
    }
  }

/* store original x,y grids of second expression */

  if(ilinr == 0) { 
    xt2 = (float *)malloc(sizeof(float)*isiz2);
    for(i=0;i<isiz2;i++) *(xt2+i)=*(x2+i);
  }

  if(jlinr == 0) {
    yt2 = (float *)malloc(sizeof(float)*jsiz2);
    for(j=0;j<jsiz2;j++) *(yt2+j)=*(y2+j);
  }

  /* ln scaling */

  if( nargs > 2) {

    if( flny ) {

      printf("qqq lny scaling \n");
/*
  special case for ln scaling of pressure; if zero set to 1 mb 
  this does not affect  the interpolation because the data are undef
*/

      for (j=0;j<jsiz1;j++) {
	if(*(y1+j) == 0) {
	  *(y1+j)=1;
	} else if(*(y1+j) > 0) {
	  *(y1+j)= log(*(y1+j));
	} else if(*(y1+j) < 0) {
	  *(y1+j)=0;
	  printf ("WARNING from lterp 1:  y <= 0 ; setting to 0\n");
/*	  goto err; */
	}
      }
      for (j=0;j<jsiz2;++j) {
	if(*(y2+j) == 0) {
	  *(y2+j)=1;
	} else if(*(y2+j) > 0) {
	  *(y2+j)= log(*(y2+j));
	} else {
	  printf ("Error from lterp 2:  y <= 0 for ln(x)y interp\n");
	  goto err;
	}
      }
    }

    if( flnx ) {

      printf("qqq lnx scaling \n");

      for (i=0;i<isiz1;i++) {
	if(*(x1+i) > 0) {
	  *(x1+i)= log(*(x1+i));
	} else {
	  printf ("Error from lterp:  x <= 0 for lnx(y) interp\n");
	  goto err;
	}
      }
      for (i=0;i<isiz2;i++) {
	if(*(x2+i) > 0) {
	  *(x2+i)= log(*(x2+i));
	} else {
	  printf ("Error from lterp:  x <= 0 for lnx(y) interp\n");
	  goto err;
	}
      }
    }

    /* colatitude cos weighting */

    if( fcosy ) {

      printf("qqq cosy scaling \n");
      for (j=0;j<jsiz1;j++) { 
	*(y1+j)=  cos( ( *(y1+j) + 90.0 )*d2r ); 
      }
      for (j=0;j<jsiz2;j++) {
	*(y2+j) =  cos( ( *(y2+j) + 90.0 )*d2r ) ; 
      }

    }

    if( fcosx ) {
      printf("qqq cosx scaling \n");
      for (i=0;i<isiz1;i++) { 
	*(x1+i)=  cos( ( *(x1+i) + 90.0 )*d2r ); 
      }
      for (i=0;i<isiz2;i++) {
	*(x2+i) =  cos( ( *(x2+i) + 90.0 )*d2r ) ; 
      }
    }

  }


/*
  for(j=0;j<jsiz1;j++) printf("%g ",*(y1+j)); printf("\n");
  for(j=0;j<jsiz2;j++) printf("%g ",*(y2+j)); printf("\n");
*/
  /* see which way the x y vary with i */

  if(ilinr == 0 ) {
    idir2=-1;
    if( *(x2+1) > *x2 ) idir2=1;
  } else {
    idir2=1;
  }

  if(jlinr == 0) {
    jdir2=-1;
    if( *(y2+1) > *y2 ) jdir2=1;
  } else {
    jdir2=1;
  }

  /*

 printf("qx %g %g %d\n",*(x2+1),*x2,idir2);
 printf("qy %g %g %d\n",*(y2+1),*y2,jdir2);
 */

  /* We can now do the interpolation.  It is handled differently
     for 1-D vs. 2-D */

  if (jdim1<0) {

/*
    printf("qqq 1d %d %d \n",isiz1,isiz2);
*/

    i1 = -1;
    for (i2=0; i2<isiz2; i2++) {

      if(idir2 == 1) {
	while (i1<isiz1-1 && *(x1+i1+1)<=*(x2+i2)) i1++;
      } else {
	while (i1<isiz1-1 && *(x1+i1+1)>=*(x2+i2)) i1++;
      } 

      if (i1==isiz1-1 && *(x1+i1)==*(x2+i2)) i1--;
      if (i1<0 || i1>isiz1-2 || *(r1+i1)==u1 || *(r1+i1+1)==u1) *(r2+i2)=u2;
      else {
        xd = *(x1+i1+1) - *(x1+i1);
        rd = *(r1+i1+1) - *(r1+i1);
        *(r2+i2) = *(r1+i1)+(*(x2+i2)-*(x1+i1))*rd/xd;
      }
    }
  } else {
    j1 = -1;
    for (j2=0; j2<jsiz2; j2++) {

      if(jdir2 == 1) {
	while (j1<jsiz1-1 && *(y1+j1+1)<=*(y2+j2)) j1++;
      }else{
	while (j1<jsiz1-1 && *(y1+j1+1)>=*(y2+j2)) j1++;
      }

      if (j1==jsiz1-1 && *(y1+j1)==*(y2+j2)) j1--;
      i1 = -1;

      for (i2=0; i2<isiz2; i2++) {

	if(idir2 == 1) {
	  while (i1<isiz1-1 && *(x1+i1+1)<=*(x2+i2)) i1++;
	} else {
	  while (i1<isiz1-1 && *(x1+i1+1)>=*(x2+i2)) i1++;
	} 
        if (i1==isiz1-1 && *(x1+i1)==*(x2+i2)) i1--;
        ij = j1*isiz1+i1;
        ij2 = j2*isiz2+i2;
        if ( i1<0 || i1>isiz1-2 || j1<0 || j1>jsiz1-2 ||
             *(r1+ij)==u1 || *(r1+ij+1)==u1 ||
             *(r1+ij+isiz1)==u1 || *(r1+ij+isiz1+1)==u1 ) *(r2+ij2) = u2;
        else {
          yd = *(y1+j1+1) - *(y1+j1);
          rd = *(r1+ij+isiz1) - *(r1+ij);
          t1 = *(r1+ij) + (*(y2+j2)-*(y1+j1))*rd/yd;
          rd = *(r1+ij+isiz1+1) - *(r1+ij+1);
          t2 = *(r1+ij+1) + (*(y2+j2)-*(y1+j1))*rd/yd;
          xd = *(x1+i1+1) - *(x1+i1);
          *(r2+ij2) = t1 + (*(x2+i2)-*(x1+i1))*(t2-t1)/xd;
        }
      }
    }
  }

  /* Write result to return file */

  vv[0] = 0.0;
  vv[1] = 0.0;
  fwrite (vv,sizeof(float),20,ofile);
  fwrite (v2,sizeof(float),20,ofile);
  siz = isiz2 * jsiz2;
  fwrite (r2,sizeof(float),siz,ofile);

/* restore the dimension arrays to their original values */

  if (ilinr!=1) {
    if(nargs > 2) {
      for (i=0;i<isiz2;i++) *(x2+i) = *(xt2+i);
    }
    fwrite (x2,sizeof(float),isiz2,ofile);
  }

  if (jdim2>-1 && jlinr!=1) {
    if(nargs > 2) {
      for (j=0;j<jsiz2;j++) *(y2+j) = *(yt2+j) ;
    }
    fwrite (y2,sizeof(float),jsiz2,ofile);
  }

/*  if (nargs>2) fwrite(lopt1,sizeof(char),80,ofile);
*/

  fclose(ifile);
  fclose(ofile);
  return (0);

err:

  vv[0] = 1.0;
  fwrite (vv,sizeof(float),20,ofile);
  fclose (ofile);
  fclose (ifile);
  return (1);
}


/* Read grid information; allocate storage as needed.
   v = header, r = grid, x = xcoords, y = ycoords */

int getgrd (float **v, float **r, float **x, float **y) {
int siz,isiz,jsiz;
int idim,jdim,rc;
float *vv;

  /* Allocate and read header vals */

  *v = (float *)malloc(sizeof(float)*20);
  if (*v==NULL) goto merr;
  rc = fread (*v,sizeof(float),20,ifile);
  if (rc<20) goto ierr;

  /* Allocate and read grid */

  vv = *v;
  idim = floor(*(vv+1)+0.1);
  jdim = floor(*(vv+2)+0.1);
  isiz = (*(vv+3)+0.5);
  jsiz = (*(vv+4)+0.5);

  siz = isiz*jsiz;
  *r = (float *)malloc(sizeof(float)*siz);
  if (*r==NULL) goto merr;
  rc = fread (*r,sizeof(float),siz,ifile);
  if (rc<siz) goto ierr;

  /* Allocate and read scaling values, if needed */

  if (idim>-1) { 
    *x = (float *)malloc(sizeof(float)*isiz);
    if (*x==NULL) goto merr;
    rc = fread(*x,sizeof(float),isiz,ifile);
    if (rc<isiz) goto ierr;

  }
  if (jdim>-1) { 
    *y = (float *)malloc(sizeof(float)*jsiz);
    if (*y==NULL) goto merr;
    rc = fread(*y,sizeof(float),jsiz,ifile);
    if (rc<jsiz) goto ierr;
  }

  /* Return */

  return (0);

/* Errors */

merr:

  printf ("Error in lterp: Unable to allocate storage \n");
  return (1);

ierr:

  printf ("Error in lterp: I/O Error reading transfer file\n");
  return (1);
}

/* Read char record
   v = header, r = grid, x = xcoords, y = ycoords */

int getchr (char **v) {
int rc;

  /* Allocate and read header vals */

  *v = (char *)malloc(sizeof(char)*80);
  if (*v==NULL) goto merr;
  rc = fread (*v,sizeof(char),80,ifile);
  if (rc<80) goto ierr;

  /* Return */

  return (0);

/* Errors */

merr:

  printf ("Error in lterp: Unable to allocate storage \n");
  return (1);

ierr:

  printf ("Error in lterp: I/O Error reading transfer file\n");
  return (1);
}

void gaprnt (int i, char *ch) {
  printf ("%s",ch);
}

