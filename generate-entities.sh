source .env;
if [ -n "${DB_USERNAME:-}" ] && [ -n "${DB_PASSWORD}" ]; then
     echo "Start generator 🚀🚀🚀"
	 yarn typeorm-model-generator -h ${DB_HOST} -d ${DB_CHECK_USER_DATABASE} -u ${DB_USERNAME} -x ${DB_PASSWORD} -e ${DB_TYPE} -p ${DB_PORT} -o ./src/databases/postgresql -s prod

else
	echo "SETUP INFO: No Environment variables given!"
fi