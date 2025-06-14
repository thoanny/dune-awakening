import sqlite3
import json

DATABASE = "./src/data/database.sqlite3"
TABLES = ['items', 'items_categories', 'items_sources', 'items_subcategories', 'items_types']


def export_sqlite_to_json(table_name):
    rows = db.execute('SELECT * from ' + table_name).fetchall()
    with open("./src/data/"+table_name+".json", "w") as f:
        f.write(json.dumps( [dict(ix) for ix in rows], indent=4 )+"\n")


conn = sqlite3.connect(DATABASE)
conn.row_factory = sqlite3.Row
db = conn.cursor()

for table in TABLES:
    export_sqlite_to_json(table)

conn.commit()
conn.close()