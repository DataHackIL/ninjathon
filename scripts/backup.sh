#!/usr/bin/env bash

docker-compose exec postgres pg_dump -h localhost -U postgres -Fc postgres > dump_`date +%d-%m-%Y"_"%H_%M_%S`.sql