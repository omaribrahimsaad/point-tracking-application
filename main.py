from typing import Any
from flask import Flask,render_template,jsonify,request
from person_database_manager import *

person_manager = PersonManager() 

app = Flask(__name__)


@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/send_number', methods=['POST'])
def receive_number():
    data:Any = request.json
    number = int(data.get('number'))
    # Perform any operation with the received number
    response = {'message': f'Received number: {number+1}'}
    print(response)
    return jsonify(response)

if __name__ == '__main__':
  app.run(host='0.0.0.0', port=5000)

