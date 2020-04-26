import pandas as pd
from shapely.geometry import Point, shape

from flask import Flask
from flask import render_template
import json


data_path = './input'
n_samples = 11


def get_location(longitude, latitude, provinces_json):
    
    point = Point(longitude, latitude)

    for record in provinces_json['features']:
        polygon = shape(record['geometry'])
        if polygon.contains(point):
            return record['properties']['name']
    return 'other'


with open(data_path + '/geojson/entidadesmexico.json') as data_file:    
    provinces_json = json.load(data_file)

app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/data")
def get_data():
   ## gen_age_tr = pd.read_csv(data_path + 'gender_age_train.csv')
    df = pd.read_csv(data_path + '/events.csv')
   ## ph_br_dev_model = pd.read_csv(data_path + 'phone_brand_device_model.csv')

   ## df = gen_age_tr.merge(ev, how='left', on='device_id')
  ##  df = df.merge(ph_br_dev_model, how='left', on='device_id')
    #Get n_samples records
    df = df[df['longitude'] != 0].sample(n=n_samples)


 

    df['location'] = df.apply(lambda row: get_location(row['longitude'], row['latitude'], provinces_json), axis=1)

    cols_to_keep = ['timestamp', 'event_id', 'longitude', 'latitude', 'tipo', 'economia', 'atencion', 'mensaje', 'location']
    df_clean = df[cols_to_keep].dropna()

    return df_clean.to_json(orient='records')


if __name__ == "__main__":
    app.run(host='0.0.0.0',port=5000,debug=True)
