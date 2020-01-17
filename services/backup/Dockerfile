FROM ubuntu:bionic

RUN apt-get update
RUN apt-get -y install cron wget gnupg awscli

# Install posgres client
RUN wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | apt-key add -
RUN echo "deb http://apt.postgresql.org/pub/repos/apt/ bionic-pgdg main" | tee  /etc/apt/sources.list.d/pgdg.list
RUN apt-get update
RUN apt-get -y install postgresql-client-12

# Create log file
RUN touch /var/log/cron.log

# Add backup job to crontab
COPY ./backup-cronjob .
RUN chmod +x /backup-cronjob
RUN (crontab -l 2>/dev/null; echo "0 * * * * /backup-cronjob >> /var/log/cron.log 2>&1") | crontab -

# Load environment variables and run cron
CMD env >> /etc/environment && cron && tail -f /var/log/cron.log
