FROM postgres:latest


WORKDIR /db

COPY init.sh .
COPY schema schema
COPY data data
COPY code code

RUN chmod +x ./init.sh

RUN ./init.sh