FROM alpine:latest

RUN apk add --no-cache curl jq bash

WORKDIR /app

COPY init-keycloak.sh .
RUN chmod +x init-keycloak.sh

CMD ["./init-keycloak.sh"] 