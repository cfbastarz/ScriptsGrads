SHELL=/bin/sh
#
#	
#
REGRID_DIR = /usr/local/lib/grads

SRCS=	regrid2.f

OBJS=	regrid2.o
#
CFT=		f77
LDR=		f77
CFT=		f77
LDR=		f77

CFT=		g95
LDR=		g95

LDRFLAGS=	-o
#LDRFLAGS=	-32 -o

EXE=		$(REGRID_DIR)/udf/regrid2.exe
EXE=		../regrid2.exe

#FFLAGS= -c -O -32	

FFLAGS= -c -O 	

$(EXE):	$(OBJS)
	$(LDR) $(LDRFLAGS) $(EXE) $(OBJS) 

.f.o:
	$(CFT) $(FFLAGS) $*.f

del_lists:
	-rm -f $(LISTS)

clean:
	-rm -f $(OBJS)
