from typing import Any

from flask import Flask, jsonify, render_template, request

from person_database_manager import *

person_manager = PersonManager() 

app = Flask(__name__)


@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/register',methods= ['POST'])
def register():
    data:Any = request.json
    name = str(data.get('name'))
    person_manager.AddNewPerson(name)
    return jsonify({'message':'success'})

@app.route('/api/get_person_names',methods= ['GET'])
def get_all_person_names():
    return jsonify(person_manager.GetPersonNames())


@app.route('/api/set_points',methods= ['POST'])
def set_points():
    data:Any = request.json
    name = str(data.get('name'))
    points = int(data.get('points'))
    person_manager.AddPointsToPerson(name,points)
    return jsonify({'message':'success'});

if __name__ == '__main__':
  app.run(host='0.0.0.0', port=5000)

