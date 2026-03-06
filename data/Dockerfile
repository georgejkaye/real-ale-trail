FROM python:3.14-bookworm AS builder

ARG POETRY_VERSION
RUN pip install poetry==${POETRY_VERSION}
RUN poetry install

WORKDIR /app

RUN mkdir /app/data
COPY ./venues.json /app/data/venues.json
COPY ./populate.sh /app/data/populate.sh
RUN chmod +x /app/data/populate.sh

ENTRYPOINT [ "/app/data/populate.sh" ]
