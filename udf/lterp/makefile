SHELL=/bin/sh
#

SRCS=	lterp.c gautil.c 

OBJS=	lterp.o gautil.o
#
CC=	gcc
CFT=		$(CC)
LDR=		$(CC)
LDRLIBS=	-lm 
LDRFLAGS=	-o 
EXE=		lterp
EXE_OUT=	lterpi.out

#
#FFLAGS= -c -O -I$(GADDIR)/src	
FFLAGS= -c -O	

$(EXE):	$(OBJS)
	$(LDR) $(LDRFLAGS) $(EXE) $(OBJS) $(LDRLIBS)


.c.o:
	$(CFT) $(FFLAGS) $*.c

del_lists:
	-rm -f $(LISTS)

clean:
	-rm -f $(OBJS)

delexe:
	-rm -f $(EXE)
run:
	-ngrads -lc "run t.gs"
out:
	-more $(EXE_OUT)

