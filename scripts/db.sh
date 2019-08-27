#!/usr/bin/env bash

SCRIPTS_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)"
BACKUP_DIRECTORY=${SCRIPTS_DIR}/../backups

function docker-proxy() {
  local service="$1"
  shift
  docker exec -i $(docker-compose ps -q ${service}) $@
}

function backup() {
  mkdir -p ${BACKUP_DIRECTORY}
  docker-proxy postgres pg_dump -h localhost -U postgres -Fc postgres >${BACKUP_DIRECTORY}/dump_$(date +%d-%m-%Y"_"%H_%M_%S).sql
}

function restore() {
  LATEST_BACKUP=$(\ls -lt1 ${BACKUP_DIRECTORY} | head -n1)
  docker-proxy postgres psql -U postgres -c "drop schema public cascade; create schema public;"
  cat ${BACKUP_DIRECTORY}/${LATEST_BACKUP} | docker-proxy postgres pg_restore -U postgres -h localhost
}

case "$1" in
backup)
  backup
  ;;

restore)
  restore
  ;;
*)
  echo $"Usage: $0 {backup|restore}"
  exit 1
  ;;
esac
