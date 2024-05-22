from flask import Flask,render_template,jsonify,request

app = Flask(__name__)


@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/send_number', methods=['POST'])
def receive_number():
    data = request.json
    number = data.get('number')
    # Perform any operation with the received number
    response = {'message': f'Received number: {number+1}'}
    return jsonify(response)

if __name__ == '__main__':
  app.run(host='0.0.0.0', port=5000)
