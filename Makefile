migrations:
	python ./admin/manage.py makemigrations

migrate:
	python ./admin/manage.py migrate

serve:
	@$(eval port ?=7000)
	python ./admin/manage.py runserver $(port)

shell:
	python ./admin/manage.py shell

json.export:
	@$(eval model ?=)
	@$(eval file ?=all)
	python -Xutf8 ./admin/manage.py dumpdata --format=json --natural-foreign $(model) > ./src/data/$(file).json

json.data:
	make json.export model=app.item file=items
	make json.export model=app.recipe file=recipes