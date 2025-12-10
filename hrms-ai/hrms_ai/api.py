from flask import Flask, jsonify, request

app = Flask(__name__)

@app.route('/api/example', methods=['GET'])
def get_example():
    return jsonify({"message": "This is an example endpoint."})

@app.route('/api/example', methods=['POST'])
def create_example():
    data = request.json
    return jsonify({"message": "Example created.", "data": data}), 201

if __name__ == '__main__':
    app.run(debug=True)