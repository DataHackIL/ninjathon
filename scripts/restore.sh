#!/usr/bin/env bash

function docin() {
  local service="$1"; shift
  docker exec -i $(docker-compose ps -q $service) $@
}

docker-compose exec postgres psql -c "drop schema public cascade; create schema public;"
cat $1 | docker-compose exec postgres psql -U postgres
